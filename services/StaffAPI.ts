import { ApiClient } from './ApiClient';

export class StaffAPI {
  // Admin: Send an invite email
  static async inviteStaff(email: string, role: 'ADMIN' | 'TECHNICIAN') {
    return ApiClient.post<any>('/staff/invite', { email, role });
  }

  // Mobile: Staff activating their invite code
  static async activateStaff(inviteCode: string, password: string, displayName: string) {
    return ApiClient.post<any>('/staff/activate', { inviteCode, password, displayName });
  }
}