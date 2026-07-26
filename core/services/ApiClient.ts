import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.3.112:8080/api"; 
const TOKEN_KEY = 'echonav_mobile_jwt';

export class ApiClient {
  
  static async setToken(jwt: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, jwt);
  }

  static async clearToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }

  static async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-EchoNav-App-Key': process.env.EXPO_PUBLIC_APP_KEY || 'default_dev_app_key_12345',
      ...(options.headers as Record<string, string> || {}),
    };

    const token = await this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // THE FIX: 8-Second Execution Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, { ...options, headers, signal: controller.signal as any });
      clearTimeout(timeoutId);
      
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP Error ${response.status}`);
      }

      return data as T;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error("Connection timed out. The server is unreachable.");
      }
      console.error(`[API ERROR] ${options.method || 'GET'} ${endpoint}:`, error.message);
      throw error;
    }
  }

  static async get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  static async put<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }
}