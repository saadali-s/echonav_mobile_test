import { STATIC_AUDIO } from '@/core/constants/AudioDictionary';
import { TTS_BASE_URL } from '@/core/constants/Config';
import { useAppAlert } from '@/core/context/AlertContext';
import { useScanner } from '@/core/hooks/useScanner';
import { MapStudioAPI } from '@/core/services/MapStudioAPI';
import { NavigationAPI } from '@/core/services/NavigationAPI';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { useCallback, useEffect, useState } from 'react';
import { Vibration } from 'react-native';

export type NavState = 'IDLE' | 'NAVIGATING';

export function useNavigationController(startNodeId: string, floorPlanId: string) {
  const [navState, setNavState] = useState<NavState>('IDLE');
  const { showAlert } = useAppAlert();

  const [allNodes, setAllNodes] = useState<any[]>([]);
  const [currentNodeInfo, setCurrentNodeInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeRoute, setActiveRoute] = useState<any>(null);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  
  const [localAudioMap, setLocalAudioMap] = useState<Record<string, string>>({});
  const [directoryAudioMap, setDirectoryAudioMap] = useState<Record<string, string>>({});

  const activeTargetNode = activeRoute ? activeRoute.path[currentTargetIndex] : null;
  const currentTargetBaseline = activeTargetNode?.rssiBaseline != null ? activeTargetNode.rssiBaseline : -65;
  const targetManeuver = activeTargetNode?.maneuverCode || null;
  const currentAudioUri = activeTargetNode ? localAudioMap[String(activeTargetNode.id)] || null : null;
  const currentTargetUuid = activeTargetNode?.uuid || null;

  const handleCancelRoute = useCallback(() => {
    setActiveRoute(null);
    setCurrentTargetIndex(0);
    setNavState('IDLE');
  }, []);

  const handleWaypointReached = useCallback(() => {
    if (!activeRoute) return;
    
    if (currentTargetIndex >= activeRoute.path.length - 1) {
        showAlert("Route Complete", "You have successfully arrived at your destination.", "success", "FINISH", handleCancelRoute);
    } else {
        console.log(`[Navigation] Waypoint Reached. Advancing to index ${currentTargetIndex + 1}`);
        setCurrentTargetIndex(prev => prev + 1);
    }
  }, [activeRoute, currentTargetIndex, handleCancelRoute, showAlert]);

  const { 
      isScanning, distance, startScanning, stopScanning, steps, triggerAudio,
      isSpinning, hasTurnedAround, clearTurnWarning
  } = useScanner(
      currentTargetBaseline, 
      currentAudioUri, 
      targetManeuver, 
      currentTargetUuid, 
      handleWaypointReached
  );

  useEffect(() => {
    if (hasTurnedAround && navState === 'NAVIGATING') {
        console.warn("[Fail-Safe] 180-Degree turn detected. Warning user.");
        Vibration.vibrate([0, 500, 200, 500, 200, 500]); 
        showAlert(
            "Direction Reversal",
            "You have turned around. Proceed straight to return to your route, or cancel to recalculate.",
            "warning",
            "I UNDERSTAND",
            clearTurnWarning
        );
    }
  }, [hasTurnedAround, navState, clearTurnWarning, showAlert]);

  useEffect(() => {
    if (navState === 'IDLE' && isScanning) {
        stopScanning();
    }
  }, [navState, isScanning, stopScanning]);

  const prefetchDirectoryAudio = async (nodes: any[]) => {
    const newAudioMap: Record<string, string> = {};
    const fs: any = FileSystem; 
    
    for (const node of nodes) {
      if (node.ttsAudioUrl) {
        const remoteUrl = `${TTS_BASE_URL}${node.ttsAudioUrl}`;
        const localUri = `${fs.documentDirectory}dir_node_${node.id}.wav`;
        try {
          const fileInfo = await fs.getInfoAsync(localUri);
          if (!fileInfo.exists) {
            const downloadRes = await fs.downloadAsync(remoteUrl, localUri);
            if (downloadRes.status === 200) newAudioMap[String(node.id)] = localUri;
          } else {
            newAudioMap[String(node.id)] = localUri;
          }
        } catch (error) {
          console.warn(`Failed to cache directory audio for node ${node.id}`);
        }
      }
    }
    setDirectoryAudioMap(newAudioMap);
  };

  useEffect(() => {
    const fetchMapData = async () => {
      if (!floorPlanId || !startNodeId) return;
      try {
        const graph = await MapStudioAPI.getSpatialGraph(floorPlanId);
        const validNodes = graph.nodes.filter((n: any) => !n.isHazard);
        
        await prefetchDirectoryAudio(validNodes);
        
        setAllNodes(validNodes);
        const startNode = validNodes.find((n: any) => String(n.id) === String(startNodeId));
        if (startNode) setCurrentNodeInfo(startNode);
      } catch (e) {
        console.error("Failed to load map graph", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMapData();
  }, [floorPlanId, startNodeId]);

  const prefetchRouteAudio = async (pathNodes: any[]) => {
    const newAudioMap: Record<string, string> = {};
    const fs: any = FileSystem; 
    
    for (const node of pathNodes) {
      if (node.ttsAudioUrl) {
        const remoteUrl = `${TTS_BASE_URL}${node.ttsAudioUrl}`;
        const localUri = `${fs.documentDirectory}node_${node.id}.wav`;
        try {
          const fileInfo = await fs.getInfoAsync(localUri);
          if (!fileInfo.exists) {
            const downloadRes = await fs.downloadAsync(remoteUrl, localUri);
            if (downloadRes.status === 200) newAudioMap[String(node.id)] = localUri;
          } else {
            newAudioMap[String(node.id)] = localUri;
          }
        } catch (error) {}
      }
    }
    setLocalAudioMap(prev => ({ ...prev, ...newAudioMap }));
    return newAudioMap;
  };

  const playInitialAudio = async (maneuver: string | null, uri: string | null) => {
    try {
      if (maneuver && maneuver in STATIC_AUDIO) {
        const safeManeuver = maneuver as keyof typeof STATIC_AUDIO;
        const { sound: mSound } = await Audio.Sound.createAsync(STATIC_AUDIO[safeManeuver]);
        await mSound.playAsync();
        await new Promise<void>((resolve) => {
          mSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              mSound.unloadAsync();
              resolve();
            } else if (!status.isLoaded && (status as any).error) {
              resolve();
            }
          });
        });
      }
      if (uri) {
        const { sound: tSound } = await Audio.Sound.createAsync({ uri });
        await tSound.playAsync();
        await new Promise<void>((resolve) => {
          tSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              tSound.unloadAsync();
              resolve();
            } else if (!status.isLoaded && (status as any).error) {
              resolve();
            }
          });
        });
      }
    } catch (e) {
      console.error("Initial audio failed", e);
    }
  };

  const handleSelectDestination = async (destinationNodeId: string) => {
    if (String(destinationNodeId) === String(startNodeId)) {
        Vibration.vibrate([0, 100, 50, 100]); 
        return; 
    }

    Vibration.vibrate(100);
    setIsLoading(true);
    try {
      const routeResponse = await NavigationAPI.getRoute(floorPlanId, startNodeId, destinationNodeId);
      
      if (routeResponse.status === "SUCCESS" && routeResponse.path && routeResponse.path.length > 0) {
         setActiveRoute(routeResponse);
         setCurrentTargetIndex(1); 
         
         const updatedAudioMap = await prefetchRouteAudio(routeResponse.path);
         
         setNavState('NAVIGATING');
         
         try {
            await startScanning();
         } catch (err: any) {
            showAlert('HARDWARE ERROR', err.message, 'error');
         }

         const startNode = routeResponse.path[0];
         const initialUri = updatedAudioMap[String(startNode.id)] || null;
         playInitialAudio(startNode.maneuverCode, initialUri);

      } else {
         console.warn("Pathfinder failed to route.");
         Vibration.vibrate([0, 200, 100, 200]);
         showAlert("Route Unavailable", "No valid path exists to this destination. The route may be blocked by hazards.", "error");
      }
    } catch (e: any) {
      console.error("Routing Error", e);
      Vibration.vibrate([0, 200, 100, 200]);
      showAlert("Network Error", e.message || "Failed to calculate the route. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    navState,
    isLoading,
    allNodes,
    currentNodeInfo,
    activeRoute,
    currentTargetIndex,
    isScanning,
    distance,
    isSpinning,
    triggerAudio,
    handleSelectDestination,
    handleCancelRoute,
    directoryAudioMap 
  };
}