import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
// Corrected depth: going up 3 levels to root/components
import { CompactTaskCard } from '../../../components/domain/CompactTaskCard';
import { FloorPlanCard } from '../../../components/domain/FloorPlanCard';
import { StaffHeader } from '../../../components/domain/StaffHeader';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { Spacing } from '../../../constants/theme';

export default function StaffHome() {
  const router = useRouter();

  return (
    <AppScreen padded={false} scrollable={false}>
      {/* FIXED HEADER: Outside the ScrollView */}
      <StaffHeader name="Thabo Nkosi" onLogout={() => router.replace('/login' as any)} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ paddingHorizontal: Spacing.xl, marginTop: Spacing.lg }}>
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
        </View>

        <View style={{ marginTop: Spacing.xxl }}>
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.md }}>
            <AppText variant="titleMd">Recent Maps</AppText>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: Spacing.xl, paddingRight: Spacing.sm }}>
            <FloorPlanCard title="Level 1" building="Rosebank Mall" onPress={() => router.push('/staff/maps' as any)} />
            <FloorPlanCard title="Terminal A" building="O.R. Tambo" onPress={() => router.push('/staff/maps' as any)} />
          </ScrollView>
        </View>
      </ScrollView>
    </AppScreen>
  );
}