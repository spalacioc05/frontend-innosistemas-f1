// Tipos para el sistema Innosistemas - Adaptados al backend Java Spring Boot

// Tipos de autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserInfo {
  email: string;
  name: string;
  role: string;
  permissions: Permission[];
}

export interface Permission {
  namePermission: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  email: string;
}

// Entidades principales
export interface UserDto {
  email: string;
  nameUser: string;
}

export interface UserWithRoleDto {
  email: string;
  nameUser: string;
  role: string;
}

export interface CreateUserDto {
  email: string;
  nameUser: string;
  password: string;
}

export interface CourseDto {
  idCourse: number;
  nameCourse: string;
}

export interface TeamDto {
  idTeam: number;
  nameTeam: string;
  projectId: number;
}

export interface TeamShowDto {
  idTeam: number;
  nameTeam: string;
  projectId: number;
  projectName: string;
  courseId: number;
  students: UserDto[];
}

export interface ProjectDto {
  id: number;
  name: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
  status?: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path?: string;
}

// Tipos para formularios
export interface CreateTeamForm {
  nameTeam: string;
  projectId: number;
}

export interface CreateCourseForm {
  nameCourse: string;
  semester: number;
  status: boolean;
}

export interface CreateProjectForm {
  nameProject: string;
  descriptions: string;
  courseId: number;
}

// Tipos para autenticación y contexto
export interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Aliases para compatibilidad con el código existente
export type AuthResponse = TokenResponse;
export type LoginPayload = LoginRequest;
export type RegisterPayload = CreateUserDto;

// Constantes para cursos de ingeniería de software
export const SOFTWARE_ENGINEERING_COURSES = [
  {
    idCourse: 1,
    nameCourse: "Fundamentos de Programación",
    semester: 1,
    status: true
  },
  {
    idCourse: 2,
    nameCourse: "Estructuras de Datos",
    semester: 2,
    status: true
  },
  {
    idCourse: 3,
    nameCourse: "Algoritmos y Complejidad",
    semester: 3,
    status: true
  },
  {
    idCourse: 4,
    nameCourse: "Ingeniería de Software I",
    semester: 4,
    status: true
  },
  {
    idCourse: 5,
    nameCourse: "Bases de Datos",
    semester: 4,
    status: true
  },
  {
    idCourse: 6,
    nameCourse: "Ingeniería de Software II",
    semester: 5,
    status: true
  },
  {
    idCourse: 7,
    nameCourse: "Arquitectura de Software",
    semester: 6,
    status: true
  },
  {
    idCourse: 8,
    nameCourse: "Proyecto de Grado",
    semester: 8,
    status: true
  }
] as const;

// Tipos adicionales para el frontend
export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  courseId: string;
  creatorId: string;
  projectId: string;
  members: Student[];
  createdAt: Date;
}
