// Replace with your computer's actual local IP address running the Next.js server
// e.g., "http://192.168.1.100:3000/api"
const BASE_URL = "http://YOUR_LOCAL_IP:3000/api"; 

export class ApiClient {
  // We will dynamically inject the JWT token here in Subtask D.2
  static token: string | null = null;

  static setToken(jwt: string) {
    this.token = jwt;
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    // Explicitly cast to a Record so TypeScript allows dynamic key assignment
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // Automatically attach the Authorization header if we have a token
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new Error(data.error || `HTTP Error ${response.status}`);
      }

      return data as T;
    } catch (error: any) {
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