import { ApiClient } from './ApiClient';

export class NavigationAPI {
  // THE FIX: Exposed the strict 3-Part hardware signature resolution endpoint
  static async resolvePosition(uuid: string, major: number, minor: number) {
    return ApiClient.post<any>('/navigation/resolve', { uuid, major, minor });
  }

  static async getRoute(mapId: string, startNodeId: string, destinationNodeId: string) {
    return ApiClient.post<any>('/navigation/route', { 
      floorPlanId: parseInt(mapId), 
      startNodeId: parseInt(startNodeId), 
      endNodeId: parseInt(destinationNodeId) 
    });
  }
}