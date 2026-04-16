import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PairingModal } from '../components/domain/PairingModal';
import { AppButton } from '../components/ui/AppButton';
import { AppText } from '../components/ui/AppText';
import { Brutalist, Colors, Spacing } from '../constants/theme';

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [pin, setPin] = useState('');

  // Only show persona toggle on the main lobby screens
  const isLobby = pathname === '/' || pathname === '/login';
  const activePersona = pathname === '/login' ? 'STAFF' : 'PUBLIC';

  const handleAuth = () => {
    setModalVisible(false);
    setPin('');
    router.replace('/navigate' as any);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* 1. INDUSTRIAL BRANDING & PERSONA TOGGLE */}
        {isLobby && (
          <View style={styles.header}>
            <AppText variant="displaySm" style={styles.logoText}>EchoNav</AppText>
            
            <View style={styles.toggleWrapper}>
              <TouchableOpacity 
                style={[styles.tabSegment, activePersona === 'PUBLIC' && styles.activeSegment]}
                onPress={() => router.push('/' as any)}
              >
                <AppText variant="label" color={activePersona === 'PUBLIC' ? "primary" : "muted"}>PUBLIC</AppText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.tabSegment, activePersona === 'STAFF' && styles.activeSegment]}
                onPress={() => router.push('/login' as any)}
              >
                <AppText variant="label" color={activePersona === 'STAFF' ? "primary" : "muted"}>STAFF</AppText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 2. MAIN CONTENT STACK */}
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </View>

        {/* 3. PERSISTENT CTA */}
        {isLobby && (
          <View style={styles.footerAction}>
            <AppButton 
              variant="primary" 
              onPress={() => setModalVisible(true)} 
              style={styles.ctaButton}
            >
              ACCESSIBILITY SETUP
            </AppButton>
          </View>
        )}

        <PairingModal 
          visible={isModalVisible} pin={pin} onPinChange={setPin}
          onClose={() => setModalVisible(false)} onAuthenticate={handleAuth}
        />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  header: { 
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md, 
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: Colors.black
  },
  logoText: { letterSpacing: 4, fontWeight: '900', marginBottom: Spacing.md },
  toggleWrapper: { 
    flexDirection: 'row', 
    backgroundColor: '#f1f1f1', 
    borderRadius: 12, 
    padding: 4, 
    width: '85%',
    borderWidth: 2,
    borderColor: Colors.black
  },
  tabSegment: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeSegment: { 
    ...Brutalist.card,
    borderRadius: 8,
    borderBottomWidth: 3,
    borderRightWidth: 2,
    marginBottom: 0,
    backgroundColor: Colors.white
  },
  footerAction: { 
    padding: Spacing.md, // Reduced from Spacing.lg
    backgroundColor: Colors.black,
    borderTopWidth: 2,
    borderColor: Colors.white
  },
  ctaButton: { 
    height: 48, // Reduced from 60
    borderRadius: 0 
  }
});