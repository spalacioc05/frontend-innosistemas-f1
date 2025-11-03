export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    // Adjuntar Authorization si existe cookie 'auth_token' en entorno cliente
    let authHeaders: Record<string, string> = {};
    try {
      if (typeof document !== 'undefined') {
        const token = document.cookie
          .split('; ')
          .find((v) => v.startsWith('auth_token='))
          ?.split('=')[1];
        if (token) authHeaders['Authorization'] = `Bearer ${decodeURIComponent(token)}`;
      }
    } catch {}

    const config: RequestInit = {
      headers: { ...API_CONFIG.HEADERS, ...(options.headers as any), ...authHeaders },
      ...options,
    };

    try {
      console.log(`Making request to: ${url}`);
      console.log(`Request config:`, config);
      
      const response = await fetch(url, config);
      
      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error Response Body:`, errorText);
        
        // Intentar parsear el mensaje de error del JSON
        let errorMessage = `API Error: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (parseError) {
          // Si no se puede parsear, usar el texto completo
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log(`Response data:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  static get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}