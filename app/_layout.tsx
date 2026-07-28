import 'react-native-reanimated'; 
import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { Provider as PaperProvider } from 'react-native-paper';
import { AlertProvider } from '../core/context/AlertContext';
import { AuthProvider, useAuth } from '../core/context/AuthContext';

// 1. Silence Reanimated at the C++ Logger level
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, 
});

// 2. Standard LogBox catch
LogBox.ignoreLogs([
  'Reanimated', 
  'expo-av',
  'Reading from',
  'Writing to',
  'during component render'
]);

// 3. THE NUCLEAR OPTION: Intercept the raw console to prevent terminal spam
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args.join(' ');
  if (
    msg.includes('Reanimated') || 
    msg.includes('expo-av') || 
    msg.includes('value` during component render')
  ) {
    return; // Destroy the log
  }
  originalWarn(...args);
};

function RootLayoutNav() {
  const { isLoggedIn, role } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const inStaffGroup = segments[0] === 'staff';

    if (!isLoggedIn && inStaffGroup) {
      router.replace('/');
    } 
    else if (isLoggedIn && role !== 'NAV_USER' && (!segments[0] || (segments[0] as string) === '(user)')) {
      router.replace('/staff/(tabs)' as any);
    }
  }, [isLoggedIn, segments, role]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="staff" />
        <Stack.Screen name="navigate/index" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AlertProvider>
        <PaperProvider>
          <RootLayoutNav />
        </PaperProvider>
      </AlertProvider>
    </AuthProvider>
  );
}