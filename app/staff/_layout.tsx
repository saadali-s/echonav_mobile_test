import { Stack } from 'expo-router';

export default function StaffLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'FLEET MANAGEMENT',
          headerStyle: { backgroundColor: '#18181b' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '900' }, // <-- Removed letterSpacing
          headerBackVisible: false 
        }} 
      />
    </Stack>
  );
}