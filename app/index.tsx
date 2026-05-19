import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PairingModal } from '../components/domain/PairingModal';
import { StaffOnboardingModal } from '../components/domain/StaffOnboardingModal';
import { AppButton } from '../components/ui/AppButton';
import { AppInput } from '../components/ui/AppInput';
import { AppScreen } from '../components/ui/AppScreen';
import { AppText } from '../components/ui/AppText';
import { Colors, Spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext'; // <-- NEW IMPORT
import { AuthAPI } from '../services/AuthAPI';
export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [showAccess, setShowAccess] = useState(false);
  const [showStaff, setShowStaff] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  // --- STAFF LOGIN ---
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthAPI.loginStaff(email, password);
      
      // THE FIX: Decode JWT and set global state before navigating
      await login(response.token); 
      
      router.replace('/staff' as any);
    } catch (error: any) {
      Alert.alert("Access Denied", error.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppScreen scrollable keyboardAvoiding centered>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Feather name="navigation" size={32} color={Colors.white} />
          </View>
          <AppText variant="displayMd">EchoNav</AppText>
          <AppText variant="bodySm" color="secondary" center>
            Sign in to access your dashboard.
          </AppText>
        </View>

        <AppInput label="Email Address" placeholder="name@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <AppInput label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} 
          right={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          }
        />

        <AppButton onPress={handleLogin} loading={isLoading} style={{ marginTop: Spacing.md }}>
          LOGIN
        </AppButton>

        <TouchableOpacity style={styles.signupLink} onPress={() => router.push('/signup' as any)}>
          <AppText variant="bodySm" color="secondary">
            Don't have an account? <AppText variant="bodySm" color="link" style={{fontWeight: 'bold'}}>Sign up</AppText>
          </AppText>
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <AppText variant="caption" color="muted" style={{ marginHorizontal: Spacing.sm }}>OR</AppText>
          <View style={styles.line} />
        </View>

        <View style={{ gap: Spacing.md }}>
          <AppButton variant="secondary" icon="eye" onPress={() => setShowAccess(true)}>
            ACCESSIBILITY SETUP
          </AppButton>
          <AppButton variant="ghost" icon="shield" onPress={() => setShowStaff(true)}>
            STAFF ONBOARDING
          </AppButton>
        </View>
      </View>

      {/* --- CONCIERGE PAIRING --- */}
      <PairingModal 
        visible={showAccess}
        onClose={() => setShowAccess(false)} 
        onAuthenticate={async (accEmail, pin) => {
          try {
            const response = await AuthAPI.pairDevice(accEmail, pin);
            
            // THE FIX: Decode JWT and set global state for visually impaired user
            await login(response.token);
            
            setShowAccess(false);
            router.replace('/(user)' as any); 
          } catch (error: any) {
            Alert.alert("Pairing Failed", error.message || "Invalid PIN or Email.");
          }
        }}
      />

      <StaffOnboardingModal 
        visible={showStaff}
        onClose={() => setShowStaff(false)}
        onRegister={() => { setShowStaff(false); }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 400, paddingVertical: Spacing.xl },
  header: { alignItems: 'center', marginBottom: Spacing.xxxl },
  logoBox: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.black, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  signupLink: { marginTop: Spacing.xl, alignItems: 'center' },
  separatorContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.xxl },
  line: { flex: 1, height: 1, backgroundColor: Colors.borderLight }
});