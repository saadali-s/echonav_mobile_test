import { AppCard } from '@/components/ui/AppCard';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { CompactTaskCard } from '../../../components/fleet/CompactTaskCard';
import { CompletedTaskTag } from '../../../components/fleet/CompletedTaskTag';
import { FloorPlanCard } from '../../../components/maps/FloorPlanCard';
import { StaffHeader } from '../../../components/staff/StaffHeader';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { useAppAlert } from '../../../core/context/AlertContext';
import { useAuth } from '../../../core/context/AuthContext';
import { DashboardAPI } from '../../../core/services/DashboardAPI';
import { FleetAPI } from '../../../core/services/FleetAPI';

export default function StaffHome() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { orgId, userId, logout } = useAuth();
  const { showAlert } = useAppAlert();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    if (!orgId || !userId) return;
    try {
      const [dashRes, tasksRes] = await Promise.all([
        DashboardAPI.getDashboardData(orgId),
        FleetAPI.getStaffTasks(userId)
      ]);
      setDashboardData(dashRes);
      setTasks(tasksRes);
    } catch (error: any) {
      showAlert("SYNC ERROR", error.message || "Failed to load dashboard data.", "error");
    }
  };

  useEffect(() => {
    const initLoad = async () => {
      setIsLoading(true);
      await fetchDashboardData();
      setIsLoading(false);
    };
    initLoad();
  }, [orgId, userId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  if (isLoading || !dashboardData) {
    return (
      <AppScreen centered padded={false}>
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#10b981' : '#000'} />
      </AppScreen>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'VERIFIED' || t.status === 'COMPLETED');
  const pendingTasks = tasks.filter(t => t.status === 'TO_DO' || t.status === 'PENDING' || t.status === 'IN_PROGRESS').slice(0, 4);

  return (
    <AppScreen padded={false} scrollable={false}>
      <StaffHeader name={dashboardData.userName || "Operator"} onLogout={handleLogout} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#10b981" colors={['#10b981']} />}
      >
        
        {completedTasks.length > 0 && (
          <View className="mt-5 mb-2">
            <View className="px-5 mb-2">
              <AppText variant="label" color="muted">Recently Completed</AppText>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
              {completedTasks.map(t => (
                <CompletedTaskTag key={t.id} title={`Node #${t.nodeLabel}`} />
              ))}
            </ScrollView>
          </View>
        )}

        <View className="px-5 mt-4">
          <View className="flex-row justify-between items-baseline mb-3">
            <AppText variant="titleMd">Priority Queue</AppText>
            <TouchableOpacity onPress={() => router.push('/staff/tasks' as any)}>
              <AppText variant="caption" color="link">View All</AppText>
            </TouchableOpacity>
          </View>
          
          {pendingTasks.length === 0 ? (
            <AppCard variant="default">
                <AppText variant="bodySm" color="muted" center>Queue Empty.</AppText>
            </AppCard>
          ) : (
            pendingTasks.map((task: any) => (
              <CompactTaskCard 
                key={task.id}
                title={task.status === 'IN_PROGRESS' ? 'Calibrate Node' : 'Deploy Beacon'} 
                location={task.nodeLabel}
                status={task.status === 'TO_DO' ? 'PENDING' : 'IN_PROGRESS'} 
                onPress={() => router.push(`/staff/task/${task.id}` as any)} 
              />
            ))
          )}
        </View>

        <View className="mt-8">
          <View className="flex-row justify-between items-baseline px-5 mb-3">
            <AppText variant="titleMd">Recent Maps</AppText>
            <TouchableOpacity onPress={() => router.push('/staff/maps' as any)}>
              <AppText variant="caption" color="link">View All</AppText>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}>
            {dashboardData.recentPlans?.length === 0 ? (
              <AppText variant="bodySm" color="muted">No maps available.</AppText>
            ) : (
              dashboardData.recentPlans.map((plan: any) => (
                <FloorPlanCard 
                  key={plan.id}
                  title={plan.name} 
                  building={plan.building} 
                  onPress={() => router.push(`/staff/maps/${plan.id}` as any)} 
                />
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </AppScreen>
  );
}