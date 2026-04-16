import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { AppButton } from '../ui/AppButton';
import { AppCard } from '../ui/AppCard';
import { AppText } from '../ui/AppText';

interface BindingChecklistProps {
  isPlaced: boolean;
  onTogglePlaced: () => void;
  isScanning: boolean;
  onScan: () => void;
  isBound: boolean;
  rssi: number | null;
}

export function BindingChecklist({ 
  isPlaced, 
  onTogglePlaced, 
  isScanning, 
  onScan, 
  isBound, 
  rssi 
}: BindingChecklistProps) {
  return (
    <View style={styles.container}>
      {/* 1. Physical Placement Check */}
      <AppCard onPress={isBound ? undefined : onTogglePlaced} style={isPlaced ? styles.activeCard : undefined}>
        <AppText variant="titleSm" color={isPlaced ? "primary" : "secondary"}>1. Physical Placement</AppText>
        <View style={styles.checkRow}>
          <View style={[styles.checkbox, isPlaced && styles.checked]}>
            {isPlaced && <Feather name="check" size={14} color={Colors.white} />}
          </View>
          <AppText variant="bodySm" style={styles.flexText}>
            I confirm the beacon is securely mounted at the designated landmark.
          </AppText>
        </View>
      </AppCard>

      {/* 2. Hardware Binding Scan */}
      <AppCard style={!isPlaced ? styles.disabled : undefined}>
        <AppText variant="titleSm">2. Hardware Binding</AppText>
        <AppText variant="caption" color="secondary" style={styles.description}>
          Hold your device near the beacon to lock its unique ID to this location.
        </AppText>

        {!isBound ? (
          <AppButton 
            onPress={onScan} 
            variant="primary" 
            disabled={!isPlaced || isScanning}
            loading={isScanning}
          >
            {isScanning ? "LISTENING FOR BLE..." : "SCAN TO BIND"}
          </AppButton>
        ) : (
          <View style={styles.successBox}>
            <Feather name="check-circle" size={18} color={Colors.successText} />
            <AppText variant="titleSm" color="success">HARDWARE BOUND (RSSI: {rssi}dBm)</AppText>
          </View>
        )}
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md },
  activeCard: { borderColor: Colors.activeGreen },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: Spacing.md },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  checked: { backgroundColor: Colors.black, borderColor: Colors.black },
  flexText: { flex: 1 },
  description: { marginTop: Spacing.xs, marginBottom: Spacing.lg },
  disabled: { opacity: 0.4 },
  successBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, backgroundColor: Colors.successBg, borderRadius: 8, borderWidth: 1, borderColor: Colors.successBorder }
});