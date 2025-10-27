import { ApiClient } from '@/config/api';

export interface CreateProjectPayload {
  name: string;
  description: string;
  courseId: string;
}

export interface ProjectDTO {
  id: string;
  name: string;
  description: string;
  courseId: string;
}

export class ProjectsServiceNew {
  static async createProject(payload: CreateProjectPayload): Promise<ProjectDTO> {
    // Ajusta el endpoint según el backend cuando esté disponible
    return ApiClient.post<ProjectDTO>('/project/createProject', payload);
  }

  static async existsByNameInCourse(courseId: string, name: string): Promise<{ exists: boolean }> {
    return ApiClient.get<{ exists: boolean }>(`/project/existsByName?courseId=${encodeURIComponent(courseId)}&name=${encodeURIComponent(name)}`);
  }

  static async listByCourse(courseId: string): Promise<ProjectDTO[]> {
    return ApiClient.get<ProjectDTO[]>(`/project/byCourse/${encodeURIComponent(courseId)}`);
  }
}
