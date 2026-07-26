import { AppScreen } from '@/components/ui/AppScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator } from 'react-native';

import { DirectoryView } from '@/components/navigation/DirectoryView';
import { NavigatingView } from '@/components/navigation/NavigatingView';

import { useNavigationController } from '@/core/hooks/useNavigationController';

export default function NavigateScreen() {
  const router = useRouter();
  const { startNodeId, floorPlanId } = useLocalSearchParams();

  const {
    navState, isLoading, allNodes, currentNodeInfo, activeRoute, currentTargetIndex,
    isScanning, distance, isSpinning, triggerAudio, handleSelectDestination,
    handleCancelRoute, directoryAudioMap
  } = useNavigationController(startNodeId as string, floorPlanId as string);

  if (isLoading) {
    // THE FIX: Removed `dark` prop
    return (
      <AppScreen centered padded={false}>
        <ActivityIndicator size="large" color="#10b981" />
      </AppScreen>
    );
  }

  if (navState === 'NAVIGATING' && activeRoute) {
    const targetNode = activeRoute.path[currentTargetIndex];
    const pathLabels = activeRoute.path.map((n: any) => n.label || `Node ${n.id}`);

    return (
      <NavigatingView 
        targetNodeLabel={targetNode?.label || "DESTINATION"}
        isScanning={isScanning}
        distance={distance}
        isSpinning={isSpinning}
        totalDistanceMeters={activeRoute.totalDistanceMeters}
        estimatedTimeSeconds={activeRoute.estimatedTimeSeconds}
        pathLabels={pathLabels}
        onTriggerAudio={triggerAudio}
        onCancel={handleCancelRoute}
      />
    );
  }

  return (
    <DirectoryView 
      currentNodeLabel={currentNodeInfo?.label || `Node ${startNodeId}`}
      startNodeId={startNodeId as string}
      allNodes={allNodes}
      directoryAudioMap={directoryAudioMap}
      onClose={() => router.replace('/')}
      onSelectDestination={handleSelectDestination}
    />
  );
}