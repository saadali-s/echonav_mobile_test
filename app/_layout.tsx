import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from '../context/AuthContext';

function RootLayoutNav() {
  const { isLoggedIn, role } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inStaffGroup = segments[0] === 'staff';

    // 1. Kick unauthenticated users out of the staff dashboard
    if (!isLoggedIn && inStaffGroup) {
      router.replace('/');
    } 
    // 2. Auto-route authenticated staff members to their dashboard
    else if (isLoggedIn && role !== 'NAV_USER' && (!segments[0] || (segments[0] as string) === '(user)')) {
      // THE FIX: Target the tabs directory specifically to stop the missing index warning
      router.replace('/staff/(tabs)' as any);
    }
    // Note: NAV_USER remains on '/' to utilize the radar.
  }, [isLoggedIn, segments, role]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
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