import { AppCard } from '@/components/ui/AppCard';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { CompactTaskCard } from '../../../components/domain/CompactTaskCard';
import { CompletedTaskTag } from '../../../components/domain/CompletedTaskTag';
import { FloorPlanCard } from '../../../components/domain/FloorPlanCard';
import { StaffHeader } from '../../../components/domain/StaffHeader';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { Colors, Spacing } from '../../../constants/theme';
import { useAuth } from '../../../context/AuthContext';
import { DashboardAPI } from '../../../services/DashboardAPI';
import { FleetAPI } from '../../../services/FleetAPI';

export default function StaffHome() {
  const router = useRouter();
  const { orgId, userId, logout } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!orgId || !userId) return;
      try {
        setIsLoading(true);
        const [dashRes, tasksRes] = await Promise.all([
          DashboardAPI.getDashboardData(orgId),
          FleetAPI.getStaffTasks(userId)
        ]);
        setDashboardData(dashRes);
        setTasks(tasksRes);
      } catch (error: any) {
        Alert.alert("Sync Error", error.message || "Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, [orgId, userId]);

  const handleLogout = async () => {
    await logout();
    // THE FIX: Explicitly force the app back to the radar screen
    router.replace('/');
  };

  if (isLoading || !dashboardData) {
    return (
      <AppScreen centered padded={false}>
        <ActivityIndicator size="large" color={Colors.black} />
      </AppScreen>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'VERIFIED' || t.status === 'COMPLETED');
  const pendingTasks = tasks.filter(t => t.status === 'TO_DO' || t.status === 'PENDING' || t.status === 'IN_PROGRESS').slice(0, 4);

  return (
    <AppScreen padded={false} scrollable={false}>
      <StaffHeader name={dashboardData.userName || "Operator"} onLogout={handleLogout} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {completedTasks.length > 0 && (
          <View style={{ marginTop: Spacing.lg, marginBottom: Spacing.sm }}>
            <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.sm }}>
              <AppText variant="label" color="muted">Recently Completed</AppText>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: Spacing.sm }}>
              {completedTasks.map(t => (
                <CompletedTaskTag key={t.id} title={`Node #${t.nodeId}`} />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ paddingHorizontal: Spacing.xl, marginTop: Spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: Spacing.md }}>
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
                location={`Map Node #${task.nodeId}`} 
                status={task.status === 'TO_DO' ? 'PENDING' : 'IN_PROGRESS'} 
                onPress={() => router.push(`/staff/task/${task.id}` as any)} 
              />
            ))
          )}
        </View>

        <View style={{ marginTop: Spacing.xxl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: Spacing.xl, marginBottom: Spacing.md }}>
            <AppText variant="titleMd">Recent Maps</AppText>
            <TouchableOpacity onPress={() => router.push('/staff/maps' as any)}>
              <AppText variant="caption" color="link">View All</AppText>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: Spacing.xl, paddingRight: Spacing.sm }}>
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