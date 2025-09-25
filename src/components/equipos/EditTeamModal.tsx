import React, { useState } from 'react';

interface Student {
  id: string;
  name: string;
  email: string;
  skills: string[];
}

interface Team {
  id: string;
  name: string;
  courseId?: string;
  members: Student[];
  projectId?: string;
  project?: string;
  progress?: number;
  status: 'forming' | 'active' | 'completed';
  createdAt: Date;
  updatedAt?: Date;
  frontend?: string;
}

interface EditTeamModalProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTeam: Team) => void;
  maxTeamSize: number;
  minTeamSize: number;
}

// Lista global de proyectos y estudiantes (solo una vez)
const GLOBAL_PROJECTS: { id: string; name: string }[] = [
  { id: 'p1', name: 'Sistema de Gestión Académica' },
  { id: 'p2', name: 'Aplicación Móvil para Biblioteca' },
  { id: 'p3', name: 'Portal de Estudiantes' },
  { id: 'p4', name: 'Plataforma de Evaluación Online' },
  { id: 'p5', name: 'Dashboard Administrativo' }
];
const AVAILABLE_STUDENTS: Student[] = [
  { id: '9', name: 'Sofia Hernández', email: 'sofia.hernandez@udea.edu.co', skills: ['React', 'CSS'] },
  { id: '10', name: 'Miguel Torres', email: 'miguel.torres@udea.edu.co', skills: ['Vue.js', 'JavaScript'] },
  { id: '11', name: 'Camila Vargas', email: 'camila.vargas@udea.edu.co', skills: ['Angular', 'TypeScript'] },
  { id: '12', name: 'Diego Morales', email: 'diego.morales@udea.edu.co', skills: ['React Native', 'Node.js'] },
  { id: '13', name: 'Valentina Castro', email: 'valentina.castro@udea.edu.co', skills: ['Python', 'Django'] },
  { id: '14', name: 'Sebastián Jiménez', email: 'sebastian.jimenez@udea.edu.co', skills: ['Java', 'Spring Boot'] },
  { id: '15', name: 'Isabella Ramírez', email: 'isabella.ramirez@udea.edu.co', skills: ['PHP', 'Laravel'] },
  { id: '16', name: 'Andrés Gutierrez', email: 'andres.gutierrez@udea.edu.co', skills: ['C#', '.NET'] }
];

const FRONTEND_OPTIONS = [
  'React + TypeScript',
  'Vue.js + Nuxt',
  'Next.js + TypeScript',
  'Angular',
  'Svelte',
  'React Native',
  'Flutter',
  'Por definir'
];

export default function EditTeamModal({ 
  team, 
  isOpen, 
  onClose, 
  onSave, 
  maxTeamSize, 
  minTeamSize 
}: EditTeamModalProps) {
  const [editedTeam, setEditedTeam] = useState<Team>(team);
  const [showAddMember, setShowAddMember] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filtrar estudiantes que no están en el equipo
  const availableStudents = AVAILABLE_STUDENTS.filter(
    student => !editedTeam.members.find(member => member.id === student.id)
  );

  const validateTeam = () => {
    const newErrors: { [key: string]: string } = {};

    if (!editedTeam.name.trim()) {
      newErrors.name = 'El nombre del equipo es requerido';
    }

    if (editedTeam.members.length < minTeamSize) {
      newErrors.members = `El equipo debe tener al menos ${minTeamSize} miembros`;
    }

    if (editedTeam.members.length > maxTeamSize) {
      newErrors.members = `El equipo no puede tener más de ${maxTeamSize} miembros`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateTeam()) {
      onSave(editedTeam);
      onClose();
    }
  };

  const handleAddMember = (student: Student) => {
    if (editedTeam.members.length < maxTeamSize) {
      setEditedTeam({
        ...editedTeam,
        members: [...editedTeam.members, student]
      });
      setShowAddMember(false);
      setErrors({ ...errors, members: '' });
    }
  };

  const handleRemoveMember = (studentId: string) => {
    setEditedTeam({
      ...editedTeam,
      members: editedTeam.members.filter(member => member.id !== studentId)
    });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Editar Equipo
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-6">
          {/* Información básica del equipo */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Equipo
              </label>
              <input
                type="text"
                value={editedTeam.name}
                onChange={(e) => setEditedTeam({ ...editedTeam, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nombre del equipo"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proyecto
            </label>
            <select
              value={editedTeam.projectId || ''}
              onChange={e => {
                const selected = GLOBAL_PROJECTS.find(p => p.id === e.target.value);
                setEditedTeam({
                  ...editedTeam,
                  projectId: selected?.id,
                  project: selected?.name || ''
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona un proyecto</option>
              {GLOBAL_PROJECTS.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          {/* Gestión de miembros */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Miembros del Equipo ({editedTeam.members.length}/{maxTeamSize})
                </h4>
                {errors.members && (
                  <p className="mt-1 text-sm text-red-600">{errors.members}</p>
                )}
              </div>
              
              {editedTeam.members.length < maxTeamSize && availableStudents.length > 0 && (
                <button
                  onClick={() => setShowAddMember(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  + Agregar Miembro
                </button>
              )}
            </div>

            {/* Lista de miembros actuales */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {editedTeam.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                      <div>
                        <p className="text-base font-semibold text-black">{member.name}</p>
                        <p className="text-xs text-gray-700">{member.email}</p>
                      </div>
                  </div>
                  {editedTeam.members.length > minTeamSize && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Remover miembro"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {editedTeam.members.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No hay miembros en el equipo</p>
                <p className="text-sm">Agrega al menos {minTeamSize} miembros</p>
              </div>
            )}
          </div>

          {/* Modal para agregar miembro */}
          {showAddMember && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[60]">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">
                      Agregar Miembro
                    </h4>
                    <button
                      onClick={() => setShowAddMember(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {availableStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => handleAddMember(student)}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {availableStudents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay estudiantes disponibles</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}