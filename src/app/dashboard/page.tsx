'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '../../components/layout/NavBar';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Redirigir según el rol del usuario
      switch (user.role) {
        case 'student':
          router.push('/dashboard/student');
          break;
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'professor':
          router.push('/dashboard/professor');
          break;
        default:
          // Mantener el dashboard genérico como fallback
          break;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
            <p className="text-gray-600 mb-4">Debes iniciar sesión para acceder al dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard genérico (fallback)
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard - Gestión de Equipos
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Universidad de Antioquia - Ingeniería de Software
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Bienvenido, {user.name}
          </h2>
          <p className="text-gray-600 mb-6">
            Tu dashboard específico se está cargando...
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Rol: {user.role === 'admin' ? 'Administrador' : 
                    user.role === 'professor' ? 'Profesor' : 'Estudiante'}
            </p>
            <p className="text-sm text-gray-500">
              Email: {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}