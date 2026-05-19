import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { CompactTaskCard } from '../../../components/domain/CompactTaskCard';
import { CompletedTaskTag } from '../../../components/domain/CompletedTaskTag';
import { FloorPlanCard } from '../../../components/domain/FloorPlanCard';
import { StaffHeader } from '../../../components/domain/StaffHeader';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { Spacing } from '../../../constants/theme';

export default function StaffHome() {
  const router = useRouter();

  return (
    <AppScreen padded={false} scrollable={false}>
      {/* 1. FIXED HEADER */}
      <StaffHeader name="Thabo Nkosi" onLogout={() => router.replace('/login' as any)} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* 2. RECENTLY COMPLETED KANBAN TAGS */}
        <View style={{ marginTop: Spacing.lg, marginBottom: Spacing.sm }}>
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.sm }}>
            <AppText variant="label" color="muted">Recently Completed</AppText>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: Spacing.sm }}
          >
            <CompletedTaskTag title="Gate 1 Entrance" />
            <CompletedTaskTag title="Cafe Beacon" />
            <CompletedTaskTag title="Elevator Bank B" />
            <CompletedTaskTag title="Parking Level -1" />
          </ScrollView>
        </View>

        {/* 3. PRIORITY QUEUE (Top 4) */}
        <View style={{ paddingHorizontal: Spacing.xl, marginTop: Spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: Spacing.md }}>
            <AppText variant="titleMd">Priority Queue</AppText>
            <TouchableOpacity onPress={() => router.push('/staff/tasks' as any)}>
              <AppText variant="caption" color="link">View All</AppText>
            </TouchableOpacity>
          </View>
          
          <CompactTaskCard 
            title="Deploy Beacon" 
            location="Science Block - 202" 
            status="PENDING" 
            onPress={() => router.push('/staff/task/1' as any)} 
          />
          <CompactTaskCard 
            title="Calibrate Node" 
            location="Library - Floor 1" 
            status="IN_PROGRESS" 
            onPress={() => router.push('/staff/task/2' as any)}
          />
          <CompactTaskCard 
            title="Battery Check" 
            location="Terminal A" 
            status="PENDING" 
            onPress={() => router.push('/staff/task/3' as any)}
          />
          <CompactTaskCard 
            title="Signal Audit" 
            location="Main Concourse" 
            status="PENDING" 
            onPress={() => router.push('/staff/task/4' as any)}
          />
        </View>

        {/* 4. RECENT MAPS (Top 3) */}
        <View style={{ marginTop: Spacing.xxl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: Spacing.xl, marginBottom: Spacing.md }}>
            <AppText variant="titleMd">Recent Maps</AppText>
            <TouchableOpacity onPress={() => router.push('/staff/maps' as any)}>
              <AppText variant="caption" color="link">View All</AppText>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: Spacing.xl, paddingRight: Spacing.sm }}>
            <FloorPlanCard title="Level 1" building="Rosebank Mall" onPress={() => router.push('/staff/maps/1' as any)} />
            <FloorPlanCard title="Ground Floor" building="Sandton City" onPress={() => router.push('/staff/maps/2' as any)} />
            <FloorPlanCard title="Terminal A" building="O.R. Tambo" onPress={() => router.push('/staff/maps/3' as any)} />
          </ScrollView>
        </View>
      </ScrollView>
    </AppScreen>
  );
}