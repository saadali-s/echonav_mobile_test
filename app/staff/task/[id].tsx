import { BindingChecklist } from '@/components/domain/BindingChecklist';
import { AppButton } from '@/components/ui/AppButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { Spacing } from '@/constants/theme';
import { useScanner } from '@/hooks/useScanner';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function TaskExecutionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isScanning, rssi: rawRssi, startScanning, stopScanning } = useScanner();
  
  const [isPlaced, setIsPlaced] = useState(false);
  const [isBound, setIsBound] = useState(false);

  useEffect(() => {
    if (isScanning && rawRssi !== null) {
      stopScanning();
      setIsBound(true);
    }
  }, [rawRssi, isScanning, stopScanning]);

  return (
    <AppScreen>
      <Stack.Screen options={{ title: `DEPLOYMENT #${id}`, headerShown: true }} />

      <View style={{ marginBottom: Spacing.xl }}>
        <AppText variant="displayMd">Execution</AppText>
        <AppText variant="bodySm" color="secondary">Complete the mandatory checklist to verify this node.</AppText>
      </View>

      <BindingChecklist 
        isPlaced={isPlaced}
        onTogglePlaced={() => setIsPlaced(!isPlaced)}
        isScanning={isScanning}
        onScan={startScanning}
        isBound={isBound}
        rssi={rawRssi}
      />

      {/* 3. 1-Meter Calibration Trigger */}
      <View style={{ marginTop: Spacing.xxl, opacity: isBound ? 1 : 0.4 }}>
        <AppText variant="label" color="secondary" style={{ marginBottom: Spacing.sm }}>Final Step</AppText>
        <AppButton 
          variant="secondary" 
          disabled={!isBound} 
          onPress={() => router.push(`/staff/calibrate/${id}` as any)}
        >
          INITIATE 1-METER CALIBRATION
        </AppButton>
      </View>
    </AppScreen>
  );
}