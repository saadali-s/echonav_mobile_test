import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { Colors, Spacing } from '../../../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function VectorMapView() {
  const { id } = useLocalSearchParams();

  return (
    <AppScreen padded={false} dark>
      {/* Legend / Status Overlay */}
      <View style={styles.floatingLegend}>
        <AppText variant="titleSm" color="inverse">MODE: VECTOR_INSPECTION</AppText>
        <AppText variant="caption" color="muted">ID_REF: {id} | CALIBRATED: YES</AppText>
      </View>

      <ScrollView 
        horizontal 
        maximumZoomScale={3} 
        minimumZoomScale={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.canvasContainer}
      >
        <ScrollView 
          nestedScrollEnabled 
          showsVerticalScrollIndicator={false}
        >
          {/* THE "FIGMA" CANVAS */}
          <View style={styles.mapCanvas}>
            {/* Placeholder for the actual SVG logic later */}
            <View style={styles.gridPattern} />
            
            <View style={styles.vectorNode}>
              <AppText variant="caption" color="inverse">B-102</AppText>
            </View>
            
            <View style={[styles.vectorNode, { top: 300, left: 450 }]}>
              <AppText variant="caption" color="inverse">B-103</AppText>
            </View>

            <AppText variant="displayLg" color="muted" style={styles.watermark}>
              FLOOR_PLAN_REF_{id}
            </AppText>
          </View>
        </ScrollView>
      </ScrollView>

      {/* Bottom Tool Bar */}
      <View style={styles.bottomBar}>
         <AppText variant="label" color="inverse">Pinch to Zoom | Drag to Pan</AppText>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  floatingLegend: {
    position: 'absolute', top: Spacing.lg, left: Spacing.lg,
    zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)',
    padding: Spacing.md, borderRadius: 8, borderWidth: 1, borderColor: '#333'
  },
  canvasContainer: {
    backgroundColor: '#111',
    minWidth: SCREEN_WIDTH * 2,
    minHeight: SCREEN_HEIGHT,
  },
  mapCanvas: {
    width: 1200, height: 1200,
    backgroundColor: '#1a1a1a',
    position: 'relative',
    justifyContent: 'center', alignItems: 'center'
  },
  gridPattern: {
    position: 'absolute', width: '100%', height: '100%',
    opacity: 0.1, borderLeftWidth: 1, borderTopWidth: 1, borderColor: '#FFF'
  },
  vectorNode: {
    position: 'absolute', top: 200, left: 200,
    width: 40, height: 40, backgroundColor: Colors.activeGreen,
    borderRadius: 20, borderWidth: 2, borderColor: Colors.white,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.activeGreen, shadowRadius: 10, shadowOpacity: 1, elevation: 10
  },
  watermark: { opacity: 0.05, transform: [{ rotate: '-45deg' }] },
  bottomBar: {
    position: 'absolute', bottom: 0, width: '100%',
    backgroundColor: Colors.black, padding: Spacing.lg,
    alignItems: 'center', borderTopWidth: 2, borderTopColor: '#333'
  }
});