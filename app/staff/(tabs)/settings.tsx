import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AppButton } from '../../../components/ui/AppButton';
import { AppInput } from '../../../components/ui/AppInput';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { Colors, Spacing } from '../../../constants/theme';

export default function SettingsScreen() {
  // Simple local state for the form
  const [name, setName] = useState('jack');
  const [email, setEmail] = useState('operator@instituition.co.za');

  const handleSave = () => {
    // Phase 5: Hook this up to Supabase auth update
    console.log('Saving details:', { name, email });
  };

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
            onChangeText={setEmail} 
            keyboardType="email-address" 
            autoCapitalize="none" 
            placeholder="name@domain.com"
          />
          
          <AppButton onPress={handleSave} style={{ marginTop: Spacing.md }}>
            SAVE DETAILS
          </AppButton>
        </View>

      </ScrollView>
    </AppScreen>
  );
}