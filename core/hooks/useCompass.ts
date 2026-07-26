import { Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';

export const useCompass = () => {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    let subscription: any;

    const startCompass = async () => {
      const isAvailable = await Magnetometer.isAvailableAsync();
      if (isAvailable) {
        // Slowed down from 100 to 500 to stop freezing the UI!
        Magnetometer.setUpdateInterval(500); 
        subscription = Magnetometer.addListener((data) => {
          let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          if (angle < 0) angle += 360;
          setHeading(Math.round(angle));
        });
      }
    };

    startCompass();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  return { heading };
};