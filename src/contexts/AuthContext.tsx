'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContext as AuthContextType } from '@/types';
import { AuthService } from '@/services/auth';
import { setCookie, deleteCookie } from '@/utils/cookies';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users para demo (fallback si el backend no está disponible)
const MOCK_USERS: User[] = [
  {
    id: 'admin1',
    name: 'Carlos Administrador',
    email: 'admin@udea.edu.co',
    role: 'admin',
    avatar: undefined,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'student1',
    name: 'Juan Pérez',
    email: 'juan.perez@udea.edu.co',
    role: 'student',
    avatar: undefined,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    // Propiedades específicas de estudiante
    courseIds: ['is1', 'is2', 'is3'],
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    currentTeams: { is1: 'team1' }
  } as User,
  {
    id: 'student2',
    name: 'María García',
    email: 'maria.garcia@udea.edu.co',
    role: 'student',
    avatar: undefined,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    // Propiedades específicas de estudiante
    courseIds: ['is1', 'is2', 'is4'],
    skills: ['Python', 'Django', 'PostgreSQL'],
    currentTeams: {}
  } as User,
  {
    id: 'student3',
    name: 'Carlos López',
    email: 'carlos.lopez@udea.edu.co',
    role: 'student',
    avatar: undefined,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    // Propiedades específicas de estudiante
    courseIds: ['is1', 'is3', 'is5'],
    skills: ['Java', 'Spring', 'MySQL'],
    currentTeams: {}
  } as User,
  {
    id: 'student4',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@udea.edu.co',
    role: 'student',
    avatar: undefined,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    // Propiedades específicas de estudiante
    courseIds: ['is1', 'is4', 'is6'],
    skills: ['Vue.js', 'PHP', 'PostgreSQL'],
    currentTeams: {}
  } as User
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificación de sesión
    const checkAuth = () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('currentUser');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Validación de correo institucional
      const isInstitutional = /@udea\.edu\.co$/i.test(email);
      if (!isInstitutional) {
        const err = new Error('Email no válido');
        (err as any).code = 'INVALID_EMAIL';
        throw err;
      }

      try {
        // Intento real contra el backend
        const resp = await AuthService.login({ email, password });
        setUser(resp.user);
        localStorage.setItem('currentUser', JSON.stringify(resp.user));
        // Guardar cookies para middleware y sesión
        setCookie('auth_token', resp.token, 1);
        setCookie('auth_role', resp.user.role, 1);
      } catch (apiErr) {
        // Fallback a mock en desarrollo si el backend falla
        const fallbackUser = MOCK_USERS.find(u => u.email === email);
        if (!fallbackUser) {
          const err = new Error('Credenciales incorrectas — por favor verifique');
          (err as any).code = 'INVALID_CREDENTIALS';
          throw err;
        }
        setUser(fallbackUser);
        localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
        setCookie('auth_token', 'mock-token', 1);
        setCookie('auth_role', fallbackUser.role, 1);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('currentUser');
      deleteCookie('auth_token');
      deleteCookie('auth_role');
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};