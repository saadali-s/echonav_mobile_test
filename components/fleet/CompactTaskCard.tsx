import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../ui/AppText';

export function CompactTaskCard({ title, location, status, onPress }: any) {
  const isPending = status === 'PENDING';
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="flex-row items-center bg-white dark:bg-zinc-950 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 mb-2">
      <View className={`w-1 h-full rounded-full ${isPending ? 'bg-amber-500' : 'bg-blue-500'}`} />
      <View className="flex-1 ml-3">
        <AppText variant="titleSm" numberOfLines={1}>{title}</AppText>
        <View className="flex-row items-center gap-1 mt-0.5">
          <Feather name="map-pin" size={10} className="text-zinc-400" />
          <AppText variant="caption" color="muted">{location}</AppText>
        </View>
      </View>
      <Feather name="chevron-right" size={16} className="text-zinc-300 dark:text-zinc-700" />
    </TouchableOpacity>
  );
}