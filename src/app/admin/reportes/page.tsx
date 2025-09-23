'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import { Team, SOFTWARE_ENGINEERING_COURSES, TeamReport } from '@/types';

// Mock data para reportes
const MOCK_TEAM_REPORTS: TeamReport[] = [
  {
    teamId: '1',
    teamName: 'Team Alpha',
    courseName: 'Introducción a la Ingeniería de Software',
    memberCount: 2,
    projectProgress: 75,
    lastActivity: new Date('2024-01-20'),
    status: 'active'
  },
  {
    teamId: '2',
    teamName: 'Team Beta',
    courseName: 'Programación Orientada a Objetos',
    memberCount: 3,
    projectProgress: 60,
    lastActivity: new Date('2024-01-18'),
    status: 'active'
  },
  {
    teamId: '3',
    teamName: 'Team Gamma',
    courseName: 'Bases de Datos',
    memberCount: 2,
    projectProgress: 90,
    lastActivity: new Date('2024-01-22'),
    status: 'completed'
  },
  {
    teamId: '4',
    teamName: 'Team Delta',
    courseName: 'Arquitectura de Software',
    memberCount: 1,
    projectProgress: 25,
    lastActivity: new Date('2024-01-15'),
    status: 'incomplete'
  }
];

export default function ReportesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<TeamReport[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!isLoading && user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setReports(MOCK_TEAM_REPORTS);
  }, [user, isLoading, router]);

  const filteredReports = reports.filter(report => {
    const matchesCourse = selectedCourse === 'all' || report.courseName.includes(selectedCourse);
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesCourse && matchesStatus;
  });

  const getGeneralStats = () => {
    return {
      totalTeams: reports.length,
      activeTeams: reports.filter(r => r.status === 'active').length,
      completedTeams: reports.filter(r => r.status === 'completed').length,
      incompleteTeams: reports.filter(r => r.status === 'incomplete').length,
      averageProgress: Math.round(reports.reduce((acc, r) => acc + r.projectProgress, 0) / reports.length),
      totalStudents: reports.reduce((acc, r) => acc + r.memberCount, 0)
    };
  };

  const stats = getGeneralStats();

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

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
            <p className="mt-2 text-lg text-gray-600">
              Análisis completo del rendimiento de equipos y cursos
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalTeams}</div>
              <div className="text-sm text-gray-600 mt-1">Total Equipos</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.activeTeams}</div>
              <div className="text-sm text-gray-600 mt-1">Equipos Activos</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.completedTeams}</div>
              <div className="text-sm text-gray-600 mt-1">Equipos Completados</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.incompleteTeams}</div>
              <div className="text-sm text-gray-600 mt-1">Equipos Incompletos</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.averageProgress}%</div>
              <div className="text-sm text-gray-600 mt-1">Progreso Promedio</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{stats.totalStudents}</div>
              <div className="text-sm text-gray-600 mt-1">Total Estudiantes</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por curso
              </label>
              <select
                id="course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los cursos</option>
                {SOFTWARE_ENGINEERING_COURSES.map(course => (
                  <option key={course.id} value={course.name}>{course.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:w-48">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por estado
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="forming">En Formación</option>
                <option value="active">Activos</option>
                <option value="completed">Completados</option>
                <option value="incomplete">Incompletos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Reportes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Reporte de Equipos ({filteredReports.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Miembros
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.teamId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{report.teamName}</div>
                      <div className="text-sm text-gray-500">ID: {report.teamId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.courseName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm text-gray-900">{report.memberCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              report.projectProgress >= 80 ? 'bg-green-500' :
                              report.projectProgress >= 60 ? 'bg-yellow-500' :
                              report.projectProgress >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${report.projectProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{report.projectProgress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'active' ? 'bg-green-100 text-green-800' :
                        report.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        report.status === 'forming' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status === 'active' ? 'Activo' :
                         report.status === 'completed' ? 'Completado' :
                         report.status === 'forming' ? 'En Formación' : 'Incompleto'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.lastActivity.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          Ver Detalles
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Exportar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron reportes</h3>
              <p className="text-gray-600">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </div>

        {/* Gráfico de Estado de Equipos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Activos</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${(stats.activeTeams / stats.totalTeams) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.activeTeams}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completados</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(stats.completedTeams / stats.totalTeams) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.completedTeams}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Incompletos</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="h-2 bg-red-500 rounded-full"
                      style={{ width: `${(stats.incompleteTeams / stats.totalTeams) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.incompleteTeams}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Exportar Reporte Completo
              </button>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Generar Reporte de Progreso
              </button>
              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Enviar Recordatorios
              </button>
              <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Configurar Alertas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}