import { Tabs } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Custom Tab Bar to look like a segmented toggle switch
function SegmentedTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.toggleWrapper}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tabSegment, isFocused && styles.activeSegment]}
              activeOpacity={0.9}
            >
              <Text style={[styles.tabText, isFocused && styles.activeText]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <SegmentedTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Public Venues' }} />
      <Tabs.Screen name="login" options={{ title: 'Staff Login' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fafafa', paddingTop: 20, paddingHorizontal: 20, paddingBottom: 10 },
  toggleWrapper: { flexDirection: 'row', backgroundColor: '#e4e4e7', borderRadius: 12, padding: 4 },
  tabSegment: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeSegment: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '700', color: '#71717a', textTransform: 'uppercase', letterSpacing: 0.5 },
  activeText: { color: '#18181b', fontWeight: '900' }
});