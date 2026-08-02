import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { Vibration } from "react-native";
import { STATIC_AUDIO } from "../constants/AudioDictionary";
import { useKinematics } from "./useKinematics";
import { usePDR } from "./usePDR";
import { useRSSIKalman } from "./useRSSIKalman";

Audio.setAudioModeAsync({
  staysActiveInBackground: true,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
});

const STRIDE_LENGTH = 0.7;
const GHOST_WALK_SPEED = 1.4;

export const useFusionDistance = (
  rawRSSI: number | null,
  calibratedBaseline: number,
  targetUuid: string | null,
  initialRouteDistance: number | null,
  audioUri: string | null = null,
  maneuverCode: string | null = null,
  onDestinationReached?: () => void,
) => {
  const { filter: kalmanFilter, reset: resetKalman } = useRSSIKalman();
  const { steps } = usePDR();
  const { isSpinning, hasTurnedAround, clearTurnWarning } =
    useKinematics(steps);

  const [distance, setFusedDistance] = useState<number | null>(null);
  const [metrics, setMetrics] = useState({
    rawRSSI: 0,
    smoothRSSI: 0,
    rawDist: 0,
  });

  const isNearRef = useRef<boolean>(false);
  const lastAnnouncementTime = useRef<number>(0);

  const prevSteps = useRef<number>(0);
  const hybridDistanceRef = useRef<number | null>(null);
  const rssiBufferRef = useRef<number[]>([]);

  const lastTickTimeRef = useRef<number>(Date.now());

  const callbackRef = useRef(onDestinationReached);
  useEffect(() => {
    callbackRef.current = onDestinationReached;
  }, [onDestinationReached]);

  useEffect(() => {
    if (initialRouteDistance !== null) {
      hybridDistanceRef.current = initialRouteDistance;
      prevSteps.current = steps;
      isNearRef.current = false;
      rssiBufferRef.current = [];
      lastTickTimeRef.current = Date.now();
      console.log(
        `\n[Physics Engine] Route Booted. Compass aggressively locked to: ${initialRouteDistance}m`,
      );
    }
  }, [initialRouteDistance, targetUuid]);

  const calculateBleDistance = (rssi: number) =>
    Math.pow(10, (calibratedBaseline - rssi) / (10 * 2.5));

  const playAudioSequence = async (
    maneuver: string | null,
    uri: string | null,
  ) => {
    try {
      if (maneuver && maneuver in STATIC_AUDIO) {
        const safeManeuver = maneuver as keyof typeof STATIC_AUDIO;
        const { sound: maneuverSound } = await Audio.Sound.createAsync(
          STATIC_AUDIO[safeManeuver],
        );
        await maneuverSound.playAsync();
        await new Promise<void>((resolve) =>
          maneuverSound.setOnPlaybackStatusUpdate((s: any) => {
            if (s.didJustFinish || s.error) resolve();
          }),
        );
      }
      if (uri) {
        const { sound: ttsSound } = await Audio.Sound.createAsync({ uri });
        await ttsSound.playAsync();
        await new Promise<void>((resolve) =>
          ttsSound.setOnPlaybackStatusUpdate((s: any) => {
            if (s.didJustFinish || s.error) resolve();
          }),
        );
      }
    } catch (error) {}
  };

  const triggerAudio = useCallback(
    () => playAudioSequence(maneuverCode, audioUri),
    [maneuverCode, audioUri],
  );

  useEffect(() => {
    if (rawRSSI === null || hybridDistanceRef.current === null) return;

    const now = Date.now();
    const deltaSeconds = (now - lastTickTimeRef.current) / 1000;
    lastTickTimeRef.current = now;

    let smoothRSSI = kalmanFilter(rawRSSI);
    const bleDist = calculateBleDistance(smoothRSSI);

    rssiBufferRef.current.push(smoothRSSI);
    if (rssiBufferRef.current.length > 4) rssiBufferRef.current.shift();
    const avgRSSI =
      rssiBufferRef.current.reduce((a, b) => a + b, 0) /
      rssiBufferRef.current.length;

    let currentDistance = hybridDistanceRef.current;
    const stepsTaken = steps - prevSteps.current;

    if (stepsTaken > 0) {
      if (!isSpinning) {
        currentDistance -= stepsTaken * STRIDE_LENGTH;
        console.log(
          `[Physics Engine] Pedometer Fired. -${(stepsTaken * STRIDE_LENGTH).toFixed(2)}m`,
        );
      }
      prevSteps.current = steps;
    } else if (bleDist < currentDistance - 0.5) {
      const simulatedDistanceDeduction = GHOST_WALK_SPEED * deltaSeconds;
      currentDistance = Math.max(
        bleDist,
        currentDistance - simulatedDistanceDeduction,
      );
    }

    hybridDistanceRef.current = Math.max(0, currentDistance);

    setMetrics({
      rawRSSI,
      smoothRSSI: parseFloat(smoothRSSI.toFixed(1)),
      rawDist: parseFloat(bleDist.toFixed(2)),
    });

    const distanceThreshold = initialRouteDistance
      ? initialRouteDistance * 0.6
      : 999;
    const isArmed = hybridDistanceRef.current <= distanceThreshold;
    const isPhysicallyTouching =
      rssiBufferRef.current.length === 4 && avgRSSI >= calibratedBaseline - 2;

    if (isPhysicallyTouching && !isNearRef.current) {
      if (!isArmed) {
        if (Math.random() < 0.1) {
          console.log(
            `[Physics Engine] High Signal (${avgRSSI.toFixed(1)} dBm) IGNORED. Arming at < ${distanceThreshold.toFixed(1)}m. Current: ${hybridDistanceRef.current.toFixed(1)}m`,
          );
        }
      } else if (now - lastAnnouncementTime.current > 8000) {
        isNearRef.current = true;
        lastAnnouncementTime.current = now;
        console.log(
          `[Physics Engine] ARRIVAL CONFIRMED: 2-Sec Avg ${avgRSSI.toFixed(1)} dBm crossed Baseline ${calibratedBaseline} dBm.`,
        );

        hybridDistanceRef.current = 0;
        currentDistance = 0;

        Vibration.vibrate([0, 400, 200, 400]);
        triggerAudio();
        if (callbackRef.current) callbackRef.current();
      }
    } else if (avgRSSI < calibratedBaseline - 15) {
      isNearRef.current = false;
    }

    setFusedDistance(parseFloat(currentDistance.toFixed(2)));
  }, [
    rawRSSI,
    steps,
    kalmanFilter,
    calibratedBaseline,
    audioUri,
    maneuverCode,
    triggerAudio,
    isSpinning,
    initialRouteDistance,
  ]);

  const resetFusion = useCallback(() => {
    resetKalman();
    setFusedDistance(null);
    hybridDistanceRef.current = null;
    prevSteps.current = 0;
    isNearRef.current = false;
    lastAnnouncementTime.current = 0;
    rssiBufferRef.current = [];
  }, [resetKalman]);

  return {
    distance,
    metrics,
    resetFusion,
    steps,
    triggerAudio,
    isSpinning,
    hasTurnedAround,
    clearTurnWarning,
  };
};
