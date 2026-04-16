import { Feather } from '@expo/vector-icons';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Brutalist, Colors, Spacing } from '../../constants/theme';
import { AppButton } from '../ui/AppButton';
import { AppInput } from '../ui/AppInput';
import { AppText } from '../ui/AppText';

interface AccountActivationModalProps {
  visible: boolean;
  inviteCode: string;
  onCodeChange: (val: string) => void;
  onClose: () => void;
  onActivate: () => void;
}

export function AccountActivationModal({ 
  visible, 
  inviteCode, 
  onCodeChange, 
  onClose, 
  onActivate 
}: AccountActivationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.overlay}
      >
        <View style={[Brutalist.card, styles.container]}>
          <View style={styles.header}>
            <View>
              <AppText variant="label" color="muted">Staff onboarding</AppText>
              <AppText variant="titleMd">Account Activation</AppText>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <AppText variant="bodySm" color="secondary" style={styles.subtitle}>
            Enter the unique 6-character activation key emailed from your instituition.
          </AppText>

          <AppInput 
            placeholder="X7K-9P2" 
            value={inviteCode} 
            onChangeText={onCodeChange}
            autoCapitalize="characters"
            maxLength={6}
            style={styles.input}
          />

          <AppButton variant="primary" onPress={onActivate}>
            VERIFY AND BIND
          </AppButton>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: Spacing.xl },
  container: { padding: Spacing.xl, backgroundColor: Colors.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  closeBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.borderLight, justifyContent: 'center', alignItems: 'center' },
  subtitle: { marginBottom: Spacing.xl },
  input: { fontSize: 20, textAlign: 'center', letterSpacing: 4, fontWeight: '900' }
});