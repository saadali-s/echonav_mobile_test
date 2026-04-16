import { ApiClient } from './ApiClient';

export class AuthAPI {
  // Mobile: Staff Login
  static async loginStaff(email: string, password: string) {
    return ApiClient.post<any>('/auth/login', { email, password });
  }

  // Mobile: Visually Impaired Student pairing
  static async pairDevice(pin: string, appInstallationId: string, deviceModel: string) {
    return ApiClient.post<any>('/auth/device/pair', { pin, appInstallationId, deviceModel });
  }

  // Admin: PsyCaD Desk generating a PIN
  static async generatePairingPin() {
    return ApiClient.post<any>('/auth/device/generate-pin', {});
  }

  // Admin: Initial master tenant setup
  static async registerOrganization(payload: { orgName: string, slug: string, adminEmail: string, adminPassword: string, adminName: string }) {
    return ApiClient.post<any>('/organizations/register', payload);
  }
}