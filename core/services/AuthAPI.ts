import { ApiClient } from './ApiClient';

export class AuthAPI {
  static async loginStaff(email: string, password: string) {
    return ApiClient.post<any>('/auth/login', { email, password });
  }

  // THE FIX: Map the 'pin' argument to the 'pairingPin' key expected by Spring Boot
  static async pairDevice(email: string, pin: string) {
    return ApiClient.post<any>('/auth/pair', { email, pairingPin: pin });
  }

  static async activateInvite(token: string, password: string) {
    return ApiClient.post<any>(`/auth/activate/${token}`, { password });
  }

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