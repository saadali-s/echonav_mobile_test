import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { AppText } from '../ui/AppText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CANVAS_SIZE = 3000; // Increased size for a massive exploration area
const GRID_STEP = 100;

interface FloorPlanCanvasProps {
  mapId: string;
}

export function FloorPlanCanvas({ mapId }: FloorPlanCanvasProps) {
  // 1. Zoom State (Controlled by the sleek buttons)
  const [zoomScale, setZoomScale] = useState(1);

  // 2. Pan Engine (Native physics for buttery smooth dragging)
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // When dragging starts, extract the current offset so it doesn't snap back to 0
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false } // layout animations don't support native driver on all RN versions
      ),
      onPanResponderRelease: () => {
        // Flatten the offset so the next drag starts from the correct position
        pan.flattenOffset();
      }
    })
  ).current;

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.25, 0.5));

  const gridLines = Array.from({ length: Math.floor(CANVAS_SIZE / GRID_STEP) + 1 });

  return (
    <View style={styles.wrapper}>
      
      {/* Top Left: Legend */}
      <View style={styles.floatingLegend}>
        <AppText variant="titleSm" color="inverse">MODE: VECTOR_INSPECTION</AppText>
        <AppText variant="caption" color="muted">ID_REF: {mapId} | CALIBRATED: YES</AppText>
      </View>

      {/* Top Right: Sleek Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomBtn} activeOpacity={0.7} onPress={handleZoomIn}>
          <Feather name="zoom-in" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.zoomDivider} />
        <TouchableOpacity style={styles.zoomBtn} activeOpacity={0.7} onPress={handleZoomOut}>
          <Feather name="zoom-out" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* The Robust Interactive Viewport */}
      <View style={styles.viewport} {...panResponder.panHandlers}>
        <Animated.View 
          style={[
            styles.mapCanvas, 
            { 
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale: zoomScale }
              ] 
            }
          ]}
        >
          {/* Dynamic Measurement Grid */}
          {gridLines.map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <View style={[styles.gridLineV, { left: i * GRID_STEP }]} />
              <View style={[styles.gridLineH, { top: i * GRID_STEP }]} />
            </React.Fragment>
          ))}

          {/* Blueprint Geometry */}
          <View style={[styles.room, { top: CANVAS_SIZE/2 - 200, left: CANVAS_SIZE/2 - 300, width: 600, height: 400 }]}>
            <AppText variant="displaySm" color="muted">MAIN LOBBY</AppText>
          </View>
          <View style={[styles.room, { top: CANVAS_SIZE/2 + 200, left: CANVAS_SIZE/2 - 100, width: 200, height: 500 }]}>
            <AppText variant="titleSm" color="muted" style={{ transform: [{ rotate: '90deg' }], width: 200, textAlign: 'center' }}>CORRIDOR A</AppText>
          </View>

          {/* Hardware Nodes */}
          <View style={[styles.vectorNode, { top: CANVAS_SIZE/2, left: CANVAS_SIZE/2 }]}><AppText variant="caption" color="inverse">B-101</AppText></View>
          <View style={[styles.vectorNode, { top: CANVAS_SIZE/2 + 450, left: CANVAS_SIZE/2 }]}><AppText variant="caption" color="inverse">B-102</AppText></View>

          <AppText variant="displayLg" color="muted" style={styles.watermark}>
            CANVAS_AREA_{mapId}
          </AppText>

        </Animated.View>
      </View>

      {/* Bottom Tool Bar */}
      <View style={styles.bottomBar}>
         <AppText variant="caption" color="inverse">Drag to Pan • Use icons to zoom</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Wrapper forces the component to take 100% of the available space
  wrapper: { flex: 1, backgroundColor: '#111', overflow: 'hidden' },
  
  // The viewport acts as the window we look through
  viewport: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // The actual massive canvas that moves around inside the viewport
  mapCanvas: { 
    width: CANVAS_SIZE, 
    height: CANVAS_SIZE, 
    position: 'absolute', 
    backgroundColor: '#111', 
  },

  floatingLegend: {
    position: 'absolute', top: Spacing.xxl, left: Spacing.lg, zIndex: 100, 
    backgroundColor: 'rgba(0,0,0,0.8)', padding: Spacing.md, 
    borderRadius: 8, borderWidth: 1, borderColor: '#333'
  },
  zoomControls: {
    position: 'absolute', top: Spacing.xxl, right: Spacing.lg, zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 12, 
    borderWidth: 1, borderColor: '#333', overflow: 'hidden'
  },
  zoomBtn: { padding: Spacing.md, alignItems: 'center', justifyContent: 'center' },
  zoomDivider: { height: 1, backgroundColor: '#333', width: '100%' },
  
  gridLineV: { position: 'absolute', top: 0, width: 1, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.07)' },
  gridLineH: { position: 'absolute', left: 0, width: '100%', height: 1, backgroundColor: 'rgba(255, 255, 255, 0.07)' },
  room: { position: 'absolute', borderWidth: 4, borderColor: '#333', backgroundColor: 'rgba(255, 255, 255, 0.02)', justifyContent: 'center', alignItems: 'center' },
  
  vectorNode: { 
    position: 'absolute', width: 48, height: 48, backgroundColor: Colors.activeGreen, 
    borderRadius: 24, borderWidth: 3, borderColor: Colors.black, justifyContent: 'center', 
    alignItems: 'center', shadowColor: Colors.activeGreen, shadowRadius: 12, shadowOpacity: 0.6, elevation: 5, zIndex: 50
  },
  watermark: { opacity: 0.03, transform: [{ rotate: '-45deg' }], fontSize: 120, position: 'absolute', zIndex: -1, top: '40%', left: '30%' },
  
  bottomBar: { 
    position: 'absolute', bottom: Spacing.xl, alignSelf: 'center', 
    backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: Spacing.xl, 
    paddingVertical: Spacing.sm, borderRadius: 999, borderWidth: 1, borderColor: '#333' 
  }
});