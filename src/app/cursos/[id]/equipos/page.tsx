'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import NavBar from '../../../../components/layout/NavBar';
import { SOFTWARE_ENGINEERING_COURSES } from '@/types';
import EditTeamModal from '@/components/equipos/EditTeamModal';

interface TeamWithDetails {
  id: string;
  name: string;
  members: {
    id: string;
    name: string;
    email: string;
    skills: string[];
  }[];
  project: string;
  progress: number;
  status: 'forming' | 'active' | 'completed';
  createdAt: Date;
  frontend: string;
}

export default function EquiposPage() {
  const params = useParams();
  const courseId = params.id as string;
  
  const course = SOFTWARE_ENGINEERING_COURSES.find(c => c.id === courseId);

  // Estado para modal de creación y edición
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamWithDetails | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  
  // Datos mock para equipos
  const [teams, setTeams] = useState<TeamWithDetails[]>([
    {
      id: '1',
      name: 'Equipo Alpha',
      members: [
        { id: '1', name: 'Juan Pérez', email: 'juan.perez@udea.edu.co', skills: ['React', 'Node.js'] },
        { id: '2', name: 'María García', email: 'maria.garcia@udea.edu.co', skills: ['Python', 'Django'] },
        { id: '3', name: 'Carlos López', email: 'carlos.lopez@udea.edu.co', skills: ['Java', 'Spring'] }
      ],
      project: 'Sistema de Gestión Académica',
      progress: 75,
      status: 'active' as const,
      createdAt: new Date('2024-01-15'),
      frontend: 'React + TypeScript'
    },
    {
      id: '2',
      name: 'Equipo Beta',
      members: [
        { id: '4', name: 'Ana Rodríguez', email: 'ana.rodriguez@udea.edu.co', skills: ['Vue.js', 'PHP'] },
        { id: '5', name: 'Luis Martínez', email: 'luis.martinez@udea.edu.co', skills: ['Angular', 'C#'] }
      ],
      project: 'Aplicación Móvil para Biblioteca',
      progress: 45,
      status: 'forming' as const,
      createdAt: new Date('2024-01-20'),
      frontend: 'Vue.js + Nuxt'
    },
    {
      id: '3',
      name: 'Equipo Gamma',
      members: [
        { id: '6', name: 'Elena Ruiz', email: 'elena.ruiz@udea.edu.co', skills: ['React', 'GraphQL'] },
        { id: '7', name: 'Jorge Pérez', email: 'jorge.perez@udea.edu.co', skills: ['Next.js', 'MongoDB'] },
        { id: '8', name: 'Roberto Silva', email: 'roberto.silva@udea.edu.co', skills: ['TypeScript', 'AWS'] }
      ],
      project: 'Portal de Estudiantes',
      progress: 90,
      status: 'completed' as const,
      createdAt: new Date('2024-01-10'),
      frontend: 'Next.js + TypeScript'
    }
  ]);

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      const newTeam = {
        id: Date.now().toString(),
        name: newTeamName.trim(),
        members: [],
        project: 'Proyecto sin asignar',
        progress: 0,
        status: 'forming' as const,
        createdAt: new Date(),
        frontend: 'Por definir'
      };
      setTeams([...teams, newTeam]);
      setNewTeamName('');
      setShowCreateModal(false);
    }
  };

  const handleEditTeam = (team: TeamWithDetails) => {
    setSelectedTeam(team);
    setShowEditModal(true);
  };

  const handleSaveTeam = (updatedTeam: TeamWithDetails) => {
    setTeams(teams.map(team => 
      team.id === updatedTeam.id ? { ...updatedTeam, createdAt: team.createdAt } : team
    ));
    setShowEditModal(false);
    setSelectedTeam(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'forming':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'forming':
        return 'En Formación';
      case 'active':
        return 'Activo';
      case 'completed':
        return 'Completado';
      default:
        return 'Desconocido';
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h1>
            <Link href="/cursos" className="text-blue-600 hover:text-blue-800">
            Volver a cursos
          </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
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
                    <Link href={`/cursos/${courseId}`} className="text-gray-700 hover:text-blue-600 ml-1 md:ml-2">
                      {course.name}
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500 ml-1 md:ml-2">Equipos</span>
                  </div>
                </li>
              </ol>
            </nav>
            
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestión de Equipos
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  {course.name} - {teams.length} equipos registrados
                </p>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                + Crear Equipo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Equipos</p>
                <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teams.filter(t => t.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En Formación</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teams.filter(t => t.status === 'forming').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teams.reduce((total, team) => total + team.members.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de equipos */}
        <div className="grid gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {team.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(team.status)}`}>
                      {getStatusText(team.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditTeam(team)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                    <Link
                      href={`/cursos/${courseId}/equipos/${team.id}`}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Ver Detalles
                    </Link>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Proyecto</h4>
                    <p className="text-gray-900">{team.project}</p>
                    
                    <h4 className="text-sm font-medium text-gray-500 mt-4 mb-2">Frontend</h4>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {team.frontend}
                    </span>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progreso del Proyecto</span>
                        <span>{team.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${team.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      Miembros del Equipo ({team.members.length}/{course.maxTeamSize})
                    </h4>
                    
                    {team.members.length > 0 ? (
                      <div className="space-y-3">
                        {team.members.map((member) => (
                          <div key={member.id} className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {member.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {member.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {member.email}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {member.skills.map((skill, index) => (
                                  <span 
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No hay miembros asignados al equipo
                      </p>
                    )}
                    
                    {team.members.length < course.maxTeamSize && (
                      <button 
                        onClick={() => handleEditTeam(team)}
                        className="mt-3 w-full border-2 border-dashed border-gray-300 rounded-lg py-2 px-4 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                      >
                        + Agregar Miembro
                      </button>
                    )}
                  </div>
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
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Crear Primer Equipo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de edición de equipo */}
      {showEditModal && selectedTeam && (
        <EditTeamModal
          team={{
            id: selectedTeam.id,
            name: selectedTeam.name,
            courseId: courseId,
            members: selectedTeam.members,
            projectId: undefined,
            status: selectedTeam.status,
            createdAt: selectedTeam.createdAt,
            updatedAt: new Date()
          }}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTeam(null);
          }}
          onSave={(updatedTeam) => {
            const teamUpdate: TeamWithDetails = {
              id: updatedTeam.id,
              name: updatedTeam.name,
              members: updatedTeam.members,
              project: selectedTeam.project,
              progress: selectedTeam.progress,
              status: selectedTeam.status,
              createdAt: selectedTeam.createdAt,
              frontend: selectedTeam.frontend
            };
            handleSaveTeam(teamUpdate);
          }}
          maxTeamSize={course.maxTeamSize}
          minTeamSize={course.minTeamSize}
        />
      )}

      {/* Modal de creación de equipo */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Crear Nuevo Equipo
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Equipo
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Equipo Alpha"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateTeam}
                  disabled={!newTeamName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear Equipo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}