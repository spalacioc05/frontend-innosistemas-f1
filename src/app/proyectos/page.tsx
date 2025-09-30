'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TeamsService, TeamResponse, CreateTeamRequest } from '@/services/teams';

// Lista global de proyectos (esto podría venir también de una API)
const GLOBAL_PROJECTS = [
  { id: 101, name: 'Sistema de Gestión Académica' },
  { id: 102, name: 'Aplicación Móvil para Biblioteca' },
  { id: 103, name: 'Portal de Estudiantes' },
  { id: 104, name: 'Plataforma de Evaluación Online' },
  { id: 105, name: 'Dashboard Administrativo' }
];

// Tipo para equipo local
type LocalTeam = { 
  id: string; 
  name: string; 
  members: { name: string; email: string }[];
  projectId: number;
  projectName: string;
};

// Mock de estudiantes disponibles
const AVAILABLE_STUDENTS = [
  { name: 'Sofia Hernández', email: 'sofia.hernandez@udea.edu.co' },
  { name: 'Miguel Torres', email: 'miguel.torres@udea.edu.co' },
  { name: 'Camila Vargas', email: 'camila.vargas@udea.edu.co' },
  { name: 'Diego Morales', email: 'diego.morales@udea.edu.co' },
  { name: 'Valentina Castro', email: 'valentina.castro@udea.edu.co' },
  { name: 'Sebastián Jiménez', email: 'sebastian.jimenez@udea.edu.co' },
  { name: 'Isabella Ramírez', email: 'isabella.ramirez@udea.edu.co' },
  { name: 'Andrés Gutierrez', email: 'andres.gutierrez@udea.edu.co' }
];

export default function ProyectosPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [teams, setTeams] = useState<LocalTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTeamsForProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allTeams = await TeamsService.getAllTeams();
      // Filtrar equipos por proyecto seleccionado
      const projectTeams = allTeams
        .filter(team => team.projectId === selectedProjectId)
        .map((team, index) => ({
          id: `team-${team.projectId}-${index}`,
          name: team.nameTeam,
          members: team.students.map(student => ({
            name: student.nameUser,
            email: student.email
          })),
          projectId: team.projectId,
          projectName: team.projectName
        }));
      setTeams(projectTeams);
    } catch (err) {
      setError('Error al cargar los equipos');
      console.error('Error loading teams:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  // Cargar equipos cuando se selecciona un proyecto
  useEffect(() => {
    if (selectedProjectId) {
      loadTeamsForProject();
    } else {
      setTeams([]);
    }
  }, [selectedProjectId, loadTeamsForProject]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim() || !selectedProjectId || selectedMembers.length < 2) {
      alert('Debe ingresar un nombre para el equipo y seleccionar al menos 2 estudiantes');
      return;
    }

    const selectedProject = GLOBAL_PROJECTS.find(p => p.id === selectedProjectId);
    if (!selectedProject) return;

    // Convertir emails seleccionados a objetos de estudiante
    const selectedStudents = selectedMembers.map(email => {
      const student = AVAILABLE_STUDENTS.find(s => s.email === email);
      return {
        email: email,
        nameUser: student?.name || email
      };
    });

    const teamData: CreateTeamRequest = {
      nameTeam: newTeamName,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      courseId: 2025, // Podrías hacerlo dinámico
      students: selectedStudents
    };

    try {
      setLoading(true);
      await TeamsService.createTeam(teamData);
      alert(`Equipo "${newTeamName}" creado exitosamente`);
      setShowCreateTeam(false);
      setNewTeamName('');
      setSelectedMembers([]);
      // Recargar equipos
      await loadTeamsForProject();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      alert(`Error al crear el equipo: ${errorMessage}`);
      console.error('Error creating team:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
  <h1 className="text-3xl font-bold mb-6 text-black">Proyectos</h1>
      <div className="mb-8">
  <label className="block text-lg font-semibold mb-2 text-black">Selecciona un proyecto:</label>
        <select
          value={selectedProjectId}
          onChange={e => setSelectedProjectId(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full max-w-md px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-700 focus:border-blue-700 border-gray-700 text-black font-semibold bg-white"
        >
          <option value="">-- Selecciona --</option>
          {GLOBAL_PROJECTS.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      {selectedProjectId && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-black">Equipos en el proyecto</h2>
          
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando equipos...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-800">{error}</p>
              <button
                onClick={loadTeamsForProject}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Intentar nuevamente
              </button>
            </div>
          )}

          {!loading && !error && teams.length > 0 ? (
            <ul className="mb-4">
              {teams.map(team => (
                <li key={team.id} className="mb-2 p-3 bg-white rounded-lg border border-gray-700 flex justify-between items-center">
                  <span className="font-bold text-black">{team.name}</span>
                  <span className="text-sm text-blue-700 font-semibold">
                    Miembros: {team.members.map(m => m.name).join(', ')}
                  </span>
                  <button className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 font-bold shadow border border-blue-300">
                    Unirse
                  </button>
                </li>
              ))}
            </ul>
          ) : !loading && !error ? (
            <p className="text-black mb-4">No hay equipos en este proyecto.</p>
          ) : null}
          
          <button
            onClick={() => setShowCreateTeam(true)}
            disabled={loading}
            className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 font-bold shadow border border-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Crear Nuevo Equipo
          </button>
        </div>
      )}

      {/* Modal para crear equipo */}
      {showCreateTeam && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-black">Crear Equipo en Proyecto</h3>
            <label className="block mb-2 font-semibold text-black">Nombre del equipo</label>
            <input
              type="text"
              value={newTeamName}
              onChange={e => setNewTeamName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-700 rounded mb-4 text-black font-semibold bg-white"
              placeholder="Nombre del equipo"
            />
            <label className="block mb-2 font-semibold text-black">Selecciona estudiantes</label>
            <select
              multiple
              value={selectedMembers}
              onChange={e => setSelectedMembers(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full px-3 py-2 border border-gray-700 rounded mb-4 h-32 text-black font-semibold bg-white"
            >
              {AVAILABLE_STUDENTS.map(student => (
                <option key={student.email} value={student.email}>{student.name}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateTeam(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 border border-gray-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTeam}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 border border-blue-300 font-semibold"
              >
                Crear Equipo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
