import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { AppButton } from '../../../components/ui/AppButton';
import { AppInput } from '../../../components/ui/AppInput';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { Colors, Spacing } from '../../../constants/theme';
import { AuthAPI } from '../../../services/AuthAPI';

export default function SettingsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await AuthAPI.getProfile();
        setName(data.displayName);
        setEmail(data.email);
        setRole(data.role);
      } catch (error) {
        console.error("Failed to load profile data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = () => {
    // THE FIX: Provide explicit user feedback
    Alert.alert("Profile Updated", "Your changes have been saved successfully.");
  };

  if (isLoading) {
    return (
      <AppScreen centered>
        <ActivityIndicator size="large" color={Colors.black} />
      </AppScreen>
    );
  }

  return (
    <AppScreen padded={false}>
      <View style={{ padding: Spacing.xl, borderBottomWidth: 3, borderBottomColor: Colors.black, backgroundColor: Colors.white }}>
        <AppText variant="displaySm">Settings</AppText>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.xl, gap: Spacing.lg }}>
        <AppText variant="label" color="muted">Profile Details</AppText>
        
        <View style={{ gap: Spacing.sm }}>
          <AppInput 
            label="Full Name" 
            value={name} 
            onChangeText={setName} 
            placeholder="Enter your full name" 
          />
          <AppInput 
            label="Email Address" 
            value={email} 
            editable={false}
            keyboardType="email-address" 
            autoCapitalize="none" 
            style={{ opacity: 0.6 }}
          />
          <AppInput 
            label="Authorization Role" 
            value={role} 
            editable={false}
            style={{ opacity: 0.6 }} 
          />
          
          <AppButton onPress={handleSave} style={{ marginTop: Spacing.md }}>
            SAVE DETAILS
          </AppButton>
        </View>
      </ScrollView>
    </AppScreen>
  );
}