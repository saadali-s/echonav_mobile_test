import { Stack } from 'expo-router';
import React from 'react';

export default function StaffLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="calibrate/[id]" />
      <Stack.Screen name="maps/[id]" />
      <Stack.Screen name="task/[id]" />
      <Stack.Screen name="index" />
    </Stack>
  );
}