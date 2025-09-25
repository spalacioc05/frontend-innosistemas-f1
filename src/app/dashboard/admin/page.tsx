'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/layout/NavBar';
import { SOFTWARE_ENGINEERING_COURSES, Team, Student } from '@/types';

export default function AdminDashboard() {
  // Placeholder para disolver equipo
  const handleDissolveTeam = (teamId: string) => {
    // Aquí va la lógica para disolver el equipo
    alert(`Disolver equipo con ID: ${teamId}`);
  } 
  const { user } = useAuth();

  // Mock data para admin
  const [adminStats] = useState({
    totalCourses: SOFTWARE_ENGINEERING_COURSES.length,
    totalStudents: 45,
    totalTeams: 18,
    activeTeams: 12,
    incompleteTeams: 2,
    completedTeams: 4,
    totalProjects: 15,
    pendingApprovals: 3
  });

  const [recentActivity] = useState([
    {
      id: '1',
      type: 'team_created',
      message: 'Nuevo equipo "Equipo Delta" creado en Introducción a IS',
      timestamp: '2024-01-22T10:30:00',
      user: 'María García',
      course: 'Introducción a la Ingeniería de Software'
    },
    {
      id: '2',
      type: 'team_incomplete',
      message: 'Equipo "Equipo Beta" marcado como incompleto',
      timestamp: '2024-01-22T09:15:00',
      user: 'Sistema',
      course: 'Programación Orientada a Objetos'
    },
    {
      id: '3',
      type: 'team_dissolved',
      message: 'Equipo "Equipo Gamma" disuelto por el creador',
      timestamp: '2024-01-21T16:45:00',
      user: 'Jorge Pérez',
      course: 'Bases de Datos'
    },
    {
      id: '4',
      type: 'student_registered',
      message: 'Nuevo estudiante registrado',
      timestamp: '2024-01-21T14:20:00',
      user: 'Elena Silva',
      course: 'N/A'
    }
  ]);

  const [alertTeams] = useState([
    {
      id: 'team_alert_1',
      teamName: 'Equipo Beta',
      courseName: 'Programación Orientada a Objetos',
      issue: 'Equipo incompleto - Solo 1 miembro',
      severity: 'high',
      action: 'Requiere intervención inmediata'
    },
    {
      id: 'team_alert_2',
      teamName: 'Equipo Zeta',
      courseName: 'Estructuras de Datos',
      issue: 'Sin actividad por 7 días',
      severity: 'medium',
      action: 'Contactar al equipo'
    },
    {
      id: 'team_alert_3',
      teamName: 'Equipo Theta',
      courseName: 'Arquitectura de Software',
      issue: 'Proyecto retrasado',
      severity: 'low',
      action: 'Seguimiento requerido'
    }
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'team_created':
        return '🆕';
      case 'team_incomplete':
        return '⚠️';
      case 'team_dissolved':
        return '🗑️';
      case 'student_registered':
        return '👥';
      default:
        return '📋';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
            <p className="text-gray-600 mb-4">Esta página es solo para administradores.</p>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
              Ir al Dashboard Principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Bienvenido, {user.name} - Gestión completa del sistema
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Cursos</p>
                <p className="text-3xl font-bold text-gray-900">{adminStats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Estudiantes</p>
                <p className="text-3xl font-bold text-gray-900">{adminStats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Equipos</p>
                <p className="text-3xl font-bold text-gray-900">{adminStats.totalTeams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Alertas Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">{alertTeams.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas detalladas de equipos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{adminStats.activeTeams}</div>
            <p className="text-sm text-gray-600">Equipos Activos</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">{adminStats.incompleteTeams}</div>
            <p className="text-sm text-gray-600">Equipos Incompletos</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{adminStats.completedTeams}</div>
            <p className="text-sm text-gray-600">Equipos Completados</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{adminStats.pendingApprovals}</div>
            <p className="text-sm text-gray-600">Pendientes Aprobación</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Alertas y equipos problemáticos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Alertas del Sistema
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {alertTeams.map((alert) => (
                  <div key={alert.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {alert.teamName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity === 'high' ? 'Alto' : 
                             alert.severity === 'medium' ? 'Medio' : 'Bajo'}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {alert.courseName}
                        </p>
                        
                        <p className="text-sm text-gray-800 mb-2">
                          <strong>Problema:</strong> {alert.issue}
                        </p>
                        
                        <p className="text-sm text-blue-600">
                          <strong>Acción sugerida:</strong> {alert.action}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          Revisar
                        </button>
                        <button className="text-green-600 hover:text-green-800 font-medium text-sm">
                          Resolver
                        </button>
                        {/* Solo el admin puede disolver */}
                        {user?.role === 'admin' && (
                          <button
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                            onClick={() => handleDissolveTeam(alert.id)}
                          >
                            Disolver equipo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Actividad Reciente
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.user} • {activity.course}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accesos rápidos para admin */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Administrativas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/usuarios"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Gestionar Usuarios</h3>
                  <p className="text-sm text-gray-500">Estudiantes y profesores</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/cursos"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Gestionar Cursos</h3>
                  <p className="text-sm text-gray-500">Configurar cursos y períodos</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/equipos"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Supervisar Equipos</h3>
                  <p className="text-sm text-gray-500">Resolver conflictos</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/reportes"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Reportes y Analytics</h3>
                  <p className="text-sm text-gray-500">Estadísticas del sistema</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}