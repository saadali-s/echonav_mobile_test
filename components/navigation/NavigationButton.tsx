import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../ui/AppText';

export function NavigationButton({ isActive, onPress }: { isActive: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.9}
      className={`flex-1 justify-center items-center ${isActive ? 'bg-emerald-500/20' : 'bg-black dark:bg-white'}`}
    >
      <View className={`w-24 h-24 rounded-full border-4 mb-5 ${isActive ? 'border-emerald-500' : 'border-white dark:border-black'}`} />
      <AppText variant="displayLg" color="inverse">
        {isActive ? 'NAVIGATING' : 'TAP TO START'}
      </AppText>
      <AppText variant="body" color="muted" className="mt-2">
        {isActive ? 'Follow audio and radar' : 'Ready for destination'}
      </AppText>
    </TouchableOpacity>
  );
}