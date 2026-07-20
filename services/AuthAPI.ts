import { ApiClient } from './ApiClient';

export class AuthAPI {
  static async loginStaff(email: string, password: string) {
    return ApiClient.post<any>('/auth/login', { email, password });
  }

  static async pairDevice(email: string, pin: string) {
    return ApiClient.post<any>('/auth/pair', { email, pin });
  }

  static async activateInvite(token: string, password: string) {
    return ApiClient.post<any>(`/auth/activate/${token}`, { password });
  }

  // THE FIX: Added to fetch the live profile data for the Settings page
  static async getProfile() {
    return ApiClient.get<any>('/auth/me');
  }

  static async logout() {
    try {
      await ApiClient.post<any>('/auth/logout', {});
    } catch (error) {
      console.warn("Backend logout failed or not supported, proceeding to clear local token.");
    } finally {
      await ApiClient.clearToken();
    }
  }
}