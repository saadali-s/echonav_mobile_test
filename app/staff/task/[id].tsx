import { BindingChecklist } from '@/components/fleet/BindingChecklist';
import { AppButton } from '@/components/ui/AppButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { BEACON_CONFIG } from '@/core/constants/Config';
import { Spacing } from '@/core/constants/theme';
import { useAppAlert } from '@/core/context/AlertContext';
import { useScanner } from '@/core/hooks/useScanner';
import { FleetAPI } from '@/core/services/FleetAPI';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

export default function TaskExecutionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showAlert } = useAppAlert();
  
  const { isScanning, rssi: rawRssi, scannedDevicesList, startScanning, stopScanning, bluetoothState } = useScanner();
  
  const [isPlaced, setIsPlaced] = useState(false);
  const [isBound, setIsBound] = useState(false);

  const handleScan = async () => {
    try {
      await startScanning();
    } catch (err: any) {
      showAlert('HARDWARE ERROR', err.message, 'error');
    }
  };

  const handleBindBeacon = async (selectedUuid: string) => {
    stopScanning();
    try {
        await FleetAPI.linkBeacon(id as string, selectedUuid, BEACON_CONFIG.MAJOR, BEACON_CONFIG.MINOR);
        setIsBound(true);
    } catch (e: any) {
        showAlert("BINDING FAILED", e.message || "Could not link beacon. Please ensure the UUID is unique.", "error");
    }
  };

  // Phase 4 Edge Case handling
  if (bluetoothState === 'PoweredOff') {
    return (
      <AppScreen centered>
         <AppText variant="displaySm" color="danger">BLUETOOTH OFF</AppText>
         <AppText variant="body" color="muted" center style={{ marginTop: Spacing.md }}>
           Please enable Bluetooth to continue with this deployment task.
         </AppText>
      </AppScreen>
    );
  }

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
        onScan={handleScan}
        isBound={isBound}
        rssi={rawRssi}
        scannedDevicesList={scannedDevicesList}
        onBind={handleBindBeacon}
      />

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