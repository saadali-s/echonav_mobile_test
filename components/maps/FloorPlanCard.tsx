import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../ui/AppText';

export function FloorPlanCard({ title, building, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="w-40 p-0 overflow-hidden mr-4 bg-white dark:bg-zinc-950 border-2 border-b-[6px] border-r-[4px] border-black dark:border-zinc-800 rounded-xl shadow-md">
      <View className="h-24 bg-zinc-100 dark:bg-zinc-900 justify-center items-center">
        <Feather name="layers" size={24} className="text-zinc-400" />
      </View>
      <View className="p-3">
        <AppText variant="titleSm" numberOfLines={1}>{title}</AppText>
        <AppText variant="caption" color="muted">{building}</AppText>
      </View>
    </TouchableOpacity>
  );
}