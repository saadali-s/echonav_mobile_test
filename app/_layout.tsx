import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from '../context/AuthContext';

// THE FIX: Inner component that can safely consume useAuth
function RootLayoutNav() {
  const { isLoggedIn, role } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Identify if the current segment belongs to the protected app flows
    const inAuthGroup = segments[0] === '(user)' || segments[0] === 'staff' || segments[0] === 'navigate';

    if (!isLoggedIn && inAuthGroup) {
      // 2. The user is logged out but inside the app -> Kick them to the login screen
      router.replace('/');
    } else if (isLoggedIn && !inAuthGroup) {
      // 3. The user is logged in but sitting on a public screen -> Route them to their dashboard
      if (role === 'ADMIN' || role === 'TECHNICIAN') {
        router.replace('/staff' as any);
      } else {
        router.replace('/(user)' as any);
      }
    }
  }, [isLoggedIn, segments, role]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(user)" />
      <Stack.Screen name="staff" />
      <Stack.Screen name="navigate/index" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <RootLayoutNav />
      </PaperProvider>
    </AuthProvider>
  );
}