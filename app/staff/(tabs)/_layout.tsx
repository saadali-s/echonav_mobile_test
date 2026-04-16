import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors, Layouts } from '../../../constants/theme';

export default function StaffTabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { 
        height: Layouts.tabBarHeight, 
        borderTopWidth: 3, 
        borderTopColor: Colors.black, 
        paddingBottom: 25, 
        paddingTop: 12,
        backgroundColor: Colors.white
      },
      tabBarActiveTintColor: Colors.black,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarLabelStyle: { fontWeight: '900', textTransform: 'uppercase', fontSize: 10 }
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({color}) => <Feather name="home" size={20} color={color}/> }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks', tabBarIcon: ({color}) => <Feather name="list" size={20} color={color}/> }} />
      <Tabs.Screen name="maps" options={{ title: 'Maps', tabBarIcon: ({color}) => <Feather name="map" size={20} color={color}/> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({color}) => <Feather name="settings" size={20} color={color}/> }} />
    </Tabs>
  );
}