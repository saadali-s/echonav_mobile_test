import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";
import { ApiClient } from "../../core/services/ApiClient";
import { MapStudioAPI } from "../../core/services/MapStudioAPI";
import { AppText } from "../ui/AppText";

const CANVAS_SIZE = 3000;

interface FloorPlanCanvasProps {
  mapId: string;
}

export function FloorPlanCanvas({ mapId }: FloorPlanCanvasProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [graphData, setGraphData] = useState<any>(null);
  const [injectedHtml, setInjectedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGraphAndMap = async () => {
      try {
        const data = await MapStudioAPI.getSpatialGraph(mapId);
        setGraphData(data);

        if (data?.floorPlan?.floorPlanUrl) {
          const cleanEndpoint = data.floorPlan.floorPlanUrl.replace("/api", "");
          const svgString = await ApiClient.get<string>(cleanEndpoint);

          const bgColor = isDark ? "#111111" : "#f4f4f5";
          const gridColor = isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)";

          const nodesHtml =
            data.nodes
              ?.map((node: any) => {
                const isHazard = node.isHazard;
                const label = node.label || `N-${node.id}`;
                const bgClass = isHazard ? "#fee2e2" : "#10b981";
                const borderClass = isHazard ? "#dc2626" : "#000000";
                const textCol = isHazard ? "#dc2626" : "#ffffff";

                return `
              <div class="node" style="left: ${node.x - 24}px; top: ${node.y - 24}px; background-color: ${bgClass}; border-color: ${borderClass}; color: ${textCol};">
                ${label}
              </div>
            `;
              })
              .join("") || "";

          setInjectedHtml(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=3.0, minimum-scale=0.1, user-scalable=yes">
                <style>
                  body, html { 
                    margin: 0; 
                    padding: 0; 
                    background-color: ${bgColor}; 
                  }
                  #canvas-wrapper {
                    width: ${CANVAS_SIZE}px;
                    height: ${CANVAS_SIZE}px;
                    position: relative;
                    background-size: 100px 100px;
                    background-image: 
                      linear-gradient(to right, ${gridColor} 1px, transparent 1px),
                      linear-gradient(to bottom, ${gridColor} 1px, transparent 1px);
                  }
                  .map-layer {
                    width: 100%; 
                    height: 100%; 
                    position: absolute;
                    top: 0;
                    left: 0;
                    opacity: 0.8;
                    pointer-events: none;
                  }
                  svg, img { width: 100%; height: 100%; object-fit: contain; }
                  .node {
                    position: absolute;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    border: 3px solid;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: sans-serif;
                    font-size: 11px;
                    font-weight: 900;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                  }
                </style>
              </head>
              <body>
                <div id="canvas-wrapper">
                  <div class="map-layer">
                    ${svgString}
                  </div>
                  ${nodesHtml}
                </div>
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
  }, [mapId, isDark]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-zinc-100 dark:bg-[#111] justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
        <AppText variant="caption" color="muted" className="mt-3">
          LOADING VECTOR DATA...
        </AppText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-100 dark:bg-[#111]">
      <View
        pointerEvents="none"
        className="absolute top-5 left-4 z-50 bg-white/90 dark:bg-black/80 p-3 rounded-lg border-2 border-zinc-300 dark:border-[#333]"
      >
        <AppText variant="titleSm" color="primary">
          MODE: VECTOR_INSPECTION
        </AppText>
        <AppText variant="caption" color="muted">
          ID_REF: {mapId} | NODES: {graphData?.nodes?.length || 0}
        </AppText>
      </View>

      {injectedHtml && (
        <WebView
          originWhitelist={["*"]}
          source={{ html: injectedHtml }}
          style={{ backgroundColor: "transparent", flex: 1 }}
          scrollEnabled={true}
          scalesPageToFit={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View
        pointerEvents="none"
        className="absolute bottom-10 self-center bg-white/90 dark:bg-black/80 px-5 py-2 rounded-full border-2 border-zinc-300 dark:border-[#333] shadow-md"
      >
        <AppText variant="caption" color="primary">
          Pinch to Zoom • Drag to Pan
        </AppText>
      </View>
    </View>
  );
}
