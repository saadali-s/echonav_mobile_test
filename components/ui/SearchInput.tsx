import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TextInput, View } from 'react-native';

export function SearchInput({ value, onChangeText, placeholder = "Search..." }: any) {
  return (
    <View className="flex-row items-center px-4 h-12 bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 rounded-xl">
      <Feather name="search" size={18} className="text-zinc-400 dark:text-zinc-500" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#a1a1aa"
        className="flex-1 ml-2 font-bold text-zinc-950 dark:text-white"
      />
    </View>
  );
}