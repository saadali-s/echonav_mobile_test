import { ApiClient } from './ApiClient';

export class FleetAPI {
  // 1. Correctly maps to path variables matching Backend Phase 1
  static async getTasksByOrgId(orgId: string) {
    return ApiClient.get<any[]>(`/fleet/tasks/organisation/${orgId}`);
  }

  // 2. Correctly maps to path variables matching Backend Phase 1
  static async getStaffTasks(staffId: string) {
    return ApiClient.get<any[]>(`/fleet/tasks/staff/${staffId}`);
  }

  // 3. THE FIX: Changed payload contract from nodeId to taskId
  static async linkBeacon(taskId: string, uuid: string, major: number, minor: number) {
    return ApiClient.post<any>('/fleet/beacons/link', { 
      taskId: parseInt(taskId), 
      uuid, 
      major, 
      minor 
    });
  }

  // 4. Added calibratedRssiBaseline to the PUT payload
  static async updateTaskStatus(taskId: string, status: string, calibratedRssiBaseline?: number | null) {
    return ApiClient.put<any>(`/fleet/tasks/${taskId}`, { 
      status,
      calibratedRssiBaseline
    });
  }
}