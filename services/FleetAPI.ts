import { ApiClient } from './ApiClient';

export class FleetAPI {
  // 1. THE FIX: Correctly maps to path variables matching Backend Phase 1
  static async getTasksByOrgId(orgId: string) {
    return ApiClient.get<any[]>(`/fleet/tasks/organisation/${orgId}`);
  }

  // 2. THE FIX: Correctly maps to path variables matching Backend Phase 1
  static async getStaffTasks(staffId: string) {
    return ApiClient.get<any[]>(`/fleet/tasks/staff/${staffId}`);
  }

  // 3. THE FIX: Realigned payload and routing contract to target POST /api/fleet/beacons/link
  static async linkBeacon(nodeId: string, uuid: string, major: number, minor: number) {
    return ApiClient.post<any>('/fleet/beacons/link', { 
      nodeId: parseInt(nodeId), 
      uuid, 
      major, 
      minor 
    });
  }

  // 4. THE FIX: Cleaned up dead actions, maps status directly to PUT endpoint
  static async updateTaskStatus(taskId: string, status: string) {
    return ApiClient.put<any>(`/fleet/tasks/${taskId}`, { status });
  }
}