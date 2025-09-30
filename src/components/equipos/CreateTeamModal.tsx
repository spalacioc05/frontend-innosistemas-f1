'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Student, Team, TeamValidation, TeamValidationError } from '@/types';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => void;
  courseId: string;
  maxTeamSize: number;
  minTeamSize: number;
}

// Mock students para demo
const MOCK_STUDENTS: Student[] = [
  {
    id: 'student2',
    name: 'María García',
    email: 'maria.garcia@udea.edu.co',
    role: 'student',
    courseIds: ['is1', 'is2'],
    skills: ['Python', 'Django', 'React'],
    currentTeams: {},
    avatar: undefined,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: 'student3',
    name: 'Carlos López',
    email: 'carlos.lopez@udea.edu.co',
    role: 'student',
    courseIds: ['is1', 'is3'],
    skills: ['Java', 'Spring', 'MySQL'],
    currentTeams: {},
    avatar: undefined,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: 'student4',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@udea.edu.co',
    role: 'student',
    courseIds: ['is1', 'is4'],
    skills: ['Vue.js', 'PHP', 'PostgreSQL'],
    currentTeams: {},
    avatar: undefined,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'student5',
    name: 'Luis Martínez',
    email: 'luis.martinez@udea.edu.co',
    role: 'student',
    courseIds: ['is1', 'is5'],
    skills: ['Angular', 'C#', '.NET'],
    currentTeams: {},
    avatar: undefined,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: 'student6',
    name: 'Elena Ruiz',
    email: 'elena.ruiz@udea.edu.co',
    role: 'student',
    courseIds: ['is1', 'is6'],
    skills: ['React', 'GraphQL', 'MongoDB'],
    currentTeams: { is1: 'team3' }, // Ya está en un equipo
    avatar: undefined,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

export default function CreateTeamModal({
  isOpen,
  onClose,
  onCreateTeam,
  courseId,
  maxTeamSize,
  minTeamSize
}: CreateTeamModalProps) {
  const { user } = useAuth();
  const [teamName, setTeamName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Student[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [validation, setValidation] = useState<TeamValidation>({ isValid: true, errors: [], warnings: [] });
  const [isCreating, setIsCreating] = useState(false);

  // Filtrar estudiantes disponibles para el curso
  useEffect(() => {
    if (isOpen) {
      const students = MOCK_STUDENTS.filter(student => 
        student.courseIds.includes(courseId) && 
        student.id !== user?.id && // Excluir al usuario actual
        !student.currentTeams[courseId] // Excluir estudiantes ya en equipos
      );
      setAvailableStudents(students);
    }
  }, [isOpen, courseId, user?.id]);

  const validateTeam = () => {
    const errors: TeamValidationError[] = [];
    
    // Validar nombre del equipo
    if (!teamName.trim()) {
      errors.push({
        type: 'min_members',
        message: 'El nombre del equipo es requerido'
      });
    }

    // Validar tamaño mínimo (incluyendo al creador)
    const totalMembers = selectedMembers.length + 1; // +1 por el creador
    if (totalMembers < minTeamSize) {
      errors.push({
        type: 'min_members',
        message: `El equipo debe tener mínimo ${minTeamSize} integrantes. Actualmente: ${totalMembers}`
      });
    }

    // Validar tamaño máximo
    if (totalMembers > maxTeamSize) {
      errors.push({
        type: 'max_members',
        message: `El equipo no puede tener más de ${maxTeamSize} integrantes. Actualmente: ${totalMembers}`
      });
    }

    // Verificar duplicados (aunque no debería pasar por el filtro)
    selectedMembers.forEach(member => {
      if (member.currentTeams[courseId]) {
        errors.push({
          type: 'already_in_team',
          message: `${member.name} ya pertenece a otro equipo en este curso`,
          studentId: member.id
        });
      }
    });

    setValidation({
      isValid: errors.length === 0,
      errors,
      warnings: []
    });
    setValidation({
      isValid: errors.length === 0,
      errors,
      warnings: []
    });
  };

  // Validar el equipo cuando cambie la selección
  useEffect(() => {
    validateTeam();
  }, [selectedMembers, teamName, validateTeam]);

  const handleToggleMember = (student: Student) => {
    setSelectedMembers(prev => {
      const isSelected = prev.find(m => m.id === student.id);
      
      if (isSelected) {
        // Remover del equipo
        return prev.filter(m => m.id !== student.id);
      } else {
        // Agregar al equipo si no se supera el máximo
        if (prev.length + 1 >= maxTeamSize) { // +1 por el creador
          return prev; // No agregar si ya se alcanzó el máximo
        }
        return [...prev, student];
      }
    });
  };

  const handleCreateTeam = async () => {
    if (!validation.isValid || !user) {
      return;
    }

    setIsCreating(true);

    try {
      // Simular creación del equipo
      await new Promise(resolve => setTimeout(resolve, 1000));

      const currentUser = user as Student;
      const allMembers = [currentUser, ...selectedMembers];

      const newTeam: Omit<Team, 'id' | 'createdAt' | 'updatedAt'> = {
        name: teamName.trim(),
        courseId,
        creatorId: currentUser.id,
        members: allMembers,
        status: 'forming',
        isConfirmed: false
      };

      onCreateTeam(newTeam);
      
      // Limpiar el formulario
      setTeamName('');
      setSelectedMembers([]);
      setSearchTerm('');
      
      onClose();
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Crear Nuevo Equipo
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nombre del equipo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Equipo *
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Equipo Alpha"
            maxLength={50}
          />
        </div>

        {/* Miembros seleccionados */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Miembros del Equipo ({selectedMembers.length + 1}/{maxTeamSize})
          </h4>
          
          {/* Creador del equipo */}
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Creador
              </span>
            </div>
          </div>

          {/* Miembros seleccionados */}
          {selectedMembers.map((member) => (
            <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.email}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {member.skills.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleToggleMember(member)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Buscar estudiantes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar Estudiantes Disponibles
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar por nombre, email o habilidad..."
          />
        </div>

        {/* Lista de estudiantes disponibles */}
        <div className="mb-6 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => {
              const isSelected = selectedMembers.find(m => m.id === student.id);
              const canSelect = !isSelected && (selectedMembers.length + 1) < maxTeamSize;
              
              return (
                <div 
                  key={student.id} 
                  className={`flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                    isSelected ? 'bg-blue-50' : ''
                  } ${!canSelect && !isSelected ? 'opacity-50' : ''}`}
                  onClick={() => canSelect || isSelected ? handleToggleMember(student) : null}
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {student.skills.slice(0, 3).map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {student.skills.length > 3 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          +{student.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm">No hay estudiantes disponibles</p>
              <p className="text-xs mt-1">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Todos los estudiantes ya están en equipos'}
              </p>
            </div>
          )}
        </div>

        {/* Errores de validación */}
        {validation.errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Errores de validación:
                </h3>
                <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={isCreating}
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateTeam}
            disabled={!validation.isValid || isCreating}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? 'Creando...' : 'Crear Equipo'}
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Información:</h3>
              <ul className="mt-1 text-sm text-blue-700 list-disc list-inside">
                <li>Los miembros seleccionados recibirán una notificación.</li>
                <li>El equipo estará en estado &quot;En Formación&quot; hasta la confirmación final.</li>
                <li>Podrás modificar el equipo antes de la confirmación del curso.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}