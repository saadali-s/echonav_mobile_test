import { Gyroscope } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

export const useKinematics = (currentSteps: number) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasTurnedAround, setHasTurnedAround] = useState(false);

  const stepsRef = useRef(currentSteps);
  const historyRef = useRef<
    { timestamp: number; zRate: number; steps: number }[]
  >([]);

  useEffect(() => {
    stepsRef.current = currentSteps;
  }, [currentSteps]);

  useEffect(() => {
    let subscription: any;

    const startKinematics = async () => {
      const isAvailable = await Gyroscope.isAvailableAsync();
      if (!isAvailable) return;

      Gyroscope.setUpdateInterval(100);

      subscription = Gyroscope.addListener((data) => {
        const now = Date.now();
        const currentStepsVal = stepsRef.current;

        const zRate = data.z;

        historyRef.current.push({
          timestamp: now,
          zRate,
          steps: currentStepsVal,
        });

        historyRef.current = historyRef.current.filter(
          (entry) => now - entry.timestamp <= 1500,
        );

        if (historyRef.current.length > 0) {
          const totalAngleRads = historyRef.current.reduce(
            (sum, entry) => sum + entry.zRate * 0.1,
            0,
          );
          const totalAngleDeg = Math.abs(totalAngleRads * (180 / Math.PI));

          const oldestSteps = historyRef.current[0].steps;
          const stepsTakenInWindow = currentStepsVal - oldestSteps;

          if (totalAngleDeg > 45 && stepsTakenInWindow === 0) {
            setIsSpinning(true);
          } else {
            setIsSpinning(false);
          }

          if (totalAngleDeg > 140 && stepsTakenInWindow > 0) {
            setHasTurnedAround(true);
            historyRef.current = [];
          }
        }
      });
    };

    startKinematics();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const clearTurnWarning = () => setHasTurnedAround(false);

  return { isSpinning, hasTurnedAround, clearTurnWarning };
};
