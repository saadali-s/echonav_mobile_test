import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { AppScreen } from '../ui/AppScreen';
import { AppText } from '../ui/AppText';

export function ColdStartView({ onCancel }: { onCancel: () => void }) {
  return (
    <AppScreen  padded={false} scrollable={false}>
      <View className="flex-1 justify-center items-center p-5">
        <Feather name="compass" size={64} className="text-emerald-500 mb-5" />
        <AppText variant="displaySm" color="inverse" center>ROUTE SECURED</AppText>
        <AppText variant="body" color="muted" center className="mt-3 px-10 leading-6">
          Please begin walking forward to establish your orientation.
        </AppText>
        <AppButton variant="danger" onPress={onCancel} className="mt-14 w-[85%]">
          CANCEL ROUTE
        </AppButton>
      </View>
    </AppScreen>
  );
}