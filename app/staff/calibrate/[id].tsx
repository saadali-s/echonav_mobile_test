import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { Colors, Spacing } from '@/constants/theme';
import { useScanner } from '@/hooks/useScanner';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Vibration, View } from 'react-native';

export default function CalibrationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { rssi: rawRssi, startScanning, stopScanning } = useScanner();

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [baselineRssi, setBaselineRssi] = useState<number | null>(null);
  
  const samplesRef = useRef<number[]>([]);

  useEffect(() => {
    if (isCalibrating && rawRssi !== null) {
      samplesRef.current.push(rawRssi);
    }
  }, [rawRssi, isCalibrating]);

  const startCalibration = () => {
    Vibration.vibrate(100);
    setIsCalibrating(true);
    setProgress(0);
    setBaselineRssi(null);
    samplesRef.current = [];
    
    startScanning();

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2; // 2% every 100ms = 5 seconds total
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        stopScanning();
        setIsCalibrating(false);
        Vibration.vibrate([0, 200, 100, 200]); // "Success" vibration pattern
        
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

  const handleComplete = () => {
    // Logic for database commit happens here in Phase D
    console.log(`Finalizing Task ${id} with Baseline: ${baselineRssi}`);
    router.replace('/staff' as any);
  };

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'SIGNAL CALIBRATION', headerShown: true }} />

      <View style={{ marginBottom: Spacing.xxl, alignItems: 'center' }}>
        <View style={{ 
          width: 80, height: 80, borderRadius: 40, 
          backgroundColor: Colors.borderLight, 
          justifyContent: 'center', alignItems: 'center',
          borderWidth: 2, borderColor: Colors.black,
          marginBottom: Spacing.lg
        }}>
          <Feather name="crosshair" size={32} color={Colors.black} />
        </View>
        <AppText variant="displayMd" center>Baseline Setup</AppText>
        <AppText variant="bodySm" color="secondary" center style={{ marginTop: Spacing.xs }}>
          Stand exactly 1 meter away from the beacon at chest height.
        </AppText>
      </View>

      <AppCard variant={baselineRssi !== null ? 'success' : 'default'}>
        {baselineRssi === null ? (
          <View style={{ gap: Spacing.xl }}>
            <View>
              <AppText variant="titleSm" center>Calibration Status</AppText>
              <View style={{ 
                height: 12, backgroundColor: Colors.borderLight, 
                borderRadius: 6, marginTop: Spacing.md, overflow: 'hidden',
                borderWidth: 1, borderColor: Colors.border
              }}>
                <View style={{ 
                  height: '100%', width: `${progress}%`, 
                  backgroundColor: Colors.black 
                }} />
              </View>
              <AppText variant="caption" color="secondary" center style={{ marginTop: Spacing.sm }}>
                {isCalibrating ? `SAMPLING DATA... ${progress}%` : 'READY TO START'}
              </AppText>
            </View>

            <AppButton 
              onPress={startCalibration} 
              disabled={isCalibrating}
              loading={isCalibrating}
            >
              START 5-SECOND SAMPLE
            </AppButton>
          </View>
        ) : (
          <View style={{ gap: Spacing.lg, alignItems: 'center' }}>
            <Feather name="check-circle" size={48} color={Colors.successText} />
            <View style={{ alignItems: 'center' }}>
              <AppText variant="titleMd" color="success">CALIBRATION SUCCESSFUL</AppText>
              <AppText variant="displayLg" style={{ marginTop: Spacing.sm }}>
                {baselineRssi} <AppText variant="titleSm">dBm</AppText>
              </AppText>
              <AppText variant="caption" color="secondary">
                Calculated from {samplesRef.current.length} samples
              </AppText>
            </View>
            
            <AppButton variant="primary" onPress={handleComplete}>
              SAVE & COMPLETE TASK
            </AppButton>
          </View>
        )}
      </AppCard>

      <View style={{ marginTop: Spacing.xl, paddingHorizontal: Spacing.md }}>
        <AppText variant="caption" color="muted" center>
          Ensure no physical obstructions are between the phone and the beacon during sampling.
        </AppText>
      </View>
    </AppScreen>
  );
}