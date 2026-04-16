import { Stack } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function StaffRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="(tabs)" /> 
      <Stack.Screen name="task/[id]" options={{ headerShown: true, title: 'EXECUTION', headerTitleStyle: { fontWeight: '900' } }} />
      <Stack.Screen name="calibrate/[id]" options={{ headerShown: true, title: 'CALIBRATION', headerTitleStyle: { fontWeight: '900' } }} />
    </Stack>
  );
}