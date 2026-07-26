import { Pedometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

export const usePDR = () => {
  const [steps, setSteps] = useState(0);
  
  // Let TypeScript figure out the subscription type automatically
  const subscription = useRef<ReturnType<typeof Pedometer.watchStepCount> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startPedometer = async () => {
      // Tap directly into the native hardware feed
      const isAvailable = await Pedometer.isAvailableAsync();
      
      if (isAvailable && isMounted) {
        subscription.current = Pedometer.watchStepCount(result => {
          setSteps(result.steps);
        });
      } else {
        console.log(" Native pedometer chip not found or permission denied.");
      }
    };

    startPedometer();

    return () => {
      isMounted = false;
      if (subscription.current) {
        subscription.current.remove();
      }
    };
  }, []);

  return { steps };
};