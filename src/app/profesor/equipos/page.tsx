"use client";

import { useState, useEffect } from 'react';
import NavBar from '@/components/layout/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { TeamsService } from '@/services/teams';
import { CoursesService } from '@/services/courses';
import type { TeamShowDto, CourseDto } from '@/types';

export default function ProfessorEquiposPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<TeamShowDto[]>([]);
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [coursesData, teamsData] = await Promise.all([
          CoursesService.getAllCourses(),
          TeamsService.getAllTeams()
        ]);
        setCourses(coursesData);
        setTeams(teamsData);
      } catch (e) {
        console.error('Error fetching data:', e);
        setError('Error al cargar la información');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
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

  const filteredTeams = selectedCourse 
    ? teams.filter(team => team.courseId.toString() === selectedCourse)
    : teams;

  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.idCourse === courseId);
    return course?.nameCourse || `Curso ${courseId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Equipos de Estudiantes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Supervisa y gestiona los equipos de trabajo de tus estudiantes
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
            <span className="ml-3 text-lg text-gray-600">Cargando equipos...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label htmlFor="course-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Filtrar por curso
                  </label>
                  <select
                    id="course-filter"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Todos los cursos</option>
                    {courses.map((course) => (
                      <option key={course.idCourse} value={course.idCourse.toString()}>
                        {course.nameCourse}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Equipos</p>
                    <p className="text-3xl font-bold text-gray-900">{filteredTeams.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {filteredTeams.reduce((total, team) => total + team.students.length, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Cursos Activos</p>
                    <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teams List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-blue-600 border-b">
                <h3 className="text-lg font-semibold text-white">
                  Equipos de Trabajo
                  {selectedCourse && (
                    <span className="ml-2 text-green-100">
                      - {getCourseName(parseInt(selectedCourse))}
                    </span>
                  )}
                </h3>
              </div>

              {filteredTeams.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay equipos</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedCourse 
                      ? 'No se encontraron equipos para el curso seleccionado.'
                      : 'No se han encontrado equipos de estudiantes.'
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredTeams.map((team) => (
                    <div key={team.idTeam} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold">{team.idTeam}</span>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{team.nameTeam}</h4>
                              <p className="text-sm text-gray-600">
                                Curso: {getCourseName(team.courseId)} | Proyecto: {team.projectName}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-900">
                              Integrantes ({team.students.length}):
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {team.students.map((student, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {student.nameUser}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4 flex space-x-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}