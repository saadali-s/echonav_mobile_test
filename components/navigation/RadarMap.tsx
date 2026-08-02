import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { AppCard } from '../ui/AppCard';
import { AppText } from '../ui/AppText';

interface RadarMapProps {
  isScanning: boolean;
  distance: number | null; 
  heading: number;
}

export function RadarMap({ isScanning, distance, heading }: RadarMapProps) {
  const RADAR_SIZE = 260;
  const CENTER = RADAR_SIZE / 2;
  const [estimatedBearing, setEstimatedBearing] = useState<number | null>(null);
  const prevDistance = useRef<number | null>(null);

  useEffect(() => {
    if (!isScanning || distance === null) {
      setEstimatedBearing(null);
      prevDistance.current = null;
      return;
    }

    if (estimatedBearing === null) {
      setEstimatedBearing(heading);
    } else if (prevDistance.current !== null) {
      const delta = distance - prevDistance.current;
      if (delta < -0.2) setEstimatedBearing(heading);
      else if (delta > 0.2) setEstimatedBearing((heading + 180) % 360);
    }
    prevDistance.current = distance;
  }, [distance, heading, isScanning]);

  const radarRadius = (Math.max(0.1, Math.min(distance ?? 10, 10)) / 10) * (CENTER - 20);
  const angleRad = (estimatedBearing !== null ? (estimatedBearing - heading - 90) : 0) * (Math.PI / 180);
  
  const beaconX = CENTER + radarRadius * Math.cos(angleRad) - 10;
  const beaconY = CENTER + radarRadius * Math.sin(angleRad) - 10;

  return (
    <AppCard padded={false} className="bg-zinc-50 dark:bg-black items-center overflow-hidden border-zinc-200 dark:border-zinc-800">
      <View className="relative items-center justify-center rounded-full bg-white dark:bg-[#0a0a0a] my-5 shadow-sm dark:shadow-none" style={{ width: RADAR_SIZE, height: RADAR_SIZE }}>
        <View className="absolute rounded-full border border-emerald-500/20" style={{ width: RADAR_SIZE * 0.7, height: RADAR_SIZE * 0.7 }} />
        <View className="absolute rounded-full border border-emerald-500/20" style={{ width: RADAR_SIZE * 0.35, height: RADAR_SIZE * 0.35 }} />
        <View className="absolute w-[1px] h-full bg-emerald-500/10" />
        <View className="absolute w-full h-[1px] bg-emerald-500/10" />

        <View className="absolute items-center justify-center w-5 h-20 z-10">
          <View className="w-1 h-10 bg-emerald-500 items-center">
            <View className="absolute -top-3 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-emerald-500" />
          </View>
          <View className="w-1 h-10 bg-zinc-700" />
          <View className="absolute w-3 h-3 rounded-full bg-black dark:bg-white border-2 border-white dark:border-black" />
        </View>

        {isScanning && estimatedBearing !== null && (
          <View className="absolute w-5 h-5 rounded-full bg-red-600 border-2 border-white z-20" style={{ left: beaconX, top: beaconY }}>
             <View className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-red-600/30" />
          </View>
        )}
      </View>

      <View className="w-full bg-zinc-200 dark:bg-zinc-900 p-3 items-center border-t-2 border-zinc-300 dark:border-white/10">
        <AppText variant="titleMd" color="primary">
          {distance !== null ? `${distance.toFixed(1)} METERS` : 'ACQUIRING SIGNAL...'}
        </AppText>
      </View>
    </AppCard>
  );
}