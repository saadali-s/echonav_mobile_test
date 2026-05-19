import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { AppButton } from '../ui/AppButton';
import { AppInput } from '../ui/AppInput';
import { AppText } from '../ui/AppText';

interface PairingModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthenticate: (email: string, pin: string) => void;
}

export function PairingModal({ visible, onClose, onAuthenticate }: PairingModalProps) {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <AppText variant="titleMd">Accessibility Setup</AppText>
            <TouchableOpacity onPress={onClose}><Feather name="x" size={24} color={Colors.black} /></TouchableOpacity>
          </View>
          <AppText variant="bodySm" color="secondary" style={styles.subtitle}>
            Enter your registered email and the 6-digit TTL PIN from the Institution Accessibility Desk.
          </AppText>
          
          <AppInput
            label="Registered Email"
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppInput
            label="Secure PIN"
            value={pin}
            onChangeText={setPin}
            placeholder="•••••"
            keyboardType="number-pad"
            maxLength={6}
            style={styles.pinInput}
          />

          <AppButton 
            onPress={() => onAuthenticate(email, pin)} 
            disabled={pin.length !== 5 || !email.includes('@')}
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