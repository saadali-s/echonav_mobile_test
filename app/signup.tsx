import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppButton } from '../components/ui/AppButton';
import { AppInput } from '../components/ui/AppInput';
import { AppScreen } from '../components/ui/AppScreen';
import { AppText } from '../components/ui/AppText';
import { Colors, Spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext'; // <-- THE FIX: Import Context
import { AuthAPI } from '../services/AuthAPI';

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuth(); // <-- THE FIX: Consume the hook
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Fields", "Please fill out all details.");
      return;
    }

    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    try {
      setIsLoading(true);
      const response = await AuthAPI.mobileSignup(firstName, lastName, email, password);
      
      // THE FIX: Use context login to sync global state instead of raw ApiClient.
      // The Route Guard in _layout.tsx will now automatically redirect the user!
      await login(response.token); 
      
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "Could not create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppScreen scrollable keyboardAvoiding centered>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={Colors.black} />
        </TouchableOpacity>

        <View style={styles.header}>
          <AppText variant="displayMd">Create Account</AppText>
          <AppText variant="bodySm" color="secondary">
            Join EchoNav to navigate your world effortlessly.
          </AppText>
        </View>

        <AppInput label="Full Name" placeholder="Jane Doe" value={name} onChangeText={setName} />
        <AppInput label="Email Address" placeholder="name@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <AppInput label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} 
          right={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          }
        />

        <AppButton onPress={handleSignup} loading={isLoading} style={{ marginTop: Spacing.md }}>
          REGISTER
        </AppButton>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 400, paddingVertical: Spacing.xl },
  backBtn: { marginBottom: Spacing.xl },
  header: { marginBottom: Spacing.xl }
});