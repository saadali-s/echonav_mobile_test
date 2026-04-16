import { useScanner } from '@/hooks/useScanner';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CalibrationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { rssi: rawRssi, startScanning, stopScanning } = useScanner();

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [baselineRssi, setBaselineRssi] = useState<number | null>(null);
  
  // Use a ref to store samples without triggering re-renders on every ping
  const samplesRef = useRef<number[]>([]);

  // Capture live RSSI pings while calibrating
  useEffect(() => {
    if (isCalibrating && rawRssi !== null) {
      samplesRef.current.push(rawRssi);
    }
  }, [rawRssi, isCalibrating]);

  const startCalibration = () => {
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
        
        // Calculate the average RSSI from our 5-second sample window
        const samples = samplesRef.current;
        if (samples.length > 0) {
          const sum = samples.reduce((a, b) => a + b, 0);
          setBaselineRssi(Math.round(sum / samples.length));
        } else {
          setBaselineRssi(-65); // Fallback standard
        }
      }
    }, 100);
  };

  const handleComplete = () => {
    console.log(`Task ${id} Complete! Bound to Baseline TxPower: ${baselineRssi}`);
    // Phase D: Send this finalized payload to Supabase
    router.replace('/staff' as any);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: `CALIBRATE #${id}`,
          headerStyle: { backgroundColor: '#18181b' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '900' },
        }} 
      />

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <Feather name="crosshair" size={32} color="#18181b" />
          </View>
          <Text style={styles.title}>1-Meter Baseline</Text>
          <Text style={styles.subtitle}>
            Stand exactly 1 meter away from the mounted beacon with your phone at chest height. Ensure there are no physical obstructions between you and the beacon.
          </Text>

          {baselineRssi === null ? (
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={[styles.primaryButton, isCalibrating && styles.buttonDisabled]} 
              onPress={startCalibration}
              disabled={isCalibrating}
            >
              {isCalibrating ? (
                <>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.primaryButtonText}>SAMPLING ({progress}%)...</Text>
                </>
              ) : (
                <Text style={styles.primaryButtonText}>START 5-SECOND SAMPLE</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.resultsContainer}>
              <View style={styles.successBox}>
                <Feather name="check-circle" size={24} color="#166534" />
                <View>
                  <Text style={styles.successTitle}>CALIBRATION SUCCESSFUL</Text>
                  <Text style={styles.successDetail}>
                    Calculated TxPower (1m): {baselineRssi} dBm
                  </Text>
                  <Text style={styles.successDetail}>
                    Samples Collected: {samplesRef.current.length}
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.completeButton} 
                onPress={handleComplete}
              >
                <Text style={styles.primaryButtonText}>SAVE & COMPLETE TASK</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  content: { padding: 20, justifyContent: 'center', flex: 1 },
  card: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#18181b', borderBottomWidth: 6, borderRightWidth: 4, borderRadius: 12, padding: 24, alignItems: 'center' },
  iconWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f4f4f5', borderWidth: 2, borderColor: '#18181b', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '900', color: '#18181b', textTransform: 'uppercase', marginBottom: 8 },
  subtitle: { fontSize: 13, fontWeight: '600', color: '#71717a', textAlign: 'center', marginBottom: 32, lineHeight: 20 },
  
  primaryButton: { flexDirection: 'row', backgroundColor: '#18181b', borderRadius: 8, padding: 18, alignItems: 'center', justifyContent: 'center', width: '100%', gap: 10 },
  buttonDisabled: { backgroundColor: '#a1a1aa' },
  primaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  
  resultsContainer: { width: '100%' },
  successBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', padding: 16, borderRadius: 8, borderWidth: 2, borderColor: '#166534', gap: 12, marginBottom: 16 },
  successTitle: { color: '#166534', fontWeight: '900', fontSize: 14, textTransform: 'uppercase', marginBottom: 4 },
  successDetail: { color: '#166534', fontWeight: '600', fontSize: 12 },
  completeButton: { backgroundColor: '#166534', borderRadius: 8, padding: 18, alignItems: 'center', justifyContent: 'center', width: '100%' }
});