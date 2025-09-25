'use client';

import { useState } from 'react';
import Link from 'next/link';

// Lista global de proyectos
const GLOBAL_PROJECTS = [
  { id: 'p1', name: 'Sistema de Gestión Académica' },
  { id: 'p2', name: 'Aplicación Móvil para Biblioteca' },
  { id: 'p3', name: 'Portal de Estudiantes' },
  { id: 'p4', name: 'Plataforma de Evaluación Online' },
  { id: 'p5', name: 'Dashboard Administrativo' }
];

// Mock de equipos por proyecto
type Team = { id: string; name: string; members: string[] };
type TeamsByProject = {
  [key: string]: Team[];
};
const MOCK_TEAMS: TeamsByProject = {
  p1: [
    { id: 't1', name: 'Equipo Alpha', members: ['Juan Pérez', 'María García'] },
    { id: 't2', name: 'Equipo Beta', members: ['Ana Rodríguez'] }
  ],
  p2: [
    { id: 't3', name: 'Equipo Gamma', members: ['Elena Ruiz'] }
  ],
  p3: [],
  p4: [],
  p5: []
};

// Mock de estudiantes disponibles
const AVAILABLE_STUDENTS = [
  'Sofia Hernández', 'Miguel Torres', 'Camila Vargas', 'Diego Morales', 'Valentina Castro', 'Sebastián Jiménez', 'Isabella Ramírez', 'Andrés Gutierrez'
];

export default function ProyectosPage() {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const teams: Team[] = selectedProjectId && MOCK_TEAMS[selectedProjectId] ? MOCK_TEAMS[selectedProjectId] : [];

  const handleCreateTeam = () => {
    if (newTeamName.trim() && selectedProjectId) {
      // Aquí iría la lógica real para guardar el equipo
      alert(`Equipo "${newTeamName}" creado en el proyecto ${selectedProjectId} con miembros: ${selectedMembers.join(', ')}`);
      setShowCreateTeam(false);
      setNewTeamName('');
      setSelectedMembers([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
  <h1 className="text-3xl font-bold mb-6 text-black">Proyectos</h1>
      <div className="mb-8">
  <label className="block text-lg font-semibold mb-2 text-black">Selecciona un proyecto:</label>
        <select
          value={selectedProjectId}
          onChange={e => setSelectedProjectId(e.target.value)}
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
          {teams.length > 0 ? (
            <ul className="mb-4">
              {teams.map(team => (
                <li key={team.id} className="mb-2 p-3 bg-white rounded-lg border border-gray-700 flex justify-between items-center">
                  <span className="font-bold text-black">{team.name}</span>
                  <span className="text-sm text-blue-700 font-semibold">Miembros: {team.members.join(', ')}</span>
                  <button className="ml-4 px-3 py-1 bg-blue-700 text-white rounded-lg hover:bg-blue-900 font-bold shadow">Unirse</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-black mb-4">No hay equipos en este proyecto.</p>
          )}
          <button
            onClick={() => setShowCreateTeam(true)}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-900 font-bold shadow"
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
                <option key={student} value={student}>{student}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateTeam(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTeam}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
