import { STATIC_AUDIO } from '@/core/constants/AudioDictionary';
import { TTS_BASE_URL } from '@/core/constants/Config';
import { useAppAlert } from '@/core/context/AlertContext';
import { useScanner } from '@/core/hooks/useScanner';
import { MapStudioAPI } from '@/core/services/MapStudioAPI';
import { NavigationAPI } from '@/core/services/NavigationAPI';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { useCallback, useEffect, useState, useRef } from 'react';
import { Vibration } from 'react-native';

export type NavState = 'IDLE' | 'NAVIGATING';

export function useNavigationController(initialStartNodeId: string, floorPlanId: string) {
  const [navState, setNavState] = useState<NavState>('IDLE');
  const { showAlert } = useAppAlert();

  const [allNodes, setAllNodes] = useState<any[]>([]);
  const [currentNodeInfo, setCurrentNodeInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeStartNodeId, setActiveStartNodeId] = useState<string>(initialStartNodeId);
  const [activeRoute, setActiveRoute] = useState<any>(null);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  
  const [localAudioMap, setLocalAudioMap] = useState<Record<string, string>>({});
  const [directoryAudioMap, setDirectoryAudioMap] = useState<Record<string, string>>({});

  const routeStartTimeRef = useRef<number>(0);

  const activeTargetNode = activeRoute ? activeRoute.path[currentTargetIndex] : null;
  const currentTargetBaseline = activeTargetNode?.rssiBaseline != null ? activeTargetNode.rssiBaseline : -65;
  const targetManeuver = activeTargetNode?.maneuverCode || null;
  const currentAudioUri = activeTargetNode ? localAudioMap[String(activeTargetNode.id)] || null : null;
  const currentTargetUuid = activeTargetNode?.uuid || null;
  
  const backendRouteDistance = activeRoute ? activeRoute.totalDistanceMeters : null;

  const handleCancelRoute = useCallback(() => {
    setActiveRoute(null);
    setCurrentTargetIndex(0);
    setNavState('IDLE');
  }, []);

  const handleWaypointReached = useCallback(() => {
    if (!activeRoute) return;
    
    if (currentTargetIndex >= activeRoute.path.length - 1) {
        const finalNodeId = String(activeRoute.path[currentTargetIndex].id);
        console.log(`\n[Navigation] DESTINATION REACHED. Location state updated to Node ${finalNodeId}.`);
        setActiveStartNodeId(finalNodeId);
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
      backendRouteDistance,
      handleWaypointReached
  );

  useEffect(() => {
    if (hasTurnedAround && navState === 'NAVIGATING') {
        const timeSinceRouteStart = Date.now() - routeStartTimeRef.current;
        if (timeSinceRouteStart < 5000) {
             console.log(`[Navigation] 180° Turn suppressed during initial 5s Grace Period.`);
             clearTurnWarning();
        } else {
            console.warn("[Navigation] Direction reversal detected outside grace period.");
            Vibration.vibrate([0, 500, 200, 500, 200, 500]); 
            showAlert(
                "Direction Reversal",
                "You have turned around. Proceed straight to return to your route, or cancel to recalculate.",
                "warning",
                "I UNDERSTAND",
                clearTurnWarning
            );
        }
    }
  }, [hasTurnedAround, navState, clearTurnWarning, showAlert]);

  useEffect(() => {
    if (navState === 'IDLE' && isScanning) stopScanning();
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
            const res = await fs.downloadAsync(remoteUrl, localUri);
            if (res.status === 200) newAudioMap[String(node.id)] = localUri;
          } else {
            newAudioMap[String(node.id)] = localUri;
          }
        } catch (error) {}
      }
    }
    setDirectoryAudioMap(newAudioMap);
  };

  useEffect(() => {
    const fetchMapData = async () => {
      if (!floorPlanId) return;
      try {
        const graph = await MapStudioAPI.getSpatialGraph(floorPlanId);
        const validNodes = graph.nodes.filter((n: any) => !n.isHazard);
        await prefetchDirectoryAudio(validNodes);
        setAllNodes(validNodes);
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    fetchMapData();
  }, [floorPlanId]);

  useEffect(() => {
    if (allNodes.length > 0) {
        const startNode = allNodes.find((n: any) => String(n.id) === String(activeStartNodeId));
        if (startNode) setCurrentNodeInfo(startNode);
    }
  }, [activeStartNodeId, allNodes]);

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
            const res = await fs.downloadAsync(remoteUrl, localUri);
            if (res.status === 200) newAudioMap[String(node.id)] = localUri;
          } else { newAudioMap[String(node.id)] = localUri; }
        } catch (error) {}
      }
    }
    setLocalAudioMap(prev => ({ ...prev, ...newAudioMap }));
    return newAudioMap;
  };

  const playInitialAudio = async (maneuver: string | null, uri: string | null) => {
    try {
      if (maneuver && maneuver in STATIC_AUDIO) {
        const sm = maneuver as keyof typeof STATIC_AUDIO;
        const { sound: mSound } = await Audio.Sound.createAsync(STATIC_AUDIO[sm]);
        await mSound.playAsync();
        await new Promise<void>((r) => mSound.setOnPlaybackStatusUpdate((s: any) => { if (s.didJustFinish || s.error) r(); }));
      }
      if (uri) {
        const { sound: tSound } = await Audio.Sound.createAsync({ uri });
        await tSound.playAsync();
        await new Promise<void>((r) => tSound.setOnPlaybackStatusUpdate((s: any) => { if (s.didJustFinish || s.error) r(); }));
      }
    } catch (e) {}
  };

  const handleSelectDestination = async (destinationNodeId: string) => {
    console.log(`\n[ROUTING EXECUTED] Route requested: Start Node ${activeStartNodeId} -> Target Node ${destinationNodeId}`);

    if (String(destinationNodeId) === String(activeStartNodeId)) {
        console.log(`[ANTI-LOOP] Selection matches current node (${activeStartNodeId}). Aborting.`);
        Vibration.vibrate([0, 100, 50, 100]); 
        return; 
    }

    Vibration.vibrate(100);
    setIsLoading(true);
    try {
      const routeResponse = await NavigationAPI.getRoute(floorPlanId, activeStartNodeId, destinationNodeId);
      
      if (routeResponse.status === "HARDWARE_NOT_DEPLOYED") {
         Vibration.vibrate([0, 200, 100, 200]);
         showAlert("Beacon Unlinked", "The beacon at this destination has not been deployed or scanned by staff yet.", "warning");
         return;
      }

      console.log(`[API RESPONSE] Status: ${routeResponse.status}, Total Distance: ${routeResponse.totalDistanceMeters}m`);
      
      if (routeResponse.status === "SUCCESS" && routeResponse.path && routeResponse.path.length > 0) {
         setActiveRoute(routeResponse);
         setCurrentTargetIndex(1); 
         
         const updatedAudioMap = await prefetchRouteAudio(routeResponse.path);
         
         setNavState('NAVIGATING');
         routeStartTimeRef.current = Date.now(); 
         
         try { await startScanning(); } catch (err: any) { showAlert('HARDWARE ERROR', err.message, 'error'); }

         const startNode = routeResponse.path[0];
         playInitialAudio(startNode.maneuverCode, updatedAudioMap[String(startNode.id)] || null);
      } else {
         Vibration.vibrate([0, 200, 100, 200]);
         showAlert("Route Unavailable", "No valid path exists to this destination.", "error");
      }
    } catch (e: any) {
      Vibration.vibrate([0, 200, 100, 200]);
      showAlert("Network Error", e.message || "Failed to calculate the route.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    navState, isLoading, allNodes, currentNodeInfo, activeRoute, currentTargetIndex,
    isScanning, distance, isSpinning, triggerAudio, handleSelectDestination,
    handleCancelRoute, directoryAudioMap, activeStartNodeId 
  };
}