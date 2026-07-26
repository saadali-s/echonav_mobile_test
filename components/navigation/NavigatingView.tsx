import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RadarMap } from './RadarMap';
import { AppButton } from '../ui/AppButton';
import { AppScreen } from '../ui/AppScreen';
import { AppText } from '../ui/AppText';

export function NavigatingView({
  targetNodeLabel, isScanning, distance, isSpinning, totalDistanceMeters, estimatedTimeSeconds, pathLabels, onTriggerAudio, onCancel
}: any) {
  return (
    <AppScreen padded={false} scrollable={false}>
      <View className="flex-1 justify-center items-center">
        <AppText variant="titleSm" color="muted">NAVIGATING TO</AppText>
        
        <View className="flex-row items-center gap-3 my-2">
          <AppText variant="displayMd" color="primary" center>{targetNodeLabel}</AppText>
          
          <TouchableOpacity 
              onPress={onTriggerAudio} 
              className="bg-emerald-500 p-3 rounded-full shadow-lg shadow-emerald-500/40 elevation-md"
          >
              <Feather name="play" size={24} className="text-white" />
          </TouchableOpacity>
        </View>
        
        <RadarMap isScanning={isScanning} distance={distance} heading={0} />
        
        {isSpinning && (
          <View className="mt-4 bg-amber-500/10 p-3 rounded-lg border-2 border-amber-500 w-[85%]">
              <AppText variant="caption" color="warning" center>SPIN-LOCK ENGAGED: TRACKING PAUSED</AppText>
          </View>
        )}

        <AppText variant="caption" color="muted" className="mt-5">
            Trip: {totalDistanceMeters.toFixed(1)}m | ETA: {Math.ceil(estimatedTimeSeconds)}s
        </AppText>

        <View className="mt-4 bg-zinc-100 dark:bg-white/5 p-3 rounded-lg w-[85%]">
          <AppText variant="caption" color="success" center className="mb-1.5">ROUTING SEQUENCE</AppText>
          <AppText variant="caption" color="muted" center className="leading-5">
            {pathLabels.join('  ➔  ')}
          </AppText>
        </View>

        <AppButton variant="danger" onPress={onCancel} className="mt-5 w-[85%]">
          CANCEL ROUTE
        </AppButton>
      </View>
    </AppScreen>
  );
}