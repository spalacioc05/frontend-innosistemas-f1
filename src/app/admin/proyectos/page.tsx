"use client";

import { useEffect, useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectsService } from '@/services/projects';
import { CoursesService } from '@/services/courses';
import type { ProjectDto, CourseDto, CreateProjectForm } from '@/types';

interface CourseOption { id: string; name: string; }

export default function AdminProyectosPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectDto | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  
  // UI states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Load projects and courses on component mount
  useEffect(() => {
    loadProjects();
    loadCourses();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ProjectsService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await CoursesService.getAllCourses();
      setCourses(data.map((c: CourseDto) => ({ id: c.idCourse.toString(), name: c.nameCourse })));
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
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
      await ProjectsService.createProject({ 
        nameProject: name.trim(), 
        descriptions: description.trim(),
        courseId: parseInt(courseId)
      });
      setSuccess('Proyecto creado exitosamente');
      setName('');
      setDescription('');
      setCourseId('');
      setShowCreateForm(false);
      await loadProjects();
    } catch (e) {
      console.error(e);
      setError('Ocurrió un error al crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = async (id: number, newName: string, newDescription: string, newCourseId: number) => {
    if (!newName.trim()) {
      setError('El nombre del proyecto no puede estar vacío');
      return;
    }

    setLoading(true);
    try {
      await ProjectsService.updateProject(id, {
        nameProject: newName.trim(),
        descriptions: newDescription.trim(),
        courseId: newCourseId
      });
      setEditingProject(null);
      setSuccess('Proyecto actualizado exitosamente');
      await loadProjects();
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      setError('Error al actualizar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      return;
    }

    setLoading(true);
    try {
      await ProjectsService.deleteProject(projectId);
      await loadProjects();
      setSuccess('Proyecto eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      let errorMessage = 'Error al eliminar el proyecto';
      
      if (error instanceof Error) {
        if (error.message.includes('ya está eliminado')) {
          errorMessage = 'ℹ️ Este proyecto ya fue eliminado anteriormente. Actualizando vista...';
          setTimeout(async () => {
            await loadProjects();
            setSuccess('✅ Lista actualizada - Solo se muestran proyectos activos');
            setError('');
          }, 1500);
        } else if (error.message.includes('No se encontró')) {
          errorMessage = '⚠️ El proyecto no existe o ya fue eliminado. Actualizando vista...';
          setTimeout(async () => {
            await loadProjects();
            setSuccess('✅ Lista actualizada');
            setError('');
          }, 1500);
        } else {
          errorMessage = `❌ Error al eliminar el proyecto: ${error.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Administra todos los proyectos del sistema de ingeniería
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
                  <span>Crear Proyecto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Alert Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h3 className="text-lg font-medium text-gray-900">Lista de Proyectos</h3>
                <p className="mt-2 text-sm text-gray-700">
                  Gestiona y administra todos los proyectos del sistema
                </p>
              </div>
            </div>

            {loading && projects.length === 0 ? (
              <div className="mt-6 text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-500">Cargando proyectos...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="mt-6 text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No hay proyectos</h3>
                <p className="mt-2 text-gray-500">Comienza creando tu primer proyecto.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Crear Proyecto
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      {editingProject?.id === project.id ? (
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={editingProject.name}
                            onChange={(e) => setEditingProject({
                              ...editingProject,
                              name: e.target.value
                            })}
                            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white placeholder-gray-400 transition-all duration-200"
                            placeholder="Nombre del proyecto"
                          />
                          <button
                            onClick={() => handleEditProject(project.id, editingProject.name, editingProject.name, 1)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium disabled:opacity-50"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingProject(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 
                              className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                              onClick={() => setEditingProject(project)}
                            >
                              {project.name}
                            </h4>
                            <p className="text-sm text-gray-500">ID: {project.id}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingProject(project)}
                              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              disabled={loading}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1 disabled:opacity-50"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Crear Nuevo Proyecto</h3>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setName('');
                    setDescription('');
                    setCourseId('');
                    setError('');
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Nombre del proyecto <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white placeholder-gray-400 transition-all duration-200"
                    placeholder="Ej: Sistema de reservas"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Descripción <span className="text-red-600 font-bold">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white placeholder-gray-400 transition-all duration-200 resize-none"
                    rows={4}
                    placeholder="Descripción detallada del proyecto, objetivos, alcance..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Curso <span className="text-red-600 font-bold">*</span>
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white appearance-none"
                    required
                  >
                    <option value="">Selecciona un curso</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setName('');
                      setDescription('');
                      setCourseId('');
                      setError('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creando...' : 'Crear Proyecto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
