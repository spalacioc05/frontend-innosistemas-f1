"use client";

import { useEffect, useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectsService } from '@/services/projects';
import { CoursesService } from '@/services/courses';
import type { CourseDto } from '@/types';

interface CourseOption { id: string; name: string; }

export default function AdminProyectosPage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    CoursesService.getAllCourses()
      .then((data: CourseDto[]) => setCourses(data.map((c: CourseDto) => ({ id: c.idCourse.toString(), name: c.nameCourse }))))
      .catch(() => setCourses([]));
  }, []);

  if (!user || (user.role !== 'admin' && user.role !== 'Administrador')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
            <p className="text-gray-600 mb-4">Esta página es solo para administradores.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('El nombre del proyecto es obligatorio');
      return;
    }
    if (!description.trim()) {
      setError('La descripción del proyecto es obligatoria');
      return;
    }
    if (!courseId) {
      setError('Debes seleccionar un curso');
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      // Crear el proyecto directamente (sin validación previa de duplicados)
      await ProjectsService.createProject({ 
        nameProject: name.trim(), 
        descriptions: description.trim(),
        courseId: parseInt(courseId)
      });
      setSuccess('Proyecto creado exitosamente');
      setName('');
      setDescription('');
      setCourseId('');
    } catch (e) {
      console.error(e);
      setError('Ocurrió un error al crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Crear Proyecto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Agrega un nuevo proyecto para asignar a los equipos de estudiantes
          </p>
        </div>

        {/* Alert Messages */}
        <div className="max-w-2xl mx-auto mb-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-sm mb-4">
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
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg shadow-sm mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">¡Éxito!</h3>
                  <p className="text-sm text-green-700 mt-1">{success}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="px-8 py-6 bg-gradient-to-r from-green-500 to-blue-600">
              <h2 className="text-2xl font-bold text-white">Información del Proyecto</h2>
              <p className="text-green-100 mt-1">Complete los siguientes campos para crear el nuevo proyecto</p>
            </div>
            
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
              {/* Campo Nombre del Proyecto */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                  Nombre del proyecto
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-200 text-lg font-semibold text-gray-900 bg-white shadow-sm hover:border-gray-300 placeholder-gray-400"
                    placeholder="Ej: Sistema de reservas"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Ingrese un nombre descriptivo y único para el proyecto
                </p>
              </div>

              {/* Campo Descripción */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
                  Descripción
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-200 text-lg font-semibold text-gray-900 bg-white resize-none shadow-sm hover:border-gray-300 placeholder-gray-400"
                    rows={4}
                    placeholder="Descripción detallada del proyecto, objetivos, alcance..."
                    required
                  />
                  <div className="absolute top-4 right-4 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Proporcione información detallada sobre el proyecto
                </p>
              </div>

              {/* Campo Curso */}
              <div className="space-y-2">
                <label htmlFor="course" className="block text-sm font-semibold text-gray-800">
                  Curso
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    id="course"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-200 text-lg font-semibold text-gray-900 bg-white shadow-sm hover:border-gray-300 appearance-none"
                    required
                  >
                    <option value="" className="text-gray-400">Selecciona un curso</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id} className="text-gray-900">{c.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Seleccione el curso al que pertenecerá este proyecto
                </p>
              </div>

              {/* Botón de Envío */}
              <div className="pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold text-lg rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando proyecto...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Crear Proyecto
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Información adicional */}
          <div className="mt-8 bg-green-50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Información importante</h3>
                <div className="mt-2 text-sm text-green-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>El proyecto será asignado al curso seleccionado</li>
                    <li>Los equipos del curso podrán trabajar en este proyecto</li>
                    <li>Asegúrese de proporcionar una descripción clara y detallada</li>
                    <li>El nombre del proyecto debe ser descriptivo del trabajo a realizar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
