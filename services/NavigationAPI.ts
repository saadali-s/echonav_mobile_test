import { ApiClient } from './ApiClient';

export class NavigationAPI {
  // Mobile: Triggering the pre-flight Dijkstra path calculation
  static async getRoute(mapId: string, startNodeId: string, destinationNodeId: string) {
    return ApiClient.post<any>('/navigation/route', { mapId, startNodeId, destinationNodeId });
  }
}