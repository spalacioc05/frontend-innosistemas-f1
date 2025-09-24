'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SOFTWARE_ENGINEERING_COURSES } from '@/types';

export default function CursoDetallePage() {
  const params = useParams();
  const courseId = params.id as string;
  
  const course = SOFTWARE_ENGINEERING_COURSES.find(c => c.id === courseId);

  // Datos mock para equipos y proyectos
  const [teams] = useState([
    {
      id: '1',
      name: 'Equipo Alpha',
      members: ['Juan Pérez', 'María García', 'Carlos López'],
      project: 'Sistema de Gestión Académica',
      progress: 75
    },
    {
      id: '2',
      name: 'Equipo Beta',
      members: ['Ana Rodríguez', 'Luis Martínez'],
      project: 'Aplicación Móvil para Biblioteca',
      progress: 45
    },
    {
      id: '3',
      name: 'Equipo Gamma',
      members: ['Elena Ruiz', 'Jorge Pérez', 'Roberto Silva'],
      project: 'Portal de Estudiantes',
      progress: 90
    }
  ]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h1>
          <Link href="/cursos" className="text-blue-600 hover:text-blue-800">
            Volver a cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/cursos" className="text-gray-700 hover:text-blue-600">
                    Cursos
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500 ml-1 md:ml-2">{course.name}</span>
                  </div>
                </li>
              </ol>
            </nav>
            
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {course.name}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Semestre {course.semester} - Prof. {course.professor}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información del curso */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información del Curso
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                  <p className="mt-1 text-sm text-gray-900">{course.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Profesor</h3>
                  <p className="mt-1 text-sm text-gray-900">{course.professor}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tamaño de equipos</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {course.minTeamSize} - {course.maxTeamSize} estudiantes
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                  <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    course.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  href={`/cursos/${course.id}/equipos`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors block"
                >
                  Gestionar Equipos
                </Link>
              </div>
            </div>
          </div>

          {/* Lista de equipos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Equipos del Curso ({teams.length})
                  </h2>
                  <Link
                    href={`/cursos/${course.id}/equipos/crear`}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    + Crear Equipo
                  </Link>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {teams.map((team) => (
                  <div key={team.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {team.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {team.members.length} miembros
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Proyecto:</strong> {team.project}
                    </p>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progreso</span>
                        <span>{team.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${team.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {team.members.map((member, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link
                          href={`/cursos/${course.id}/equipos/${team.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {teams.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay equipos creados</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comienza creando el primer equipo para este curso.
                  </p>
                  <div className="mt-6">
                    <Link
                      href={`/cursos/${course.id}/equipos/crear`}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Crear Primer Equipo
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}