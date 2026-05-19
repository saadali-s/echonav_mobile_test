import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { Task, TaskCard } from '../../../components/TaskCard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Colors, Spacing } from '../../../constants/theme';
import { useAuth } from '../../../context/AuthContext';
import { FleetAPI } from '../../../services/FleetAPI';

const FILTERS: (Task['status'] | 'ALL')[] = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function AllTasksScreen() {
  const router = useRouter();
  const { userId } = useAuth(); // Extract staff ID from global context
  
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | Task['status']>('ALL');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // THE FIX: Fetch live task queue mapped to this specific technician
  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        const data = await FleetAPI.getStaffTasks(userId);
        
        const mappedTasks: Task[] = data.map((t: any) => ({
          id: String(t.id),
          title: t.status === 'VERIFIED' ? 'Calibration Audit' : 'Deploy Beacon',
          location: `Map Node #${t.nodeId}`,
          status: t.status === 'VERIFIED' ? 'COMPLETED' : t.status === 'TO_DO' ? 'PENDING' : 'IN_PROGRESS'
        }));
        
        setTasks(mappedTasks);
      } catch (error: any) {
        Alert.alert("Sync Error", error.message || "Failed to load deployment queue.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const filteredTasks = tasks.filter(task => {
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

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.black} />
          <AppText variant="caption" color="muted" style={{ marginTop: Spacing.md }}>SYNCING QUEUE...</AppText>
        </View>
      ) : (
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
      )}
    </AppScreen>
  );
}