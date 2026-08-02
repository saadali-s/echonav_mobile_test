import { ApiClient } from './ApiClient';

export interface ResolvePositionResponse {
  node: {
    id: number;
    label: string;
    x: number;
    y: number;
    ttsVerbalGuidance: string;
  };
  floorPlanId: number;
  buildingId: number;
  privacyLevel: string;
}

export class NavigationAPI {
  static async resolvePosition(uuid: string, major: number, minor: number) {
    return ApiClient.post<ResolvePositionResponse>('/navigation/resolve', { uuid, major, minor });
  }

  static async getRoute(mapId: string, startNodeId: string, destinationNodeId: string) {
    return ApiClient.post<any>('/navigation/route', { 
      floorPlanId: parseInt(mapId), 
      startNodeId: parseInt(startNodeId), 
      endNodeId: parseInt(destinationNodeId) 
    });
  }
}