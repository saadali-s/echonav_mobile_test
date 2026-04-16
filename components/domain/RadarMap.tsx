import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { AppCard } from '../ui/AppCard';
import { AppText } from '../ui/AppText';

interface RadarMapProps {
  isScanning: boolean;
  distance: number | null; // Fixed type to match useScanner
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
    <AppCard padded={false} style={styles.outerCard}>
      <View style={[styles.radarCircle, { width: RADAR_SIZE, height: RADAR_SIZE }]}>
        <View style={[styles.gridRing, { width: RADAR_SIZE * 0.7, height: RADAR_SIZE * 0.7 }]} />
        <View style={[styles.gridRing, { width: RADAR_SIZE * 0.35, height: RADAR_SIZE * 0.35 }]} />
        <View style={styles.crosshairV} /><View style={styles.crosshairH} />

        <View style={styles.needleContainer}>
          <View style={styles.needleNorth}><View style={styles.arrowHead} /></View>
          <View style={styles.needleSouth} />
          <View style={styles.needlePivot} />
        </View>

        {isScanning && estimatedBearing !== null && (
          <View style={[styles.beaconDot, { left: beaconX, top: beaconY }]}>
             <View style={styles.beaconPulse} />
          </View>
        )}
      </View>

      <View style={styles.readout}>
        <AppText variant="titleMd" color="inverse">
          {distance !== null ? `${distance.toFixed(1)} METERS` : 'ACQUIRING SIGNAL...'}
        </AppText>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  outerCard: { backgroundColor: Colors.black, alignItems: 'center', overflow: 'hidden' },
  radarCircle: { position: 'relative', alignItems: 'center', justifyContent: 'center', borderRadius: 999, backgroundColor: '#0a0a0a', marginVertical: Spacing.xl },
  gridRing: { position: 'absolute', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)' },
  crosshairV: { position: 'absolute', width: 1, height: '100%', backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  crosshairH: { position: 'absolute', width: '100%', height: 1, backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  needleContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 20, height: 80, zIndex: 10 },
  needleNorth: { width: 4, height: 40, backgroundColor: Colors.activeGreen, alignItems: 'center' },
  arrowHead: { width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 12, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: Colors.activeGreen, position: 'absolute', top: -12 },
  needleSouth: { width: 4, height: 40, backgroundColor: '#3f3f46' },
  needlePivot: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.black, borderWidth: 2, borderColor: Colors.white },
  beaconDot: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.dangerText, borderWidth: 2, borderColor: Colors.white, zIndex: 15 },
  beaconPulse: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(185, 28, 28, 0.3)', position: 'absolute', top: -12, left: -12 },
  readout: { width: '100%', backgroundColor: Colors.borderStrong, padding: Spacing.md, alignItems: 'center', borderTopWidth: 2, borderTopColor: 'rgba(255,255,255,0.1)' }
});