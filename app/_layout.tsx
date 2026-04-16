import { Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* 1. Global Top Bar */}
      <View style={styles.header}>
        <Text style={styles.logo}>EchoNav</Text>
      </View>

      {/* 2. Main Content (The Segmented Tabs will inject here) */}
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>

      {/* 3. Persistent Accessibility Footer */}
      <TouchableOpacity style={styles.accessibilityFooter} activeOpacity={0.8}>
        <Text style={styles.footerText}>Accessibility Setup (Device Pairing)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f4f4f5', alignItems: 'center' },
  logo: { fontSize: 20, fontWeight: '900', letterSpacing: 1, color: '#18181b' },
  content: { flex: 1, backgroundColor: '#fafafa' },
  accessibilityFooter: { backgroundColor: '#18181b', paddingVertical: 24, alignItems: 'center', justifyContent: 'center' },
  footerText: { color: '#ffffff', fontWeight: '900', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }
});