import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../ui/AppText';

export function StaffIdentityBar({ name, onLogout }: { name: string; onLogout: () => void }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <View className="flex-row items-center p-3 mb-5 bg-white dark:bg-zinc-950 rounded-xl border-2 border-b-[6px] border-r-[4px] border-black dark:border-zinc-800 shadow-md">
      <View className="w-12 h-12 rounded-lg bg-black dark:bg-zinc-800 items-center justify-center border border-white dark:border-zinc-700">
        <AppText variant="titleMd" color="inverse">{initials}</AppText>
      </View>
      <View className="flex-1 ml-3">
        <AppText variant="caption" color="secondary">AUTHORIZED STAFF</AppText>
        <AppText variant="titleMd">{name}</AppText>
      </View>
      <TouchableOpacity onPress={onLogout} activeOpacity={0.7} className="w-10 h-10 rounded-full bg-red-600 items-center justify-center border-2 border-black dark:border-zinc-800">
        <Feather name="log-out" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
}