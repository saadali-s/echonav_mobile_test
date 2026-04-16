import { ApiClient } from './ApiClient';

export class FleetAPI {
  // Admin: Top-row dashboard stats
  static async getOverview(organizationId: string) {
    return ApiClient.get<any>(`/fleet/overview?organizationId=${organizationId}`);
  }

  // Mobile: Populating the technician's Kanban board
  static async getStaffTasks(staffId: string) {
    return ApiClient.get<any[]>(`/fleet/tasks?staffId=${staffId}`);
  }

  // Admin: Bulk assigning nodes to a technician
  static async createDeploymentTasks(payload: { organizationId: string, mapId: string, nodeIds: string[], staffId: string }) {
    return ApiClient.post<any>('/fleet/tasks', payload);
  }

  // Mobile: Phase C.2 - Scanning and locking the MAC address
  static async bindBeacon(taskId: string, payload: { organizationId: string, nodeId: string, hardwareUuid: string, major: number, minor: number }) {
    return ApiClient.put<any>(`/fleet/tasks/${taskId}/action`, { 
      action: 'BIND', 
      ...payload 
    });
  }

  // Mobile: Phase C.3 - Saving the 1-meter RSSI baseline
  static async calibrateBeacon(taskId: string, payload: { beaconId: string, baselineRssi: number }) {
    return ApiClient.put<any>(`/fleet/tasks/${taskId}/action`, { 
      action: 'CALIBRATE', 
      ...payload 
    });
  }
}