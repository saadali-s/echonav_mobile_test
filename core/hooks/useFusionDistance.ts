import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import { STATIC_AUDIO } from '../constants/AudioDictionary';
import { useKinematics } from './useKinematics';
import { usePDR } from './usePDR';
import { useRSSIKalman } from './useRSSIKalman';

Audio.setAudioModeAsync({
  staysActiveInBackground: true,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
});

const STRIDE_LENGTH = 0.7; 

export const useFusionDistance = (
    rawRSSI: number | null, 
    calibratedBaseline: number, 
    audioUri: string | null = null,
    maneuverCode: string | null = null,
    onDestinationReached?: () => void 
) => {
  const { filter: kalmanFilter, reset: resetKalman } = useRSSIKalman();
  const { steps } = usePDR();
  
  // THE FIX: Inject the Kinematics engine
  const { isSpinning, hasTurnedAround, clearTurnWarning } = useKinematics(steps);

  const [distance, setFusedDistance] = useState<number | null>(null);
  const [metrics, setMetrics] = useState({ rawRSSI: 0, smoothRSSI: 0, rawDist: 0 });
  
  const isNearRef = useRef<boolean>(false);
  const lastAnnouncementTime = useRef<number>(0);
  
  const prevSteps = useRef<number>(0);
  const hybridDistanceRef = useRef<number | null>(null);

  const callbackRef = useRef(onDestinationReached);
  useEffect(() => {
      callbackRef.current = onDestinationReached;
  }, [onDestinationReached]);

  const calculateBleDistance = (rssi: number) => {
    return Math.pow(10, (calibratedBaseline - rssi) / (10 * 2.5));
  };

  const playAudioSequence = async (maneuver: string | null, uri: string | null) => {
    try {
      if (maneuver && maneuver in STATIC_AUDIO) {
        const safeManeuver = maneuver as keyof typeof STATIC_AUDIO;
        console.log(`[Audio Engine] Playing Maneuver: ${safeManeuver}`);
        const { sound: maneuverSound } = await Audio.Sound.createAsync(STATIC_AUDIO[safeManeuver]);
        await maneuverSound.playAsync();
        
        await new Promise<void>((resolve) => {
          maneuverSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              maneuverSound.unloadAsync();
              resolve();
            } else if (!status.isLoaded && (status as any).error) {
              resolve(); 
            }
          });
        });
      }
      
      if (uri) {
        console.log(`[Audio Engine] Playing TTS Landmark: ${uri}`);
        const { sound: ttsSound } = await Audio.Sound.createAsync({ uri });
        await ttsSound.playAsync();
        
        await new Promise<void>((resolve) => {
          ttsSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              ttsSound.unloadAsync();
              resolve();
            } else if (!status.isLoaded && (status as any).error) {
              resolve();
            }
          });
        });
      }
    } catch (error) {
      console.error("[Audio Engine] Sequence playback failed:", error);
    }
  };

  const triggerAudio = useCallback(() => {
    playAudioSequence(maneuverCode, audioUri);
  }, [maneuverCode, audioUri]);

  useEffect(() => {
    if (rawRSSI === null) return;

    let smoothRSSI = kalmanFilter(rawRSSI);
    const bleDist = calculateBleDistance(smoothRSSI);

    if (hybridDistanceRef.current === null) {
        hybridDistanceRef.current = bleDist;
        prevSteps.current = steps;
    } else {
        const stepsTaken = steps - prevSteps.current;
        if (stepsTaken > 0) {
            // THE FIX: Spin-Lock logic. Do not deduct distance if they are spinning.
            if (!isSpinning) {
                hybridDistanceRef.current -= (stepsTaken * STRIDE_LENGTH);
            }
            prevSteps.current = steps;
        }
        
        // THE FIX: Pause the Kalman filter pull if spinning wildly
        if (!isSpinning) {
            hybridDistanceRef.current = (hybridDistanceRef.current * 0.9) + (bleDist * 0.1);
        }
    }

    let displayDistance = Math.max(0, hybridDistanceRef.current);

    setMetrics({
        rawRSSI: rawRSSI,
        smoothRSSI: parseFloat(smoothRSSI.toFixed(1)),
        rawDist: parseFloat(bleDist.toFixed(2))
    });

    const now = Date.now();
    const isPhysicallyTouching = smoothRSSI >= calibratedBaseline;

    if (isPhysicallyTouching && !isNearRef.current) {
        if (now - lastAnnouncementTime.current > 8000) {
            isNearRef.current = true;
            lastAnnouncementTime.current = now;
            console.log(`[Smart Hybrid] ARRIVAL: Hit exact baseline ${calibratedBaseline} dBm.`);
            
            Vibration.vibrate([0, 400, 200, 400]); 
            triggerAudio();
            
            if (callbackRef.current) callbackRef.current();
        }
    } else if (smoothRSSI < calibratedBaseline - 10) {
        isNearRef.current = false;
    }

    setFusedDistance(parseFloat(displayDistance.toFixed(2)));
  }, [rawRSSI, steps, kalmanFilter, calibratedBaseline, audioUri, maneuverCode, triggerAudio, isSpinning]); 

  const resetFusion = useCallback(() => {
    resetKalman();
    setFusedDistance(null);
    hybridDistanceRef.current = null;
    prevSteps.current = 0;
    isNearRef.current = false;
    lastAnnouncementTime.current = 0;
  }, [resetKalman]);

  // Export the new kinematic states
  return { distance, metrics, resetFusion, steps, triggerAudio, isSpinning, hasTurnedAround, clearTurnWarning };
};