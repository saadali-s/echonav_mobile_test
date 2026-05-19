import { Stack } from 'expo-router';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from '../../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(user)" />
          <Stack.Screen name="staff" />
          <Stack.Screen name="navigate/index" />
        </Stack>
      </PaperProvider>
    </AuthProvider>
  );
}