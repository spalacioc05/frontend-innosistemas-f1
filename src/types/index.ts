// Tipos para la gestión de equipos de desarrollo

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'admin' | 'professor';
  createdAt: Date;
  updatedAt: Date;
}

export interface Student extends User {
  role: 'student';
  courseIds: string[]; // Un estudiante puede estar en múltiples cursos
  skills: string[];
  currentTeams: { [courseId: string]: string }; // courseId -> teamId mapping
}

export interface Course {
  id: string;
  name: string;
  semester: number;
  description: string;
  professor: string;
  maxTeamSize: number;
  minTeamSize: number;
  isActive: boolean;
}

export interface Team {
  id: string;
  name: string;
  courseId: string;
  creatorId: string; // ID del estudiante que creó el equipo
  members: Student[];
  projectId?: string;
  status: 'forming' | 'active' | 'completed' | 'incomplete';
  createdAt: Date;
  updatedAt: Date;
  isConfirmed: boolean; // Para la confirmación final del curso
}

export interface Project {
  id: string;
  title: string;
  description: string;
  courseId: string;
  teamId?: string;
  requirements: string[];
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  progress: number; // 0-100
}

export interface Notification {
  id: string;
  userId: string;
  type: 'team_assignment' | 'team_removal' | 'team_invitation' | 'team_dissolved' | 'project_update' | 'deadline_reminder' | 'team_incomplete';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  teamId?: string;
  courseId?: string;
  actionRequired?: boolean; // Para notificaciones que requieren acción
}

export interface TeamReport {
  teamId: string;
  teamName: string;
  courseName: string;
  memberCount: number;
  projectProgress: number;
  lastActivity: Date;
  status: Team['status'];
}

// Nueva interfaz para manejar las invitaciones de equipo
export interface TeamInvitation {
  id: string;
  teamId: string;
  invitedStudentId: string;
  invitedBy: string; // ID del estudiante que invita
  courseId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  expiresAt: Date;
}

// Interface para validaciones de equipo
export interface TeamValidation {
  isValid: boolean;
  errors: TeamValidationError[];
  warnings: TeamValidationWarning[];
}

export interface TeamValidationError {
  type: 'min_members' | 'max_members' | 'duplicate_membership' | 'different_course' | 'already_in_team';
  message: string;
  studentId?: string;
}

export interface TeamValidationWarning {
  type: 'incomplete_team' | 'pending_invitations';
  message: string;
}

// Interface para el contexto de usuario autenticado
export interface AuthContext {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Autenticación
export type Role = 'student' | 'admin' | 'professor';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  roleInProject: string; // Preferencia del usuario en los proyectos (p.ej., "Desarrollador", "QA")
  courseIds: string[];   // Cursos seleccionados en los que estará matriculado
}

// Cursos de Ingeniería de Software
export const SOFTWARE_ENGINEERING_COURSES: Course[] = [
  {
    id: 'is1',
    name: 'Introducción a la Ingeniería de Software',
    semester: 1,
    description: 'Fundamentos y conceptos básicos de la ingeniería de software',
    professor: 'Dr. Ana García',
    maxTeamSize: 3,
    minTeamSize: 2,
    isActive: true
  },
  {
    id: 'is2',
    name: 'Programación Orientada a Objetos',
    semester: 2,
    description: 'Principios y práticas de programación orientada a objetos',
    professor: 'Dr. Carlos López',
    maxTeamSize: 3,
    minTeamSize: 2,
    isActive: true
  },
  {
    id: 'is3',
    name: 'Estructuras de Datos y Algoritmos',
    semester: 3,
    description: 'Análisis y diseño de estructuras de datos y algoritmos eficientes',
    professor: 'Dra. María Rodríguez',
    maxTeamSize: 3,
    minTeamSize: 2,
    isActive: true
  },
  {
    id: 'is4',
    name: 'Bases de Datos',
    semester: 4,
    description: 'Diseño, implementación y gestión de sistemas de bases de datos',
    professor: 'Dr. Luis Martínez',
    maxTeamSize: 3,
    minTeamSize: 2,
    isActive: true
  },
  {
    id: 'is5',
    name: 'Ingeniería de Requisitos',
    semester: 5,
    description: 'Técnicas para el análisis y especificación de requisitos de software',
    professor: 'Dra. Elena Ruiz',
    maxTeamSize: 3,
    minTeamSize: 2,
    isActive: true
  },
  {
    id: 'is6',
    name: 'Arquitectura de Software',
    semester: 6,
    description: 'Diseño y evaluación de arquitecturas de sistemas de software',
    professor: 'Dr. Jorge Pérez',
    maxTeamSize: 3,
    minTeamSize: 2,
    isActive: true
  },
  {
    id: 'is7',
    name: 'Proyecto de Grado',
    semester: 7,
    description: 'Desarrollo integral de un proyecto de software',
    professor: 'Dr. Roberto Silva',
    maxTeamSize: 3,
    minTeamSize: 2,
    isActive: true
  }
];