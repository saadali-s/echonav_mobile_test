import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { AppBadge } from './ui/AppBadge';
import { AppCard } from './ui/AppCard';
import { AppText } from './ui/AppText';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  location: string;
  status: TaskStatus;
}

const STATUS_CONFIG = {
  PENDING: { variant: 'warning' as const, icon: 'clock' as const, label: 'PENDING' },
  IN_PROGRESS: { variant: 'info' as const, icon: 'loader' as const, label: 'IN PROGRESS' },
  COMPLETED: { variant: 'success' as const, icon: 'check-circle' as const, label: 'COMPLETED' },
};

export function TaskCard({ task, onPress }: { task: Task; onPress: () => void }) {
  const config = STATUS_CONFIG[task.status];

  return (
    <AppCard onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1, paddingRight: Spacing.md }}>
        <AppText variant="titleMd">{task.title}</AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: 4 }}>
          <Feather name="map-pin" size={13} color={Colors.textSecondary} />
          <AppText variant="bodySm" color="secondary">{task.location}</AppText>
        </View>
      </View>
      <AppBadge label={config.label} variant={config.variant} icon={config.icon} />
    </AppCard>
  );
}