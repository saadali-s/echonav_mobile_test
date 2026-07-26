import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { AppCard } from '../ui/AppCard';
import { AppText } from '../ui/AppText';

export function BindingChecklist({ 
  isPlaced, onTogglePlaced, isScanning, onScan, isBound, rssi, scannedDevicesList, onBind
}: any) {
  return (
    <View className="gap-4">
      <AppCard onPress={isBound ? undefined : onTogglePlaced} className={isPlaced ? "border-emerald-500" : ""}>
        <AppText variant="titleSm" color={isPlaced ? "primary" : "secondary"}>1. Physical Placement</AppText>
        <View className="flex-row items-center mt-2 gap-3">
          <View className={`w-6 h-6 rounded-md border-2 border-black dark:border-white items-center justify-center ${isPlaced ? 'bg-black dark:bg-white' : ''}`}>
            {isPlaced && <Feather name="check" size={14} className="text-white dark:text-black" />}
          </View>
          <AppText variant="bodySm" className="flex-1">
            I confirm the beacon is securely mounted at the designated landmark.
          </AppText>
        </View>
      </AppCard>

      <AppCard className={!isPlaced ? "opacity-40" : ""}>
        <AppText variant="titleSm">2. Hardware Binding</AppText>
        <AppText variant="caption" color="secondary" className="mt-1 mb-4">
          Select the specific UUID matching the beacon in your hand.
        </AppText>

        {!isBound ? (
          <View>
            {!isScanning && (
                <AppButton onPress={onScan} variant="primary" disabled={!isPlaced}>
                    SCAN FOR NEARBY BEACONS
                </AppButton>
            )}
            
            {isScanning && scannedDevicesList.length === 0 && (
                <AppText color="muted" center className="my-3">Listening for BLE packets...</AppText>
            )}
            
            {isScanning && scannedDevicesList.length > 0 && (
                <View className="gap-3 mt-3">
                    {scannedDevicesList.map((device: any) => (
                        <View key={device.uuid} className="flex-row items-center justify-between bg-zinc-100 dark:bg-zinc-900 p-3 rounded-xl border-2 border-borderStrong dark:border-zinc-700">
                            <View className="flex-1">
                                <AppText variant="label" numberOfLines={1}>{device.uuid.split('-')[0].toUpperCase()}...{device.uuid.split('-').pop()?.toUpperCase()}</AppText>
                                <AppText variant="caption" color="muted">SIGNAL STRENGTH: {device.rssi} dBm</AppText>
                            </View>
                            <AppButton compact onPress={() => onBind(device.uuid)} className="w-20">
                                BIND
                            </AppButton>
                        </View>
                    ))}
                </View>
            )}
          </View>
        ) : (
          <View className="flex-row items-center gap-2 p-3 bg-emerald-100 dark:bg-emerald-950 rounded-xl border-2 border-emerald-600 dark:border-emerald-800">
            <Feather name="check-circle" size={18} className="text-emerald-700 dark:text-emerald-500" />
            <AppText variant="titleSm" color="success">HARDWARE BOUND (LOCKED AT {rssi}dBm)</AppText>
          </View>
        )}
      </AppCard>
    </View>
  );
}