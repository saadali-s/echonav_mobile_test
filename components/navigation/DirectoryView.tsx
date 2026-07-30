import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { PanResponder, TouchableOpacity, Vibration, View } from "react-native";
import { AppScreen } from "../ui/AppScreen";
import { AppText } from "../ui/AppText";
import { AppButton } from "../ui/AppButton";

export function DirectoryView({
  currentNodeLabel,
  startNodeId,
  allNodes,
  directoryAudioMap,
  onClose,
  onSelectDestination,
}: any) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const soundRef = useRef<Audio.Sound | null>(null);
  const lastDy = useRef(0);
  const accumulatedDy = useRef(0);

  useEffect(() => {
    if (allNodes.length === 0) return;
    const timer = setTimeout(async () => {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const selectedNode = allNodes[selectedIndex];
      const audioUri = directoryAudioMap[String(selectedNode.id)];

      if (audioUri) {
        try {
          const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
          soundRef.current = sound;
          await sound.playAsync();
        } catch (e) {
          console.error("Dial TTS Error", e);
        }
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedIndex, allNodes, directoryAudioMap]);

  useEffect(() => {
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastDy.current = 0;
        accumulatedDy.current = 0;
      },
      onPanResponderMove: (_, gestureState) => {
        const delta = gestureState.dy - lastDy.current;
        lastDy.current = gestureState.dy;
        accumulatedDy.current += delta;

        if (accumulatedDy.current < -35) {
          setSelectedIndex((prev) => {
            const next = Math.min(prev + 1, allNodes.length - 1);
            if (next !== prev) Vibration.vibrate(10);
            return next;
          });
          accumulatedDy.current = 0;
        } else if (accumulatedDy.current > 35) {
          setSelectedIndex((prev) => {
            const prevIdx = Math.max(prev - 1, 0);
            if (prevIdx !== prev) Vibration.vibrate(10);
            return prevIdx;
          });
          accumulatedDy.current = 0;
        }
      },

      onPanResponderRelease: () => {},
    }),
  ).current;

  const handleConfirmRoute = () => {
    if (allNodes.length === 0) return;
    const selectedNode = allNodes[selectedIndex];

    if (String(selectedNode.id) === startNodeId) {
      Vibration.vibrate([0, 100, 50, 100]);
    } else {
      Vibration.vibrate(100);
      onSelectDestination(String(selectedNode.id));
    }
  };

  const renderRotaryItems = () => {
    return allNodes.map((node: any, i: number) => {
      const offset = i - selectedIndex;
      if (Math.abs(offset) > 3) return null;

      const isCenter = offset === 0;
      const isCurrentLocation = String(node.id) === startNodeId;

      return (
        <View
          key={node.id}
          className="absolute w-[85%] p-5 rounded-2xl items-center justify-center"
          style={{
            transform: [
              { translateY: offset * 80 },
              { scale: Math.max(0.6, 1 - Math.abs(offset) * 0.2) },
            ],
            opacity: Math.max(0.1, 1 - Math.abs(offset) * 0.4),
            borderColor: isCenter ? "#10b981" : "transparent",
            borderWidth: isCenter ? 2 : 0,
            backgroundColor: isCenter ? "rgba(128,128,128,0.1)" : "transparent",
          }}
        >
          <View className="items-center">
            <AppText
              variant={isCenter ? "displaySm" : "titleMd"}
              color={isCenter ? "success" : "primary"}
              center
            >
              {node.label || `Node ${node.id}`}
            </AppText>

            {isCurrentLocation && isCenter && (
              <AppText variant="caption" color="muted" className="mt-2">
                YOU ARE HERE
              </AppText>
            )}
          </View>
        </View>
      );
    });
  };

  return (
    <AppScreen padded={false} scrollable={false}>
      <View className="p-5 pt-[60px] bg-white dark:bg-[#111] border-b border-zinc-200 dark:border-[#333] z-10">
        <View className="flex-row justify-between items-center mb-3">
          <AppText variant="titleMd" color="primary">
            Directory Dial
          </AppText>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} className="text-zinc-400" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center gap-2">
          <Feather name="map-pin" size={16} className="text-emerald-500" />
          <AppText variant="bodySm" color="muted">
            Current Location:{" "}
            <AppText color="primary">{currentNodeLabel}</AppText>
          </AppText>
        </View>
      </View>

      <View
        className="flex-1 bg-zinc-50 dark:bg-black justify-center overflow-hidden"
        {...panResponder.panHandlers}
      >
        <View className="absolute top-8 w-full items-center z-10">
          <AppText variant="label" color="muted" center>
            SWIPE ANYWHERE TO SPIN DIAL
          </AppText>
        </View>

        <View className="h-[100px] justify-center items-center">
          {renderRotaryItems()}
        </View>
      </View>

      {}
      <View className="p-6 bg-white dark:bg-[#111] border-t border-zinc-200 dark:border-[#333]">
        <AppButton
          variant="primary"
          onPress={handleConfirmRoute}
          icon="navigation"
        >
          SET DESTINATION
        </AppButton>
      </View>
    </AppScreen>
  );
}
