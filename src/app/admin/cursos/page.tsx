"use client";

import { useState, useEffect } from 'react';
import NavBar from '@/components/layout/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { CoursesService } from '@/services/courses';
import { CourseDto } from '@/types';

export default function AdminCursosPage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [editingCourse, setEditingCourse] = useState<CourseDto | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      setError('');
      console.log('Iniciando carga de cursos...');
      const allCourses = await CoursesService.getAllCourses();
      console.log('Cursos cargados:', allCourses);
      setCourses(allCourses);
    } catch (error) {
      console.error('Error detallado al cargar cursos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar los cursos';
      setError(`Error al cargar los cursos: ${errorMessage}`);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleEditCourse = async (courseId: number, newName: string) => {
    try {
      setLoading(true);
      await CoursesService.updateCourse(courseId, newName);
      setSuccess('Curso actualizado exitosamente');
      setEditingCourse(null);
      await loadCourses();
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Error al actualizar el curso');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log(`Intentando eliminar curso ID: ${courseId}`);
      
      await CoursesService.deleteCourse(courseId);
      setSuccess('Curso eliminado exitosamente');
      await loadCourses();
    } catch (error) {
      console.error('Error detallado al eliminar curso:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Manejo específico para curso ya eliminado
      if (errorMessage.includes('ya está eliminado')) {
        setError('ℹ️ Este curso ya fue eliminado anteriormente. Actualizando vista...');
        setTimeout(async () => {
          await loadCourses();
          setSuccess('✅ Lista actualizada - Solo se muestran cursos activos');
          setError('');
        }, 1500);
      } else if (errorMessage.includes('No se encontró')) {
        setError('⚠️ El curso no existe o ya fue eliminado. Actualizando vista...');
        setTimeout(async () => {
          await loadCourses();
          setSuccess('✅ Lista actualizada');
          setError('');
        }, 1500);
      } else {
        setError(`❌ Error al eliminar el curso: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
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
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('El campo es obligatorio');
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      // Verificar si ya existe un curso con el mismo nombre
      const allCourses = await CoursesService.getAllCourses();
      const existingCourse = allCourses.find(course => 
        course.nameCourse.toLowerCase() === name.trim().toLowerCase()
      );
      
      if (existingCourse) {
        setError('Ya existe un curso con este nombre');
        return;
      }

      // Crear el curso usando solo el nombre como string
      await CoursesService.createCourse(name.trim());
      setSuccess('Curso creado exitosamente');
      setName('');
      setShowCreateForm(false);
      await loadCourses();
    } catch (e) {
      console.error('Error detallado al crear curso:', e);
      const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
      setError(`Error al crear el curso: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <NavBar />
      
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Administra todos los cursos de ingeniería del sistema
                </p>
              </div>
              <div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Crear Curso</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => setError('')}
                    className="text-sm text-red-600 hover:text-red-500 underline"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={loadCourses}
                    className="text-sm text-blue-600 hover:text-blue-500 underline"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
                <button
                  onClick={() => setSuccess('')}
                  className="mt-2 text-sm text-green-600 hover:text-green-500 underline"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Cursos */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Cursos Registrados</h2>
          </div>
          
          {loadingCourses ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando cursos...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cursos registrados</h3>
              <p className="text-gray-600 mb-4">
                Aún no se han creado cursos en el sistema
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Crear el primer curso
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {courses.map((course) => (
                <div key={course.idCourse} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingCourse?.idCourse === course.idCourse ? (
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={editingCourse.nameCourse}
                            onChange={(e) => setEditingCourse({
                              ...editingCourse,
                              nameCourse: e.target.value
                            })}
                            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white placeholder-gray-400 transition-all duration-200"
                            placeholder="Nombre del curso"
                          />
                          <button
                            onClick={() => handleEditCourse(course.idCourse, editingCourse.nameCourse)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium disabled:opacity-50"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingCourse(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{course.nameCourse}</h3>
                          <p className="text-sm text-gray-600">ID: {course.idCourse}</p>
                        </div>
                      )}
                    </div>
                    
                    {editingCourse?.idCourse !== course.idCourse && (
                      <div className="ml-4 flex space-x-2">
                        <button
                          onClick={() => setEditingCourse(course)}
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.idCourse)}
                          disabled={loading}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1 disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Eliminar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear curso */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Crear Nuevo Curso</h3>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setName('');
                    setError('');
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Nombre del curso <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white placeholder-gray-400 transition-all duration-200"
                    placeholder="Ej: Arquitectura de Software"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setName('');
                      setError('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creando...</span>
                      </>
                    ) : (
                      <span>Crear Curso</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
