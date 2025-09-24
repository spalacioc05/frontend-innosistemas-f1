'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContext as AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users para demo
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
  } as any,
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
  } as any,
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
  } as any,
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
  } as any
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
      // Simular autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = MOCK_USERS.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // En una aplicación real, aquí validarías la contraseña
      // Por ahora, aceptamos cualquier contraseña para demo
      
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
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