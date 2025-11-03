'use client';

import { useState } from 'react';
import Link from 'next/link';
import NavBar from '../../components/layout/NavBar';
import { SOFTWARE_ENGINEERING_COURSES } from '@/types';

export default function CursosPage() {
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  const filteredCourses = selectedSemester 
    ? SOFTWARE_ENGINEERING_COURSES.filter(course => course.semester === selectedSemester)
    : SOFTWARE_ENGINEERING_COURSES;

  const semesters = Array.from(new Set(SOFTWARE_ENGINEERING_COURSES.map(course => course.semester)));

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Cursos de Ingeniería de Software
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Universidad de Antioquia - Gestión de Equipos de Desarrollo
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros por semestre */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSemester(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSemester === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Todos los semestres
            </button>
            {semesters.map(semester => (
              <button
                key={semester}
                onClick={() => setSelectedSemester(semester)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSemester === semester
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Semestre {semester}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de cursos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.idCourse} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Semestre {course.semester}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    course.status 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {course.nameCourse}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  Curso de {course.nameCourse} - Semestre {course.semester}
                </p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Ingeniería de Software
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Equipos de desarrollo
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/cursos/${course.idCourse}/equipos`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Ver Equipos
                  </Link>
                  <Link
                    href={`/cursos/${course.idCourse}`}
                    className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 text-center py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cursos disponibles</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron cursos para el semestre seleccionado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}