import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  location: string;
  status: TaskStatus;
}

interface TaskCardProps {
  task: Task;
  onPress: () => void;
}

export function TaskCard({ task, onPress }: TaskCardProps) {
  const getStatusStyles = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED': return { bg: '#dcfce7', text: '#166534', icon: 'check-circle' };
      case 'IN_PROGRESS': return { bg: '#dbeafe', text: '#1e40af', icon: 'loader' };
      default: return { bg: '#fef9c3', text: '#854d0e', icon: 'clock' }; // PENDING
    }
  };

  const styleConfig = getStatusStyles(task.status);
  const statusLabel = task.status.replace('_', ' ');

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color="#71717a" />
          <Text style={styles.location}>{task.location}</Text>
        </View>
      </View>
      
      <View style={[styles.badge, { backgroundColor: styleConfig.bg }]}>
        <Feather name={styleConfig.icon as any} size={12} color={styleConfig.text} />
        <Text style={[styles.badgeText, { color: styleConfig.text }]}>
          {statusLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    flexDirection: 'row', backgroundColor: '#ffffff', borderWidth: 2, 
    borderColor: '#18181b', borderBottomWidth: 6, borderRightWidth: 4, 
    borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  content: { flex: 1, paddingRight: 12 },
  title: { fontSize: 15, fontWeight: '900', color: '#18181b', textTransform: 'uppercase', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  location: { fontSize: 12, fontWeight: '700', color: '#71717a' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 2, borderColor: '#18181b' },
  badgeText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 }
});