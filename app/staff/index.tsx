import { Redirect } from 'expo-router';
import React from 'react';

// This silent component prevents Expo Router from throwing "Missing Index" warnings
export default function StaffIndex() {
  return <Redirect href="/staff/(tabs)" />;
}