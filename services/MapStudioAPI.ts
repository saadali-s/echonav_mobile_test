import { ApiClient } from './ApiClient';

export class MapStudioAPI {
  // Shared: Gets private buildings for an organization
  static async getBuildings(orgId: string) {
    return ApiClient.get<any[]>(`/mapstudio/organisations/${orgId}/buildings`);
  }

  // --- ISSUE 1 FIX: New Public Fetcher ---
  static async getPublicBuildings() {
    return ApiClient.get<any[]>('/mapstudio/buildings/public');
  }

  // --- THE RESTORED MISSING METHOD ---
  // Shared: Gets specific floor plans for a building
  static async getFloorPlans(buildingId: string) {
    return ApiClient.get<any[]>(`/mapstudio/buildings/${buildingId}/floorplans`);
  }

  // Admin: Setting the physical scale ruler
  static async saveMapScale(mapId: string, scaleMetersPerPixel: number) {
    return ApiClient.put<any>(`/mapstudio/floorplans/${mapId}`, { scale: scaleMetersPerPixel });
  }

  // Admin: Saving the Figma-style nodes/edges
  static async saveGraph(mapId: string, payload: { nodes: any[], edges: any[] }) {
    return ApiClient.put<any>(`/mapstudio/floorplans/${mapId}/graph`, payload);
  }
}