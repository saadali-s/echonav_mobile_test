import { useCallback, useRef } from 'react';

// The "Speed" of the filter.
const PROCESS_NOISE = 0.8; 

// How much we trust a signal that is GETTING STRONGER (Approaching). 
const MEASUREMENT_NOISE_APPROACH = 0.01; 

// How much we trust a signal that is GETTING WEAKER (Departing).
const MEASUREMENT_NOISE_DEPART = 5.0;    

export const useRSSIKalman = () => {
  const x = useRef<number>(0); 
  const p = useRef<number>(0); 
  const initialized = useRef<boolean>(false);

  const filter = useCallback((rssi: number): number => {
    if (!initialized.current) {
      x.current = rssi;
      p.current = 1.0;
      initialized.current = true;
      return rssi;
    }

    // THE FIX: Removed the 12dBm snapping logic. 
    // Human bodies block 2.4GHz signals instantly. The snap caused erratic map teleportation.
    // We now let the Kalman filter smooth out the body-blocks naturally.

    const R = rssi > x.current ? MEASUREMENT_NOISE_APPROACH : MEASUREMENT_NOISE_DEPART;

    const p_pred = p.current + PROCESS_NOISE;
    const K = p_pred / (p_pred + R);
    x.current = x.current + K * (rssi - x.current);
    p.current = (1 - K) * p_pred;

    return x.current;
  }, []);

  const reset = useCallback(() => {
    x.current = 0;
    p.current = 0;
    initialized.current = false;
  }, []);

  return { filter, reset };
};