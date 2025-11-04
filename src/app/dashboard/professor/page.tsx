"use client";

import { useState, useEffect } from 'react';
import NavBar from '@/components/layout/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { CoursesService } from '@/services/courses';
import { ProjectsService } from '@/services/projects';
import type { CourseDto, ProjectDto } from '@/types';

export default function ProfessorDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesData, projectsData] = await Promise.all([
          CoursesService.getAllCourses(),
          ProjectsService.getAllProjects()
        ]);
        setCourses(coursesData);
        setProjects(projectsData);
      } catch (e) {
        console.error('Error fetching data:', e);
        setError('Error al cargar la información');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user || (user.role !== 'Profesor' && user.role !== 'professor')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
            <p className="text-gray-600 mb-4">Esta página es solo para profesores.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dashboard del Profesor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bienvenido, <span className="font-semibold text-green-600">{user.name}</span>. 
            Gestiona tus cursos, revisa proyectos y supervisa el progreso de los equipos.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <span className="ml-3 text-lg text-gray-600">Cargando información...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Cursos</p>
                    <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Proyectos</p>
                    <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Equipos Activos</p>
                    <p className="text-3xl font-bold text-gray-900">--</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cursos Recientes */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border-b">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Cursos Disponibles
                  </h3>
                </div>
                <div className="p-6">
                  {courses.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cursos</h3>
                      <p className="mt-1 text-sm text-gray-500">No se han encontrado cursos disponibles.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {courses.slice(0, 5).map((course) => (
                        <div key={course.idCourse} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">{course.idCourse}</span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{course.nameCourse}</p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Ver detalles
                          </button>
                        </div>
                      ))}
                      {courses.length > 5 && (
                        <div className="text-center pt-3">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Ver todos los cursos ({courses.length})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Proyectos Recientes */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 border-b">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Proyectos Activos
                  </h3>
                </div>
                <div className="p-6">
                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
                      <p className="mt-1 text-sm text-gray-500">No se han encontrado proyectos activos.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.slice(0, 5).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-green-600 font-semibold text-sm">{project.id}</span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{project.name}</p>
                            </div>
                          </div>
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                            Ver equipos
                          </button>
                        </div>
                      ))}
                      {projects.length > 5 && (
                        <div className="text-center pt-3">
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                            Ver todos los proyectos ({projects.length})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Acciones Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h4 className="mt-2 text-sm font-medium text-gray-900 group-hover:text-blue-600">Ver Cursos</h4>
                    <p className="text-xs text-gray-500">Explorar todos los cursos</p>
                  </div>
                </button>
                
                <button className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-colors group">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h4 className="mt-2 text-sm font-medium text-gray-900 group-hover:text-green-600">Gestionar Proyectos</h4>
                    <p className="text-xs text-gray-500">Revisar y supervisar proyectos</p>
                  </div>
                </button>
                
                <button className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors group">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h4 className="mt-2 text-sm font-medium text-gray-900 group-hover:text-purple-600">Ver Equipos</h4>
                    <p className="text-xs text-gray-500">Monitorear equipos de trabajo</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}