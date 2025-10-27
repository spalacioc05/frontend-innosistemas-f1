import { ApiClient } from '@/config/api';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types';

export class AuthService {
  static async login(payload: LoginPayload): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/auth/login', payload);
  }

  static async register(payload: RegisterPayload): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>('/auth/register', payload);
  }

  static async logout(token?: string): Promise<void> {
    try {
      await ApiClient.post<void>('/auth/logout', undefined);
    } catch {
      // El backend puede no exponer logout; ignoramos errores para no bloquear la UI
    }
  }
}
