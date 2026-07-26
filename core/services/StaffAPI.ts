import { ApiClient } from './ApiClient';

export class StaffAPI {
  // Admin: Send an invite email
  static async inviteStaff(email: string, role: 'ADMIN' | 'TECHNICIAN') {
    return ApiClient.post<any>('/staff/invite', { email, role });
  }

  // THE FIX: Re-mapped to the Auth subsystem and removed redundant payload fields 
  // (Backend Activation only requires the token in the URL and the password in the body)
  static async activateStaff(inviteCode: string, password: string) {
    return ApiClient.post<any>(`/auth/activate/${inviteCode}`, { password });
  }
}