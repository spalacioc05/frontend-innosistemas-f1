import { ApiClient } from '@/config/api';
import type { 
  TokenResponse, 
  LoginRequest, 
  CreateUserDto,
  RefreshTokenRequest,
  LogoutRequest
} from '@/types';

export class AuthService {
  static async login(payload: LoginRequest): Promise<TokenResponse> {
    return ApiClient.post<TokenResponse>('/auth/login', payload);
  }

  static async register(payload: CreateUserDto): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>('/users/createUser', payload);
  }

  static async logout(email: string): Promise<void> {
    try {
      const logoutPayload: LogoutRequest = { email };
      await ApiClient.post<void>('/auth/logout', logoutPayload);
    } catch (error) {
      console.warn('Error al cerrar sesión:', error);
      // Ignoramos errores para no bloquear la UI
    }
  }

  static async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const refreshPayload: RefreshTokenRequest = { refreshToken };
    return ApiClient.post<TokenResponse>('/auth/refresh', refreshPayload);
  }

  static async getUserInfo(): Promise<any> {
    return ApiClient.get<any>('/auth/me');
  }
}
