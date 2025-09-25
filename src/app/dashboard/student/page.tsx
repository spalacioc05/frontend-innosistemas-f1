'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/layout/NavBar';
import CreateTeamModal from '@/components/equipos/CreateTeamModal';
import TeamActionsModal from '@/components/equipos/TeamActionsModal';
import { SOFTWARE_ENGINEERING_COURSES, Team, Student, Notification } from '@/types';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showTeamActionsModal, setShowTeamActionsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  // Mock data para el estudiante
  const [myTeams, setMyTeams] = useState<Team[]>([
    {
      id: 'team1',
      name: 'Equipo Alpha',
      courseId: 'is1',
      creatorId: 'student1',
      members: [
        {
          id: 'student1',
          name: 'Juan Pérez',
          email: 'juan.perez@udea.edu.co',
          role: 'student',
          courseIds: ['is1'],
          skills: ['React', 'Node.js', 'MongoDB'],
          currentTeams: { is1: 'team1' },
          avatar: undefined,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 'student2',
          name: 'María García',
          email: 'maria.garcia@udea.edu.co',
          role: 'student',
          courseIds: ['is1'],
          skills: ['Python', 'Django', 'PostgreSQL'],
          currentTeams: { is1: 'team1' },
          avatar: undefined,
          createdAt: new Date('2024-01-16'),
          updatedAt: new Date('2024-01-16')
        }
      ],
      status: 'active',
      isConfirmed: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      userId: 'student1',
      type: 'team_assignment',
      title: 'Nuevo miembro en tu equipo',
      message: 'Carlos López se ha unido al Equipo Alpha',
      read: false,
      createdAt: new Date('2024-01-20T10:30:00'),
      teamId: 'team1',
      courseId: 'is1'
    },
    {
      id: '2',
      userId: 'student1',
      type: 'deadline_reminder',
      title: 'Fecha límite próxima',
      message: 'El proyecto del Equipo Alpha vence en 3 días',
      read: false,
      createdAt: new Date('2024-01-20T09:00:00'),
      teamId: 'team1',
      courseId: 'is1'
    }
  ]);

  // Filtrar cursos en los que el estudiante está inscrito
  const myCourses = SOFTWARE_ENGINEERING_COURSES.filter(course => 
    user && (user as Student).courseIds?.includes(course.id)
  );

  // Obtener estadísticas
  const stats = {
    totalTeams: myTeams.length,
    activeTeams: myTeams.filter(team => team.status === 'active').length,
    formingTeams: myTeams.filter(team => team.status === 'forming').length,
    completedTeams: myTeams.filter(team => team.status === 'completed').length,
    totalCourses: myCourses.length,
    unreadNotifications: notifications.filter(n => !n.read).length
  };

  const handleCreateTeam = (newTeam: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => {
    const team: Team = {
      ...newTeam,
      id: `team_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setMyTeams(prev => [...prev, team]);

    // Crear notificaciones para los miembros invitados
    const newNotifications = newTeam.members
      .filter(member => member.id !== user?.id)
      .map(member => ({
        id: `notif_${Date.now()}_${member.id}`,
        userId: member.id,
        type: 'team_invitation' as const,
        title: 'Invitación a equipo',
        message: `Has sido invitado al equipo "${newTeam.name}" por ${user?.name}`,
        read: false,
        createdAt: new Date(),
        teamId: team.id,
        courseId: newTeam.courseId,
        actionRequired: true
      }));

    // En una aplicación real, estas notificaciones se enviarían a través de una API
    console.log('Notificaciones enviadas:', newNotifications);
  };

  const handleLeaveTeam = (teamId: string, memberId: string) => {
    setMyTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        const updatedMembers = team.members.filter(member => member.id !== memberId);
        const newStatus = updatedMembers.length < 2 ? 'incomplete' : team.status;
        
        return {
          ...team,
          members: updatedMembers,
          status: newStatus as Team['status'],
          updatedAt: new Date()
        };
      }
      return team;
    }));

    // Crear notificaciones para los miembros restantes
    const team = myTeams.find(t => t.id === teamId);
    if (team) {
      const remainingMembers = team.members.filter(member => member.id !== memberId);
      const newNotifications = remainingMembers.map(member => ({
        id: `notif_${Date.now()}_${member.id}`,
        userId: member.id,
        type: 'team_removal' as const,
        title: 'Miembro abandonó el equipo',
        message: `${user?.name} ha abandonado el equipo "${team.name}"`,
        read: false,
        createdAt: new Date(),
        teamId: team.id,
        courseId: team.courseId
      }));

      console.log('Notificaciones de abandono enviadas:', newNotifications);
    }
  };

  const handleDissolveTeam = (teamId: string) => {
    const team = myTeams.find(t => t.id === teamId);
    if (team) {
      // Crear notificaciones para todos los miembros
      const newNotifications = team.members
        .filter(member => member.id !== user?.id)
        .map(member => ({
          id: `notif_${Date.now()}_${member.id}`,
          userId: member.id,
          type: 'team_dissolved' as const,
          title: 'Equipo disuelto',
          message: `El equipo "${team.name}" ha sido disuelto por ${user?.name}`,
          read: false,
          createdAt: new Date(),
          teamId: team.id,
          courseId: team.courseId
        }));

      console.log('Notificaciones de disolución enviadas:', newNotifications);
    }

    setMyTeams(prev => prev.filter(team => team.id !== teamId));
  };

  const openCreateTeamModal = (courseId: string) => {
    setSelectedCourse(courseId);
    setShowCreateTeamModal(true);
  };

  const openTeamActionsModal = (team: Team) => {
    setSelectedTeam(team);
    setShowTeamActionsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'forming':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'incomplete':
        return 'bg-red-100 text-red-800';
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
      case 'incomplete':
        return 'Incompleto';
      default:
        return 'Desconocido';
    }
  };

  if (!user || user.role !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
            <p className="text-gray-600 mb-4">Esta página es solo para estudiantes.</p>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
              Ir al Dashboard Principal
            </Link>
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
            <h1 className="text-3xl font-bold text-gray-900">
              Panel de Estudiante
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Bienvenido, {user.name} - Gestiona tus equipos y proyectos
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Mis Equipos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTeams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Equipos Activos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeTeams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Mis Cursos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m0 14v-5a2 2 0 012-2h5" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Notificaciones</p>
                <p className="text-3xl font-bold text-gray-900">{stats.unreadNotifications}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mis equipos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Mis Equipos
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {myTeams.map((team) => {
                  const course = SOFTWARE_ENGINEERING_COURSES.find(c => c.id === team.courseId);
                  const isCreator = team.creatorId === user.id;
                  
                  return (
                    <div key={team.id} className="px-6 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {team.name}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(team.status)}`}>
                            {getStatusText(team.status)}
                          </span>
                          {isCreator && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Creador
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/cursos/${team.courseId}/equipos/${team.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Ver Detalles
                          </Link>
                          <button
                            onClick={() => openTeamActionsModal(team)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                            {/* Solo el creador puede disolver */}
                            {team.creatorId === user.id && (
                              <button
                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                                onClick={() => handleDissolveTeam(team.id)}
                              >
                                Disolver equipo
                              </button>
                            )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {course?.name} • {team.members.length} miembros
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Creado: {team.createdAt.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Última actualización: {team.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {myTeams.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes equipos</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Crea un equipo o únete a uno existente.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Acciones rápidas y notificaciones */}
          <div className="space-y-6">
            {/* Crear equipos por curso */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Crear Equipo
                </h2>
              </div>
              <div className="p-6 space-y-3">
                {myCourses.map((course) => {
                  const hasTeamInCourse = myTeams.some(team => team.courseId === course.id);
                  
                  return (
                    <button
                      key={course.id}
                      onClick={() => openCreateTeamModal(course.id)}
                      disabled={hasTeamInCourse}
                      className={`w-full text-left p-3 rounded-lg border transition-colors font-semibold ${
                        hasTeamInCourse 
                          ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'border-gray-700 hover:border-blue-700 hover:bg-blue-100 text-black'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-black">{course.name}</h3>
                          <p className={`text-sm ${hasTeamInCourse ? 'text-gray-600' : 'text-blue-700 font-semibold'}`}> 
                            {hasTeamInCourse ? 'Ya tienes un equipo' : 'Crear equipo'}
                          </p>
                        </div>
                        {!hasTeamInCourse && (
                          <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notificaciones recientes */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Notificaciones
                </h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className={`px-6 py-4 ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.createdAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {notifications.length === 0 && (
                <div className="text-center py-8">
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m0 14v-5a2 2 0 012-2h5" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay notificaciones</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      {showCreateTeamModal && selectedCourse && (
        <CreateTeamModal
          isOpen={showCreateTeamModal}
          onClose={() => {
            setShowCreateTeamModal(false);
            setSelectedCourse('');
          }}
          onCreateTeam={handleCreateTeam}
          courseId={selectedCourse}
          maxTeamSize={SOFTWARE_ENGINEERING_COURSES.find(c => c.id === selectedCourse)?.maxTeamSize || 3}
          minTeamSize={SOFTWARE_ENGINEERING_COURSES.find(c => c.id === selectedCourse)?.minTeamSize || 2}
        />
      )}

      {showTeamActionsModal && selectedTeam && (
        <TeamActionsModal
          isOpen={showTeamActionsModal}
          onClose={() => {
            setShowTeamActionsModal(false);
            setSelectedTeam(null);
          }}
          team={selectedTeam}
          onLeaveTeam={handleLeaveTeam}
          onDissolveTeam={handleDissolveTeam}
          minTeamSize={SOFTWARE_ENGINEERING_COURSES.find(c => c.id === selectedTeam.courseId)?.minTeamSize || 2}
        />
      )}
    </div>
  );
}