import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PairingModal } from '../components/domain/PairingModal';
import { RadarMap } from '../components/domain/RadarMap';
import { AppButton } from '../components/ui/AppButton';
import { AppInput } from '../components/ui/AppInput';
import { AppScreen } from '../components/ui/AppScreen';
import { AppText } from '../components/ui/AppText';
import { BEACON_CONFIG } from '../constants/Config';
import { Colors, Spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useScanner } from '../hooks/useScanner';
import { AuthAPI } from '../services/AuthAPI';
import { NavigationAPI } from '../services/NavigationAPI';

export default function RadarHomeScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { startScanning, stopScanning, isScanning, distance, scannedDevice, bluetoothState } = useScanner();

  const [showAccess, setShowAccess] = useState(false);
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(''); 
  
  const isResolving = useRef(false);

  // THE FIX: Manual trigger function with a 6-second auto-timeout
  const handleActivateRadar = () => {
    startScanning();
    
    setTimeout(() => {
      if (!isResolving.current) {
        stopScanning();
        Alert.alert("Scan Complete", "No spatial anchors found nearby.");
      }
    }, 6000);
  };

  // Triggers when the scanner actually picks up a beacon
  useEffect(() => {
    const resolveBeacon = async () => {
      if (scannedDevice && !isResolving.current) {
        isResolving.current = true;
        try {
          console.log("[Radar] Anchor detected. Verifying spatial signature...");
          
          await NavigationAPI.resolvePosition(
            BEACON_CONFIG.UUID,
            BEACON_CONFIG.MAJOR,
            BEACON_CONFIG.MINOR
          );
          
          stopScanning();
          console.log("[Radar] Signature verified. Entering Navigation Engine.");
          router.push('/navigate' as any);
        } catch (error) {
          console.log("[Radar] Signature rejected. Anchor ignored.");
          setTimeout(() => { isResolving.current = false; }, 3000);
        }
      }
    };
    
    resolveBeacon();
  }, [scannedDevice]);

  // --- STAFF LOGIN ---
  const handleStaffLogin = async () => {
    if (!email || !password) return;
    setLoginError('');
    try {
      setIsLoading(true);
      const response = await AuthAPI.loginStaff(email, password);
      
      if (!response || typeof response.token !== 'string') {
        throw new Error("Server returned an invalid authentication token.");
      }

      await login(response.token, response.userId);
      
      setShowStaffLogin(false);
      stopScanning();
      
      router.replace('/staff/(tabs)' as any);
    } catch (error: any) {
      setLoginError(error.message || "Invalid credentials."); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppScreen dark padded={false} scrollable={false} centered>
      <TouchableOpacity style={styles.cornerBtnLeft} onPress={() => setShowAccess(true)}>
        <Feather name="key" size={20} color={Colors.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.cornerBtnRight} onPress={() => setShowStaffLogin(true)}>
        <Feather name="shield" size={20} color={Colors.textMuted} />
      </TouchableOpacity>

      <View style={styles.centerStage}>
        <AppText variant="displaySm" color="inverse" center style={{ marginBottom: Spacing.xs }}>
          EchoNav
        </AppText>
        
        {/* THE FIX: Swapped static text for an active status/button area */}
        <View style={{ height: 40, marginBottom: Spacing.xl, justifyContent: 'center' }}>
          {bluetoothState === 'PoweredOff' ? (
            <AppText variant="caption" color="danger" center>BLUETOOTH ANTENNA IS OFF</AppText>
          ) : isScanning ? (
            <AppText variant="caption" color="success" center>SEARCHING FOR SPATIAL ANCHORS...</AppText>
          ) : (
            <AppButton compact variant="secondary" onPress={handleActivateRadar} style={{ backgroundColor: 'transparent', borderColor: Colors.border }}>
              <AppText variant="label" color="inverse">ACTIVATE SCANNER</AppText>
            </AppButton>
          )}
        </View>

        <RadarMap isScanning={isScanning} distance={distance} heading={0} />
      </View>

      <PairingModal 
        visible={showAccess}
        onClose={() => setShowAccess(false)} 
        onAuthenticate={async (accEmail, pin) => {
          try {
            const response = await AuthAPI.pairDevice(accEmail, pin);
            await login(response.token, response.userId);
            setShowAccess(false);
            router.replace('/navigate' as any); 
          } catch (error: any) {
            Alert.alert("Pairing Failed", error.message || "Invalid PIN or Email.");
          }
        }}
      />

      <Modal visible={showStaffLogin} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <AppText variant="titleMd">Staff Access</AppText>
              <TouchableOpacity onPress={() => { setShowStaffLogin(false); setLoginError(''); }}>
                <Feather name="x" size={24} color={Colors.black} />
              </TouchableOpacity>
            </View>

            {!!loginError && (
              <View style={styles.errorBox}>
                <AppText variant="caption" color="danger" center>{loginError}</AppText>
              </View>
            )}

            <AppInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <AppButton onPress={handleStaffLogin} loading={isLoading} style={{ marginTop: Spacing.md }}>
              AUTHORIZE
            </AppButton>
          </View>
        </View>
      </Modal>

    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cornerBtnLeft: { position: 'absolute', top: 60, left: 24, padding: Spacing.sm, zIndex: 10 },
  cornerBtnRight: { position: 'absolute', top: 60, right: 24, padding: Spacing.sm, zIndex: 10 },
  centerStage: { width: '100%', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: Spacing.xl },
  modalCard: { backgroundColor: Colors.white, padding: Spacing.xl, borderRadius: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  errorBox: { backgroundColor: Colors.dangerBg, padding: Spacing.sm, borderRadius: 6, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.dangerBorder }
});