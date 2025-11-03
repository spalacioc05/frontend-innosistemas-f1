'use client';

import { useEffect, useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import { Team, Student, SOFTWARE_ENGINEERING_COURSES, TeamShowDto, ProjectDto, UserDto, CreateTeamForm } from '@/types';
import { TeamsService } from '@/services/teams';
import { ProjectsService } from '@/services/projects';
import { UsersService } from '@/services/users';

// Función para convertir TeamShowDto a Team
// Nota: teamResponse.projectId y teamResponse.projectName se reciben del backend pero NO se muestran en la UI
const mapTeamResponseToTeam = (teamResponse: TeamShowDto): Team => ({
  id: teamResponse.idTeam.toString(),
  name: teamResponse.nameTeam,
  courseId: teamResponse.courseId.toString(),
  creatorId: teamResponse.students[0]?.email || '',
  projectId: teamResponse.projectId.toString(), // Incluir projectId para edición
  createdAt: new Date(), // Fecha por defecto (el backend no proporciona esta información)
  members: teamResponse.students.map((student, idx) => ({
    id: idx.toString(),
    name: student.nameUser,
    email: student.email
  }))
});

export default function EquiposPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [formData, setFormData] = useState({
    nameTeam: '',
    projectId: '',
    selectedUsers: [] as string[] // Array de emails de usuarios seleccionados
  });

  useEffect(() => {
    loadAllTeams();
    loadProjects();
    loadUsers();
  }, []);

  const loadProjects = async () => {
    try {
      const projectList = await ProjectsService.getAllProjects();
      setProjects(projectList);
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const userList = await UsersService.getAllUsers();
      setUsers(userList);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const loadAllTeams = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener todos los equipos
      const teamResponses = await TeamsService.getAllTeams();
      
      // Log para verificar que se recibe projectId (solo para desarrollo)
      console.log('Equipos recibidos con projectId:', teamResponses.map(team => ({
        name: team.nameTeam,
        projectId: team.projectId,
        projectName: team.projectName
      })));
      
      const mappedTeams = teamResponses.map(mapTeamResponseToTeam);
      setTeams(mappedTeams);
    } catch (err) {
      setError('Error al cargar los equipos. Intenta nuevamente.');
      console.error('Error loading teams:', err);
      setTeams([]); // Fallback a array vacío
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const selectedProject = projects.find(p => p.id.toString() === formData.projectId);
      const selectedUsersList = users.filter(user => formData.selectedUsers.includes(user.email));
      
      if (editingTeam) {
        // Actualizar equipo existente
        const updateData: CreateTeamForm = {
          nameTeam: formData.nameTeam,
          projectId: parseInt(formData.projectId)
        };
        
        await TeamsService.updateTeam(editingTeam.id, updateData);
      } else {
        // Crear nuevo equipo
        await TeamsService.createTeam({
          nameTeam: formData.nameTeam,
          projectId: parseInt(formData.projectId)
        });
      }
      
      setShowCreateModal(false);
      setEditingTeam(null);
      setFormData({ 
        nameTeam: '', 
        projectId: '',
        selectedUsers: []
      });
      loadAllTeams(); // Recargar la lista
    } catch (err) {
      setError(editingTeam ? 'Error al actualizar el equipo. Intenta nuevamente.' : 'Error al crear el equipo. Intenta nuevamente.');
      console.error(editingTeam ? 'Error updating team:' : 'Error creating team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      return;
    }
    
    setLoading(true);
    try {
      await TeamsService.deleteTeam(teamId);
      loadAllTeams(); // Recargar la lista
    } catch (err) {
      setError('Error al eliminar el equipo. Intenta nuevamente.');
      console.error('Error deleting team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      nameTeam: team.name,
      projectId: team.projectId || '', // Usar el projectId del equipo
      selectedUsers: team.members.map(member => member.email)
    });
    setShowCreateModal(true);
  };

  const handleUserToggle = (userEmail: string) => {
    setFormData(prev => {
      const isCurrentlySelected = prev.selectedUsers.includes(userEmail);
      
      // Si está seleccionado, siempre permitir deseleccionar
      if (isCurrentlySelected) {
        return {
          ...prev,
          selectedUsers: prev.selectedUsers.filter(email => email !== userEmail)
        };
      }
      
      // Si no está seleccionado, solo permitir seleccionar si no se han alcanzado los 3 usuarios
      if (prev.selectedUsers.length < 3) {
        return {
          ...prev,
          selectedUsers: [...prev.selectedUsers, userEmail]
        };
      }
      
      // Si ya hay 3 usuarios seleccionados, no hacer nada
      return prev;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando equipos...</p>
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Todos los Equipos</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Visualiza todos los equipos de trabajo disponibles
                </p>
              </div>
              <div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Crear Equipo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
                <button
                  onClick={loadAllTeams}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Intentar nuevamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Equipos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Proyectos</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Miembros</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teams.reduce((total, team) => total + team.members.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Equipos */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Lista de Equipos</h2>
          </div>
          
          {teams.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay equipos disponibles</h3>
              <p className="text-gray-600 mb-4">
                Aún no se han creado equipos en el sistema
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {teams.map((team) => (
                <div key={team.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {team.members.length} miembros
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {SOFTWARE_ENGINEERING_COURSES.find(course => course.idCourse === parseInt(team.courseId))?.nameCourse || 'Descripción no disponible'}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {SOFTWARE_ENGINEERING_COURSES.find(course => course.idCourse === parseInt(team.courseId))?.nameCourse || 'Curso no encontrado'}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {team.members.length} miembros
                        </span>
                        <span>
                          Creado el {team.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleEditTeam(team)}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Miembros del equipo */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Miembros:</p>
                    <div className="flex flex-wrap gap-2">
                      {team.members.map((member) => (
                        <span
                          key={member.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {member.name}
                          {member.id === team.creatorId && ' (Líder)'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar equipo */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingTeam ? 'Editar Equipo' : 'Crear Nuevo Equipo'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTeam(null);
                    setFormData({ 
                      nameTeam: '', 
                      projectId: '',
                      selectedUsers: []
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateTeam} className="space-y-5">
                {/* Nombre del Equipo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Nombre del Equipo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nameTeam}
                    onChange={(e) => setFormData({ ...formData, nameTeam: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Ingresa el nombre del equipo"
                    required
                  />
                </div>

                {/* Selección de Proyecto */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Proyecto <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  >
                    <option value="" className="text-gray-500">Selecciona un proyecto</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id} className="text-gray-900">
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selección de Usuarios */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Miembros del Equipo <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      formData.selectedUsers.length >= 2 && formData.selectedUsers.length <= 3
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {formData.selectedUsers.length}/3 seleccionados
                    </span>
                  </div>
                  <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
                    {users.length === 0 ? (
                      <p className="text-gray-500 text-sm">Cargando usuarios...</p>
                    ) : (
                      users.map((user) => {
                        const isSelected = formData.selectedUsers.includes(user.email);
                        const isDisabled = !isSelected && formData.selectedUsers.length >= 3;
                        
                        return (
                          <label 
                            key={user.email} 
                            className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                              isDisabled 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-white cursor-pointer'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleUserToggle(user.email)}
                              disabled={isDisabled}
                              className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{user.nameUser}</p>
                              <p className="text-xs text-gray-600">{user.email}</p>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                  {(formData.selectedUsers.length < 2 || formData.selectedUsers.length > 3) && (
                    <p className="text-xs text-red-500 mt-1">
                      {formData.selectedUsers.length === 0 
                        ? 'Selecciona entre 2 y 3 miembros para el equipo'
                        : formData.selectedUsers.length === 1
                        ? 'Selecciona al menos un miembro más (mínimo 2, máximo 3)'
                        : 'Máximo 3 miembros permitidos, deselecciona algunos'
                      }
                    </p>
                  )}
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingTeam(null);
                      setFormData({ 
                        nameTeam: '', 
                        projectId: '',
                        selectedUsers: []
                      });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || formData.selectedUsers.length < 2 || formData.selectedUsers.length > 3}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Guardando...' : (editingTeam ? 'Actualizar' : 'Crear')}
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