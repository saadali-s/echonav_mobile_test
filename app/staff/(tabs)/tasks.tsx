import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { Task, TaskCard } from '../../../components/fleet/TaskCard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { SearchInput } from '../../../components/ui/SearchInput';
import { useAppAlert } from '../../../core/context/AlertContext';
import { useAuth } from '../../../core/context/AuthContext';
import { FleetAPI } from '../../../core/services/FleetAPI';

const FILTERS: (Task['status'] | 'ALL')[] = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function AllTasksScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { showAlert } = useAppAlert();
  const { colorScheme } = useColorScheme();
  
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | Task['status']>('ALL');
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTasks = async () => {
    if (!userId) return;
    try {
      const data = await FleetAPI.getStaffTasks(userId);
      const mappedTasks: Task[] = data.map((t: any) => ({
        id: String(t.id),
        title: t.status === 'VERIFIED' ? 'Calibration Audit' : 'Deploy Beacon',
        location: `Map Node #${t.nodeId}`,
        status: t.status === 'VERIFIED' ? 'COMPLETED' : t.status === 'TO_DO' ? 'PENDING' : 'IN_PROGRESS'
      }));
      setTasks(mappedTasks);
    } catch (error: any) {
      showAlert("SYNC ERROR", error.message || "Failed to load deployment queue.", "error");
    }
  };

  useEffect(() => {
    const initLoad = async () => {
      setIsLoading(true);
      await fetchTasks();
      setIsLoading(false);
    };
    initLoad();
  }, [userId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTasks();
    setIsRefreshing(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          task.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || task.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppScreen padded={false} scrollable={false}>
      <View className="p-5 bg-white dark:bg-zinc-950 border-b-[3px] border-black dark:border-zinc-800">
        <AppText variant="displaySm" className="mb-3">Deployment Queue</AppText>
        <SearchInput value={search} onChangeText={setSearch} placeholder="Search beacons or sites..." />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 12 }}>
          {FILTERS.map(f => (
            <TouchableOpacity 
              key={f} 
              onPress={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg border-2 ${
                activeFilter === f 
                  ? 'bg-black border-black dark:bg-white dark:border-white' 
                  : 'bg-zinc-100 border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700'
              }`}
            >
              <AppText variant="caption" color={activeFilter === f ? "inverse" : "primary"}>
                {f.replace('_', ' ')}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#10b981' : '#000'} />
          <AppText variant="caption" color="muted" className="mt-4">SYNCING QUEUE...</AppText>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 150 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#10b981" colors={['#10b981']} />}
          renderItem={({ item }) => (
            <TaskCard 
              task={item} 
              onPress={() => router.push(`/staff/task/${item.id}` as any)} 
            />
          )}
          ListEmptyComponent={() => (
            <View className="items-center mt-[60px]">
              <AppText variant="body" color="muted">No matching deployments found.</AppText>
            </View>
          )}
        />
      )}
    </AppScreen>
  );
}