import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

export default function StaffLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Modal State
  const [isModalVisible, setModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

 const handleLogin = () => {
    // Phase D: This will validate against Supabase first.
    // For now, any click successfully routes to the dashboard.
    console.log(`Simulating successful login for: ${email}`);
    
    // Using 'as any' bypasses the stale typed-routes cache
    router.replace('/staff' as any);
  };

  const handleActivation = () => {
    console.log(`Activating invite code: ${inviteCode}`);
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <Feather name="lock" size={32} color="#18181b" />
          <Text style={styles.title}>Staff Portal</Text>
          <Text style={styles.subtitle}>Secure access for PsyCaD personnel.</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={styles.input}
            placeholder="name@uj.ac.za"
            placeholderTextColor="#a1a1aa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#a1a1aa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.textLink} onPress={() => setModalVisible(true)}>
          <Text style={styles.textLinkText}>First time here? Activate your staff invite.</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Activate Account</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#18181b" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>Enter the 6-character code provided by your administrator.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Invite Code</Text>
              <TextInput 
                style={styles.input}
                placeholder="e.g. X7K9P2"
                placeholderTextColor="#a1a1aa"
                autoCapitalize="characters"
                value={inviteCode}
                onChangeText={setInviteCode}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Set Permanent Password</Text>
              <TextInput 
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#a1a1aa"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={handleActivation}>
              <Text style={styles.primaryButtonText}>ACTIVATE & LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa', justifyContent: 'center' },
  formContainer: { padding: 24, paddingBottom: 60 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '900', color: '#18181b', textTransform: 'uppercase', marginTop: 12 },
  subtitle: { fontSize: 13, fontWeight: '600', color: '#71717a', marginTop: 4 },
  
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '800', color: '#18181b', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  input: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#18181b', borderBottomWidth: 4, borderRadius: 8, padding: 16, fontSize: 16, fontWeight: '600', color: '#18181b' },
  
  primaryButton: { backgroundColor: '#18181b', borderRadius: 8, padding: 18, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  
  textLink: { marginTop: 24, alignItems: 'center' },
  textLinkText: { color: '#52525b', fontWeight: '700', fontSize: 13, textDecorationLine: 'underline' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(24, 24, 27, 0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fafafa', padding: 24, paddingBottom: 40, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 2, borderColor: '#18181b', borderBottomWidth: 0 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#18181b', textTransform: 'uppercase' },
  modalSubtitle: { fontSize: 13, fontWeight: '600', color: '#71717a', marginBottom: 24 },
});