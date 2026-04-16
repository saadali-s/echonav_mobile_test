import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { Task, TaskCard } from '../../../components/TaskCard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Colors, Spacing } from '../../../constants/theme';

const MOCK_DATA: Task[] = [
  { id: '1', title: 'Entrance Beacon', location: 'Gate 1', status: 'PENDING' },
  { id: '2', title: 'Library Node 4', location: 'Floor 2', status: 'IN_PROGRESS' },
  { id: '3', title: 'Cafe Beacon', location: 'Student Center', status: 'COMPLETED' },
  { id: '4', title: 'Lab 202 Cal', location: 'Science Block', status: 'PENDING' },
];

const FILTERS: (Task['status'] | 'ALL')[] = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function AllTasksScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | Task['status']>('ALL');

  const filteredTasks = MOCK_DATA.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                         task.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || task.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppScreen padded={false} scrollable={false}>
      <View style={{ padding: Spacing.xl, backgroundColor: Colors.white, borderBottomWidth: 3, borderBottomColor: Colors.black }}>
        <AppText variant="displaySm" style={{ marginBottom: Spacing.md }}>Deployment Queue</AppText>
        <SearchInput value={search} onChangeText={setSearch} placeholder="Search beacons or sites..." />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm, marginTop: Spacing.md }}>
          {FILTERS.map(f => (
            <TouchableOpacity 
              key={f} 
              onPress={() => setActiveFilter(f)}
              style={{
                paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
                backgroundColor: activeFilter === f ? Colors.black : '#f1f1f1',
                borderWidth: 2, borderColor: Colors.black
              }}
            >
              <AppText variant="caption" color={activeFilter === f ? "inverse" : "primary"}>{f.replace('_', ' ')}</AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 150 }}
        renderItem={({ item }) => (
          <TaskCard 
            task={item} 
            onPress={() => router.push(`/staff/task/${item.id}` as any)} 
          />
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <AppText variant="body" color="muted">No matching deployments found.</AppText>
          </View>
        )}
      />
    </AppScreen>
  );
}