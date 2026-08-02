import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FloorPlanCanvas } from '../../../components/maps/FloorPlanCanvas';
import { AppScreen } from '../../../components/ui/AppScreen';

export default function VectorMapView() {
  const { id } = useLocalSearchParams();

  return (
    <AppScreen padded={false} scrollable={false} style={{ backgroundColor: '#111' }}>
      <FloorPlanCanvas mapId={id as string} />
    </AppScreen>
  );
}