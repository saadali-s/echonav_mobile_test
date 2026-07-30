import { ApiClient } from "./ApiClient";

export class StaffAPI {
  static async inviteStaff(email: string, role: "ADMIN" | "TECHNICIAN") {
    return ApiClient.post<any>("/staff/invite", { email, role });
  }

  static async activateStaff(inviteCode: string, password: string) {
    return ApiClient.post<any>(`/auth/activate/${inviteCode}`, { password });
  }
}
