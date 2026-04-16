import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Task, TaskCard } from '../../components/TaskCard';

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Deploy Beacon', location: 'Science Block - Lab 202', status: 'PENDING' },
  { id: '2', title: 'Calibrate Node', location: 'Main Library - Floor 1', status: 'IN_PROGRESS' },
  { id: '3', title: 'Battery Replacement', location: 'O.R. Tambo - Terminal A', status: 'COMPLETED' },
];

export default function StaffDashboard() {
  const router = useRouter();

  const handleTaskPress = (task: Task) => {
    // Navigate to the dynamic execution screen.
    // 'as any' bypasses the typed-routes cache for newly created files.
    router.push(`/staff/task/${task.id}` as any);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_TASKS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.welcome}>Welcome back.</Text>
            <Text style={styles.subtitle}>You have 2 pending deployment tasks today.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard task={item} onPress={() => handleTaskPress(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  listContent: { padding: 20 },
  header: { marginBottom: 24, paddingVertical: 12 },
  welcome: { fontSize: 24, fontWeight: '900', color: '#18181b', textTransform: 'uppercase' },
  subtitle: { fontSize: 13, fontWeight: '600', color: '#71717a', marginTop: 4 }
});