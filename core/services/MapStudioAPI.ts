import { ApiClient } from './ApiClient';

export class MapStudioAPI {
  // Shared: Gets private buildings for an organization
  static async getBuildings(orgId: string) {
    return ApiClient.get<any[]>(`/mapstudio/organisations/${orgId}/buildings`);
  }

  // Shared: Gets public buildings
  static async getPublicBuildings() {
    return ApiClient.get<any[]>('/mapstudio/buildings/public');
  }

  // Shared: Gets specific floor plans for a building
  static async getFloorPlans(buildingId: string) {
    return ApiClient.get<any[]>(`/mapstudio/buildings/${buildingId}/floorplans`);
  }

  // THE FIX: Added the missing fetcher for the spatial graph
  static async getSpatialGraph(floorPlanId: string) {
    return ApiClient.get<any>(`/mapstudio/floorplans/${floorPlanId}/graph`);
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