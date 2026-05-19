import { ApiClient } from './ApiClient';

export class AuthAPI {
  static async loginStaff(email: string, password: string) {
    return ApiClient.post<any>('/auth/login', { email, password });
  }

  static async pairDevice(email: string, pin: string) {
    return ApiClient.post<any>('/auth/pair', { email, pin });
  }

  static async mobileSignup(firstName: string, lastName: string, email: string, password: string) {
    return ApiClient.post<any>('/auth/mobile-signup', { firstName, lastName, email, password });
  }

  static async activateInvite(token: string, password: string) {
    return ApiClient.post<any>(`/auth/activate/${token}`, { password });
  }

  // THE FIX: Ensure local state clears regardless of server response
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