export const API_CONFIG = {
  // Por defecto usar la ruta relativa `/api` para que el frontend pueda llamar a
  // los endpoints definidos en este mismo proyecto (mock/local). Si se define
  // `NEXT_PUBLIC_API_URL` se usará ese valor (producción / backend real).
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
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
          
          // Si la respuesta tiene la estructura de ApiError
          if (errorJson.message) {
            errorMessage = errorJson.message;
          } 
          // Si es una respuesta simple con message
          else if (typeof errorJson === 'object' && errorJson.message) {
            errorMessage = errorJson.message;
          }
          // Manejo específico por código de estado
          else {
            switch (response.status) {
              case 401:
                errorMessage = 'Credenciales incorrectas. Verifique su email y contraseña.';
                break;
              case 403:
                errorMessage = 'No tiene permisos para acceder a este recurso.';
                break;
              case 404:
                errorMessage = 'Recurso no encontrado.';
                break;
              case 500:
                errorMessage = 'Error interno del servidor. Intente más tarde.';
                break;
              default:
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }
          }
        } catch (parseError) {
          // Si no se puede parsear, usar mensaje por defecto según status code
          switch (response.status) {
            case 401:
              errorMessage = 'Credenciales incorrectas. Verifique su email y contraseña.';
              break;
            case 403:
              errorMessage = 'No tiene permisos para acceder a este recurso.';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado.';
              break;
            case 500:
              errorMessage = 'Error interno del servidor. Intente más tarde.';
              break;
            default:
              errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log(`Response data:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      // Si es un error de red
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifique su conexión a internet.');
      }
      
      // Re-lanzar el error original si ya tiene un mensaje personalizado
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