import { Feather } from '@expo/vector-icons';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { AppButton } from '../ui/AppButton';
import { AppInput } from '../ui/AppInput';
import { AppText } from '../ui/AppText';

interface PairingModalProps {
  visible: boolean;
  pin: string;
  onPinChange: (val: string) => void;
  onClose: () => void;
  onAuthenticate: () => void;
}

export function PairingModal({ visible, pin, onPinChange, onClose, onAuthenticate }: PairingModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <AppText variant="titleMd">Visually Impaired Device Provisioning</AppText>
            <TouchableOpacity onPress={onClose}><Feather name="x" size={24} color={Colors.black} /></TouchableOpacity>
          </View>
          <AppText variant="bodySm" color="secondary" style={styles.subtitle}>
            Enter the 6-digit TTL PIN from the Instituition Admin Accessibility Desk.
          </AppText>
          <AppInput
            label="Secure PIN"
            value={pin}
            onChangeText={onPinChange}
            placeholder="••••••"
            keyboardType="number-pad"
            maxLength={6}
            style={styles.pinInput}
          />
          <AppButton 
            onPress={onAuthenticate} 
            disabled={pin.length !== 6}
            variant="primary"
          >
            AUTHENTICATE & BIND
          </AppButton>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  card: { backgroundColor: Colors.background, padding: Spacing.xl, paddingBottom: 40, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 2, borderColor: Colors.black },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  subtitle: { marginBottom: Spacing.xl },
  pinInput: { textAlign: 'center', fontSize: 24, fontWeight: '900', letterSpacing: 10 }
});