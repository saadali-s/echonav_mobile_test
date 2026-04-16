import { useCallback, useEffect, useRef, useState } from 'react';
import { usePDR } from './usePDR';
import { useRSSIKalman } from './useRSSIKalman';
// import * as Speech from 'expo-speech'; // <-- Temporarily disabled for modular Audio Engine later

const TX_POWER_1M = -65; 
const PATH_LOSS_EXP = 3.0; 
const PROXIMITY_TRIGGER = 2.0; 
const ABSOLUTE_OVERRIDE_RSSI = -73;

export const useFusionDistance = (rawRSSI: number | null) => {
  const { filter: kalmanFilter, reset: resetKalman } = useRSSIKalman();
  const { steps } = usePDR();

  const [distance, setFusedDistance] = useState<number | null>(null);
  const [metrics, setMetrics] = useState({ rawRSSI: 0, smoothRSSI: 0, rawDist: 0 });
  
  const isNearRef = useRef<boolean>(false);
  const lastAnnouncementTime = useRef<number>(0);

  const calculateDistance = (rssi: number) => {
    return Math.pow(10, (TX_POWER_1M - rssi) / (10 * PATH_LOSS_EXP));
  };

  useEffect(() => {
    if (rawRSSI === null) return;

    let finalDistance = 0;
    let smoothRSSI = kalmanFilter(rawRSSI);
    const rawDistanceImplied = calculateDistance(rawRSSI);

    if (rawRSSI >= ABSOLUTE_OVERRIDE_RSSI) {
        finalDistance = 0.5;
        smoothRSSI = rawRSSI; 
    } else {
        const rssiDist = calculateDistance(smoothRSSI);
        finalDistance = Math.max(0, rssiDist);
    }

    setMetrics({
        rawRSSI: rawRSSI,
        smoothRSSI: parseFloat(smoothRSSI.toFixed(1)),
        rawDist: parseFloat(rawDistanceImplied.toFixed(2))
    });

    console.log(` FUSION | Raw: ${rawRSSI} | Smooth: ${smoothRSSI.toFixed(1)} | Final: ${finalDistance.toFixed(2)}m`);

    const now = Date.now();
    if (finalDistance <= PROXIMITY_TRIGGER && !isNearRef.current) {
        if (now - lastAnnouncementTime.current > 8000) {
            isNearRef.current = true;
            lastAnnouncementTime.current = now;
            // TODO (Phase E): Trigger the dynamic useAudioEngine here instead of hardcoded TTS
            console.log("AUDIO TRIGGER: Landmark reached. You are at the destination.");
        }
    } else if (finalDistance > PROXIMITY_TRIGGER + 1.5) {
        isNearRef.current = false;
    }

    setFusedDistance(finalDistance);
  }, [rawRSSI, steps, kalmanFilter]); 

  const resetFusion = useCallback(() => {
    resetKalman();
    setFusedDistance(null);
    isNearRef.current = false;
    lastAnnouncementTime.current = 0;
  }, [resetKalman]);

  return { distance, metrics, resetFusion };
};