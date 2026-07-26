import 'react-native-reanimated'; 
import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AlertProvider } from '../core/context/AlertContext';
import { AuthProvider, useAuth } from '../core/context/AuthContext';

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