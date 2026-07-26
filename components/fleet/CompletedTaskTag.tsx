import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../ui/AppText';

export function CompletedTaskTag({ title }: { title: string }) {
  return (
    <View className="flex-row items-center bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg gap-1.5">
      <Feather name="check-circle" size={12} className="text-emerald-600 dark:text-emerald-500" />
      <AppText variant="caption" className="font-bold text-zinc-950 dark:text-white">{title}</AppText>
    </View>
  );
}