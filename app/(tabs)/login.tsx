import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AccountActivationModal } from '../../components/domain/AccountActivationModal'; // New Import
import { AppButton } from '../../components/ui/AppButton';
import { AppInput } from '../../components/ui/AppInput';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppText } from '../../components/ui/AppText';
import { Colors, Spacing } from '../../constants/theme';

export default function StaffLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showActivate, setShowActivate] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const handleLogin = () => router.replace('/staff' as any);

  return (
    <AppScreen scrollable keyboardAvoiding>
      <View style={{ paddingVertical: Spacing.xxxl, alignItems: 'center' }}>
        <View style={{ 
          width: 72, height: 72, borderRadius: 20, 
          backgroundColor: Colors.white, borderWidth: 3, 
          borderColor: Colors.black, justifyContent: 'center', 
          alignItems: 'center', marginBottom: Spacing.lg 
        }}>
          <Feather name="shield" size={32} color={Colors.black} />
        </View>
        <AppText variant="displayMd">Terminal Login</AppText>
        <AppText variant="bodySm" color="secondary" center>Authorized personnel access only.</AppText>
      </View>

      <AppInput 
        label="Email Address" 
        placeholder="operator@instituiton.com" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none" 
      />

      <AppInput 
        label="Password" 
        placeholder="••••••••" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry={!showPassword} 
        right={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <AppButton onPress={handleLogin} style={{ marginTop: Spacing.md }}>
        login
      </AppButton>

      <TouchableOpacity style={{ marginTop: Spacing.xl }} onPress={() => setShowActivate(true)}>
        <AppText variant="link" color="muted" center>Activate new staff invite.</AppText>
      </TouchableOpacity>

      <AccountActivationModal 
        visible={showActivate}
        inviteCode={inviteCode}
        onCodeChange={setInviteCode}
        onClose={() => setShowActivate(false)}
        onActivate={() => {
          setShowActivate(false);
          // Activation logic here
        }}
      />
    </AppScreen>
  );
}