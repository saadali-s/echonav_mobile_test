import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { useAppAlert } from '@/core/context/AlertContext';
import { useScanner } from '@/core/hooks/useScanner';
import { FleetAPI } from '@/core/services/FleetAPI'; 
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Vibration, View } from 'react-native'; 

export default function CalibrationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showAlert } = useAppAlert();
  
  const { rssi: rawRssi, startScanning, stopScanning, bluetoothState } = useScanner();

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [baselineRssi, setBaselineRssi] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false); 
  
  const samplesRef = useRef<number[]>([]);

  useEffect(() => {
    if (isCalibrating && rawRssi !== null) {
      samplesRef.current.push(rawRssi);
    }
  }, [rawRssi, isCalibrating]);

  const initiateCalibrationSequence = async () => {
    try {
      await startScanning();
    } catch (err: any) {
      showAlert('HARDWARE ERROR', err.message, 'error');
      return;
    }

    Vibration.vibrate(100);
    setIsCalibrating(true);
    setProgress(0);
    setBaselineRssi(null);
    samplesRef.current = [];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2; 
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        stopScanning();
        setIsCalibrating(false);
        Vibration.vibrate([0, 200, 100, 200]); 
        
        const samples = samplesRef.current;
        if (samples.length > 0) {
          const sum = samples.reduce((a, b) => a + b, 0);
          setBaselineRssi(Math.round(sum / samples.length));
        } else {
          setBaselineRssi(-65);
        }
      }
    }, 100);
  };

  const handleComplete = async () => {
    if (!baselineRssi) return;

    try {
      setIsSaving(true);
      await FleetAPI.updateTaskStatus(id as string, 'VERIFIED', baselineRssi);
      
      showAlert("SUCCESS", "Beacon calibrated and deployed successfully.", "success", "FINISH", () => {
         router.replace('/staff/(tabs)' as any);
      });
    } catch (error: any) {
      showAlert("COMMIT ERROR", error.message || "Failed to save the baseline to the database.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (bluetoothState === 'PoweredOff') {
    return (
      <AppScreen centered>
         <AppText variant="displaySm" color="danger">BLUETOOTH OFF</AppText>
         <AppText variant="body" color="muted" center className="mt-3">
           Please enable Bluetooth to continue calibration.
         </AppText>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'SIGNAL CALIBRATION', headerShown: true }} />

      <View className="mb-8 items-center">
        <View className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 justify-center items-center border-2 border-black dark:border-zinc-700 mb-4">
          <Feather name="crosshair" size={32} className="text-black dark:text-white" />
        </View>
        <AppText variant="displayMd" center>Baseline Setup</AppText>
        <AppText variant="bodySm" color="secondary" center className="mt-1">
          Stand exactly 1 meter away from the beacon at chest height.
        </AppText>
      </View>

      <AppCard variant={baselineRssi !== null ? 'success' : 'default'}>
        {baselineRssi === null ? (
          <View className="gap-5">
            <View>
              <AppText variant="titleSm" center>Calibration Status</AppText>
              <View className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden border border-zinc-300 dark:border-zinc-700">
                <View style={{ height: '100%', width: `${progress}%` }} className="bg-emerald-500 dark:bg-emerald-400" />
              </View>
              <AppText variant="caption" color="secondary" center className="mt-2">
                {isCalibrating ? `SAMPLING DATA... ${progress}%` : 'READY TO START'}
              </AppText>
            </View>

            <AppButton 
              onPress={initiateCalibrationSequence} 
              disabled={isCalibrating}
              loading={isCalibrating}
            >
              START 5-SECOND SAMPLE
            </AppButton>
          </View>
        ) : (
          <View className="gap-4 items-center">
            <Feather name="check-circle" size={48} className="text-emerald-700 dark:text-emerald-500" />
            <View className="items-center">
              <AppText variant="titleMd" color="success">CALIBRATION SUCCESSFUL</AppText>
              <AppText variant="displayLg" className="mt-2">
                {baselineRssi} <AppText variant="titleSm">dBm</AppText>
              </AppText>
              <AppText variant="caption" color="secondary">
                Calculated from {samplesRef.current.length} samples
              </AppText>
            </View>
            
            <AppButton 
              variant="primary" 
              onPress={handleComplete}
              loading={isSaving}
              disabled={isSaving}
            >
              SAVE & COMPLETE TASK
            </AppButton>
          </View>
        )}
      </AppCard>

      <View className="mt-5 px-3">
        <AppText variant="caption" color="muted" center>
          Ensure no physical obstructions are between the phone and the beacon during sampling.
        </AppText>
      </View>
    </AppScreen>
  );
}