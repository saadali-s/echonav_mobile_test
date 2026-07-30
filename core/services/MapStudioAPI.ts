import { ApiClient } from "./ApiClient";

export class MapStudioAPI {
  static async getBuildings(orgId: string) {
    return ApiClient.get<any[]>(`/mapstudio/organisations/${orgId}/buildings`);
  }

  static async getPublicBuildings() {
    return ApiClient.get<any[]>("/mapstudio/buildings/public");
  }

  static async getFloorPlans(buildingId: string) {
    return ApiClient.get<any[]>(
      `/mapstudio/buildings/${buildingId}/floorplans`,
    );
  }

  static async getSpatialGraph(floorPlanId: string) {
    return ApiClient.get<any>(`/mapstudio/floorplans/${floorPlanId}/graph`);
  }

  static async saveMapScale(mapId: string, scaleMetersPerPixel: number) {
    return ApiClient.put<any>(`/mapstudio/floorplans/${mapId}`, {
      scale: scaleMetersPerPixel,
    });
  }

  static async saveGraph(
    mapId: string,
    payload: { nodes: any[]; edges: any[] },
  ) {
    return ApiClient.put<any>(`/mapstudio/floorplans/${mapId}/graph`, payload);
  }
}
