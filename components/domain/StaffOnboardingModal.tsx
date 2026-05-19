import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Brutalist, Colors, Spacing } from '../../constants/theme';
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={[Brutalist.card, styles.container]}>
          <View style={styles.header}>
            <View>
              <AppText variant="label" color="muted">Staff Onboarding</AppText>
              <AppText variant="titleMd">Create Staff Profile</AppText>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.md }}>
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
              style={styles.inviteInput}
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

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: Spacing.xl },
  container: { padding: Spacing.xl, backgroundColor: Colors.white, maxHeight: '85%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xl },
  closeBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.borderLight, justifyContent: 'center', alignItems: 'center' },
  inviteInput: { fontSize: 20, textAlign: 'center', letterSpacing: 4, fontWeight: '900' }
});