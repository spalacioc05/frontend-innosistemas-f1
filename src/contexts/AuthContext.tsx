'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserInfo, AuthContextType, LoginRequest, TokenResponse } from '@/types';
import { AuthService } from '@/services/auth';
import { setCookie, deleteCookie, getCookie } from '@/utils/cookies';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    if (user?.email) {
      AuthService.logout(user.email).catch(console.error);
    }
    
    setUser(null);
    setToken(null);
    deleteCookie('auth_token');
    deleteCookie('refresh_token');
    deleteCookie('user_info');
  };

  useEffect(() => {
    const storedToken = getCookie('auth_token');
    
    if (storedToken) {
      setToken(storedToken);
      try {
        const userInfoCookie = getCookie('user_info');
        if (userInfoCookie && userInfoCookie !== 'undefined') {
          const userInfo = JSON.parse(userInfoCookie);
          if (userInfo.email) {
            setUser(userInfo);
          }
        }
      } catch (error) {
        console.error('Error parsing user info:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response: TokenResponse = await AuthService.login(credentials);
      
      setToken(response.accessToken);
      setCookie('auth_token', response.accessToken, response.expiresIn);
      setCookie('refresh_token', response.refreshToken, 7 * 24 * 60 * 60);
      
      // Obtener información real del usuario desde el backend
      try {
        const userInfo = await AuthService.getUserInfo();
        console.log('User info from backend:', userInfo);
        console.log('Role from backend:', userInfo.role);
        
        // Mapear roles de la base de datos a roles del frontend
        const mapRole = (role: string) => {
          if (!role) return 'user';
          
          const roleLower = role.toLowerCase();
          if (roleLower.includes('admin') || role === 'Administrador') return 'admin';
          if (roleLower.includes('profesor') || role === 'Profesor') return 'professor';
          if (roleLower.includes('estudiante') || role === 'Estudiante') return 'student';
          
          return role; // Mantener el rol original si no hay mapeo
        };
        
        const fullUserInfo: UserInfo = {
          email: userInfo.email || credentials.email,
          name: userInfo.name || credentials.email.split('@')[0],
          role: mapRole(userInfo.role) || 'user',
          permissions: userInfo.permissions || []
        };
        
        console.log('Final user info:', fullUserInfo);
        setUser(fullUserInfo);
        setCookie('user_info', JSON.stringify(fullUserInfo), response.expiresIn);
      } catch (userInfoError) {
        console.error('Error getting user info:', userInfoError);
        
        // Fallback: información básica del usuario
        const basicUserInfo: UserInfo = {
          email: credentials.email,
          name: credentials.email.split('@')[0],
          role: 'user',
          permissions: []
        };
        
        setUser(basicUserInfo);
        setCookie('user_info', JSON.stringify(basicUserInfo), response.expiresIn);
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshTokenValue = getCookie('refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }
      
      const response: TokenResponse = await AuthService.refreshToken(refreshTokenValue);
      
      setToken(response.accessToken);
      
      // Mantener la información de usuario existente o crear una básica
      const currentUser = user || {
        email: 'unknown@example.com',
        name: 'User',
        role: 'user',
        permissions: []
      };
      
      setUser(currentUser);
      
      setCookie('auth_token', response.accessToken, response.expiresIn);
      setCookie('refresh_token', response.refreshToken, 7 * 24 * 60 * 60);
      setCookie('user_info', JSON.stringify(currentUser), response.expiresIn);
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      throw error;
    }
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    refreshToken,
    isAuthenticated,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
