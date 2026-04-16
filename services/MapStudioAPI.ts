import { ApiClient } from './ApiClient';

export class MapStudioAPI {
  // Shared: Gets buildings (Mobile uses ?public=true)
  static async getBuildings(isPublic: boolean = false) {
    return ApiClient.get<any[]>(`/buildings?public=${isPublic}`);
  }

  // Admin: Setting the physical scale ruler
  static async saveMapScale(mapId: string, scaleMetersPerPixel: number) {
    return ApiClient.post<any>(`/maps/${mapId}/scale`, { scaleMetersPerPixel });
  }

  // Admin: Saving the Figma-style nodes/edges
  static async saveGraph(mapId: string, payload: { nodes: any[], edges: any[] }) {
    return ApiClient.put<any>(`/maps/${mapId}/graph`, payload);
  }

  // Admin: Converting the graph to an .echomap bundle
  static async publishMap(mapId: string) {
    return ApiClient.post<any>(`/maps/${mapId}/publish`, {});
  }
}