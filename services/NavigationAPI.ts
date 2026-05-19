import { ApiClient } from './ApiClient';

export class NavigationAPI {
  // THE FIX: Realigned properties to match the strict Backend RouteRequest contract layout exactly
  static async getRoute(mapId: string, startNodeId: string, destinationNodeId: string) {
    return ApiClient.post<any>('/navigation/route', { 
      floorPlanId: parseInt(mapId), 
      startNodeId: parseInt(startNodeId), 
      endNodeId: parseInt(destinationNodeId) 
    });
  }
}