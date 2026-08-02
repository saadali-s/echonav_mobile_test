import { ApiClient } from './ApiClient';

export class DashboardAPI {
  static async getDashboardData(orgId: string) {
    return ApiClient.get<any>(`/dashboard/organisations/${orgId}`);
  }
}