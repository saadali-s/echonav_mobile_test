import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { AppInput } from '../ui/AppInput';
import { AppText } from '../ui/AppText';

interface StaffOnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  onRegister: (data: any) => void;
}

export function StaffOnboardingModal({ visible, onClose, onRegister }: StaffOnboardingModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-black/70 justify-center p-5">
        <View className="bg-white dark:bg-black p-6 rounded-2xl border-2 border-black dark:border-zinc-800 shadow-lg max-h-[85%]">
          
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <AppText variant="label" color="muted">Staff Onboarding</AppText>
              <AppText variant="titleMd">Create Staff Profile</AppText>
            </View>
            <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 justify-center items-center">
              <Feather name="x" size={20} className="text-black dark:text-white" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            <AppInput label="Full Name" placeholder="Thabo Nkosi" value={name} onChangeText={setName} />
            <AppInput label="Institution Email" placeholder="staff@domain.co.za" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <AppInput label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />
            <AppInput 
              label="Staff Invite Code" 
              placeholder="X7K-9P2" 
              value={inviteCode} 
              onChangeText={setInviteCode}
              autoCapitalize="characters"
              maxLength={6}
              inputClassName="text-xl text-center tracking-[4px] font-black"
            />
          </ScrollView>

          <AppButton variant="primary" onPress={() => onRegister({ name, email, password, inviteCode })}>
            VERIFY AND REGISTER
          </AppButton>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}