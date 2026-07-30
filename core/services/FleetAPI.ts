import { ApiClient } from "./ApiClient";

export class FleetAPI {
  static async getTasksByOrgId(orgId: string) {
    return ApiClient.get<any[]>(`/fleet/tasks/organisation/${orgId}`);
  }

  static async getStaffTasks(staffId: string) {
    return ApiClient.get<any[]>(`/fleet/tasks/staff/${staffId}`);
  }

  static async linkBeacon(
    taskId: string,
    uuid: string,
    major: number,
    minor: number,
  ) {
    return ApiClient.post<any>("/fleet/beacons/link", {
      taskId: parseInt(taskId),
      uuid,
      major,
      minor,
    });
  }

  static async updateTaskStatus(
    taskId: string,
    status: string,
    calibratedRssiBaseline?: number | null,
  ) {
    return ApiClient.put<any>(`/fleet/tasks/${taskId}`, {
      status,
      calibratedRssiBaseline,
    });
  }
}
