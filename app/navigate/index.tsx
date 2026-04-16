import { NavigationButton } from '@/components/domain/NavigationButton';
import { RadarMap } from '@/components/domain/RadarMap';
import { AppScreen } from '@/components/ui/AppScreen';
import { useScanner } from '@/hooks/useScanner';
import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';

const MOCK_FLIGHT_PLAN = [
  { trigger: 4.0, sound: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
  { trigger: 0.5, sound: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg' }
];

export default function NavigateScreen() {
  const { isScanning, distance, startScanning, stopScanning } = useScanner();
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  const playAlert = async (uri: string) => {
    if (soundRef.current) await soundRef.current.unloadAsync();
    const { sound } = await Audio.Sound.createAsync({ uri });
    soundRef.current = sound;
    await sound.playAsync();
  };

  useEffect(() => {
    // Resolved the TypeScript error by removing unnecessary parseFloat/casting
    if (isActive && distance !== null && step < MOCK_FLIGHT_PLAN.length) {
      if (distance <= MOCK_FLIGHT_PLAN[step].trigger) {
        Vibration.vibrate(200);
        playAlert(MOCK_FLIGHT_PLAN[step].sound);
        setStep(prev => prev + 1);
        if (step === MOCK_FLIGHT_PLAN.length - 1) stopScanning();
      }
    }
  }, [distance, isActive, step]);

  const handleToggle = () => {
    Vibration.vibrate(100);
    if (!isActive) {
      setIsActive(true);
      startScanning();
    } else {
      setIsActive(false);
      stopScanning();
    }
  };

  return (
    <AppScreen dark padded={false} scrollable={false}>
      <RadarMap isScanning={isScanning} distance={distance} heading={0} />
      <NavigationButton isActive={isActive} onPress={handleToggle} />
    </AppScreen>
  );
}