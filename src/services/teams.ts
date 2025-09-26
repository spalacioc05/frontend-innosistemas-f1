const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface TeamResponse {
  idTeam: number;
  nameTeam: string;
  projectId: number;
  projectName: string;
  courseId: number;
  students: {
    email: string;
    nameUser: string;
  }[];
}

export interface Project {
  id: number;
  name: string;
}

export interface User {
  email: string;
  nameUser: string;
}

export interface CreateTeamRequest {
  nameTeam: string;
  projectId: number;
  projectName: string;
  courseId: number;
  students: {
    email: string;
    nameUser: string;
  }[];
}

export class TeamsService {
  /**
   * Obtiene los equipos de un usuario por su email
   */
  static async getUserTeams(email: string): Promise<TeamResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/team/user/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user teams:', error);
      throw error;
    }
  }



  /**
   * Obtiene todos los equipos
   */
  static async getAllTeams(): Promise<TeamResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/team/getAllTeam`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all teams:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo equipo
   */
  static async createTeam(teamData: CreateTeamRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/team/createTeam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  /**
   * Elimina un equipo por su ID
   */
  static async deleteTeam(teamId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/team/deleteTeam/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }
}

export class ProjectsService {
  /**
   * Obtiene todos los proyectos
   */
  static async getAllProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/project/getAllProjects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
}

export class UsersService {
  /**
   * Obtiene todos los usuarios
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/getAllUsers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}