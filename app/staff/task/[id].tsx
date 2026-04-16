import { useScanner } from '@/hooks/useScanner';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function TaskExecutionScreen() {
  const { id } = useLocalSearchParams();
  const { isScanning, rssi: rawRssi, startScanning, stopScanning } = useScanner();
  const router = useRouter();
  const [isPlaced, setIsPlaced] = useState(false);
  const [isBound, setIsBound] = useState(false);

  // Auto-lock the hardware when the scanner detects our target UUID
  useEffect(() => {
    if (isScanning && rawRssi !== null) {
      stopScanning();
      setIsBound(true);
    }
  }, [rawRssi, isScanning, stopScanning]);

  const handleScan = () => {
    if (!isPlaced) return;
    startScanning();
  };

  const handleCalibration = () => {
    // Navigate to the sampling engine, passing the ID forward
    router.push(`/staff/calibrate/${id}` as any);
  };

  return (
    <View style={styles.container}>
      {/* Configure the dynamic header injected by the Staff Stack */}
      <Stack.Screen 
        options={{ 
          title: `TASK #${id}`,
          headerStyle: { backgroundColor: '#18181b' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '900' },
          headerBackVisible: true
        }} 
      />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Physical Placement</Text>
          
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={[styles.checkboxRow, isPlaced && styles.checkboxRowActive]}
            onPress={() => !isBound && setIsPlaced(!isPlaced)}
            disabled={isBound}
          >
            <View style={[styles.checkbox, isPlaced && styles.checkboxChecked]}>
              {isPlaced && <Feather name="check" size={16} color="#ffffff" />}
            </View>
            <Text style={styles.checkboxText}>
              I confirm the physical beacon is mounted securely at the designated location.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, !isPlaced && styles.cardDisabled]}>
          <Text style={styles.sectionTitle}>2. Hardware Binding</Text>
          <Text style={styles.subtitle}>Hold your device near the beacon to bind its UUID to this location.</Text>
          
          {!isBound ? (
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={[styles.primaryButton, !isPlaced && styles.buttonDisabled]} 
              onPress={handleScan}
              disabled={!isPlaced || isScanning}
            >
              {isScanning ? (
                <>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.primaryButtonText}>SCANNING BLE...</Text>
                </>
              ) : (
                <>
                  <Feather name="bluetooth" size={18} color="#ffffff" />
                  <Text style={styles.primaryButtonText}>SCAN TO BIND</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.successBox}>
              <Feather name="check-circle" size={20} color="#166534" />
              <Text style={styles.successText}>HARDWARE BOUND (RSSI: {rawRssi})</Text>
            </View>
          )}
        </View>

        <View style={[styles.card, !isBound && styles.cardDisabled]}>
          <Text style={styles.sectionTitle}>3. Baseline Calibration</Text>
          <Text style={styles.subtitle}>Stand exactly 1 meter away from the beacon to configure the Kalman filter baseline.</Text>
          
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={[styles.primaryButton, !isBound && styles.buttonDisabled]} 
            onPress={handleCalibration}
            disabled={!isBound}
          >
            <Feather name="crosshair" size={18} color="#ffffff" />
            <Text style={styles.primaryButtonText}>INITIATE 1-METER CALIBRATION</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  content: { padding: 20 },
  card: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#18181b', borderBottomWidth: 6, borderRightWidth: 4, borderRadius: 12, padding: 20, marginBottom: 20 },
  cardDisabled: { opacity: 0.5 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#18181b', textTransform: 'uppercase', marginBottom: 8 },
  subtitle: { fontSize: 13, fontWeight: '600', color: '#71717a', marginBottom: 16 },
  
  checkboxRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f4f5', padding: 16, borderRadius: 8, borderWidth: 2, borderColor: '#e4e4e7' },
  checkboxRowActive: { borderColor: '#18181b', backgroundColor: '#ffffff' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#18181b', alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: '#ffffff' },
  checkboxChecked: { backgroundColor: '#18181b' },
  checkboxText: { flex: 1, fontSize: 13, fontWeight: '700', color: '#18181b' },

  primaryButton: { flexDirection: 'row', backgroundColor: '#18181b', borderRadius: 8, padding: 18, alignItems: 'center', justifyContent: 'center', gap: 10 },
  buttonDisabled: { backgroundColor: '#a1a1aa' },
  primaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },

  successBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', padding: 16, borderRadius: 8, borderWidth: 2, borderColor: '#166534', gap: 10 },
  successText: { color: '#166534', fontWeight: '900', fontSize: 13, textTransform: 'uppercase' }
});