import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors, Spacing } from '../../constants/theme';
import { ApiClient } from '../../services/ApiClient';
import { MapStudioAPI } from '../../services/MapStudioAPI';
import { AppText } from '../ui/AppText';

const CANVAS_SIZE = 3000;
const GRID_STEP = 100;

interface FloorPlanCanvasProps {
  mapId: string;
}

export function FloorPlanCanvas({ mapId }: FloorPlanCanvasProps) {
  const [zoomScale, setZoomScale] = useState(1);
  const [graphData, setGraphData] = useState<any>(null);
  const [injectedHtml, setInjectedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { pan.extractOffset(); },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => { pan.flattenOffset(); }
    })
  ).current;

  // THE FIX: Fetch SVG string directly to bypass Android WebView Cleartext restrictions
  useEffect(() => {
    const fetchGraphAndMap = async () => {
      try {
        const data = await MapStudioAPI.getSpatialGraph(mapId);
        setGraphData(data);

        if (data?.floorPlan?.floorPlanUrl) {
          // Strip the duplicated "/api" prefix so ApiClient formats it correctly
          const cleanEndpoint = data.floorPlan.floorPlanUrl.replace('/api', '');
          
          // Fetch raw SVG text
          const svgString = await ApiClient.get<string>(cleanEndpoint);
          
          // Inject into a perfectly scaled HTML shell
          setInjectedHtml(`
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { margin: 0; padding: 0; background-color: transparent; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
                  svg, img { width: 100%; height: 100%; object-fit: contain; }
                </style>
              </head>
              <body>
                ${svgString}
              </body>
            </html>
          `);
        }
      } catch (error) {
        console.error("Failed to fetch graph data or map asset", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGraphAndMap();
  }, [mapId]);

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.25, 0.5));

  const gridLines = Array.from({ length: Math.floor(CANVAS_SIZE / GRID_STEP) + 1 });

  if (isLoading) {
    return (
      <View style={[styles.wrapper, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.white} />
        <AppText variant="caption" color="muted" style={{ marginTop: 12 }}>LOADING VECTOR DATA...</AppText>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.floatingLegend}>
        <AppText variant="titleSm" color="inverse">MODE: VECTOR_INSPECTION</AppText>
        <AppText variant="caption" color="muted">ID_REF: {mapId} | NODES: {graphData?.nodes?.length || 0}</AppText>
      </View>

      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomBtn} activeOpacity={0.7} onPress={handleZoomIn}>
          <Feather name="zoom-in" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.zoomDivider} />
        <TouchableOpacity style={styles.zoomBtn} activeOpacity={0.7} onPress={handleZoomOut}>
          <Feather name="zoom-out" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.viewport} {...panResponder.panHandlers}>
        <Animated.View style={[styles.mapCanvas, { transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: zoomScale }] }]}>
          {gridLines.map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <View style={[styles.gridLineV, { left: i * GRID_STEP }]} />
              <View style={[styles.gridLineH, { top: i * GRID_STEP }]} />
            </React.Fragment>
          ))}

          {/* Inject dynamic HTML directly into the WebView */}
          {injectedHtml && (
            <View pointerEvents="none" style={styles.svgBackground}>
              <WebView 
                originWhitelist={['*']}
                source={{ html: injectedHtml }} 
                style={{ backgroundColor: 'transparent' }} 
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Spatial Nodes Overlay */}
          {graphData?.nodes?.map((node: any) => (
            <View 
              key={node.id} 
              style={[styles.vectorNode, { left: node.x - 24, top: node.y - 24, borderColor: node.isHazard ? Colors.dangerText : Colors.black, backgroundColor: node.isHazard ? Colors.dangerBg : Colors.activeGreen }]}
            >
              <AppText variant="caption" color={node.isHazard ? "danger" : "inverse"} style={{ fontSize: 9 }}>
                {node.label || `N-${node.id}`}
              </AppText>
            </View>
          ))}
        </Animated.View>
      </View>

      <View style={styles.bottomBar}>
         <AppText variant="caption" color="inverse">Drag to Pan • Use icons to zoom</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#111', overflow: 'hidden' },
  viewport: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapCanvas: { width: CANVAS_SIZE, height: CANVAS_SIZE, position: 'absolute', backgroundColor: '#111' },
  svgBackground: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.8 },
  floatingLegend: { position: 'absolute', top: Spacing.xxl, left: Spacing.lg, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', padding: Spacing.md, borderRadius: 8, borderWidth: 1, borderColor: '#333' },
  zoomControls: { position: 'absolute', top: Spacing.xxl, right: Spacing.lg, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 12, borderWidth: 1, borderColor: '#333', overflow: 'hidden' },
  zoomBtn: { padding: Spacing.md, alignItems: 'center', justifyContent: 'center' },
  zoomDivider: { height: 1, backgroundColor: '#333', width: '100%' },
  gridLineV: { position: 'absolute', top: 0, width: 1, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.07)' },
  gridLineH: { position: 'absolute', left: 0, width: '100%', height: 1, backgroundColor: 'rgba(255, 255, 255, 0.07)' },
  vectorNode: { position: 'absolute', width: 48, height: 48, borderRadius: 24, borderWidth: 3, justifyContent: 'center', alignItems: 'center', elevation: 5, zIndex: 50 },
  bottomBar: { position: 'absolute', bottom: Spacing.xl, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, borderRadius: 999, borderWidth: 1, borderColor: '#333' }
});