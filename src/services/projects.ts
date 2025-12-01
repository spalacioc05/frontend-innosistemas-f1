import { ApiClient } from '@/config/api';
import type { ProjectDto, CreateProjectForm, UserDto } from '@/types';

export class ProjectsService {
  static async createProject(payload: CreateProjectForm): Promise<ProjectDto> {
    return ApiClient.post<ProjectDto>('/project', payload);
  }

  static async getAllProjects(): Promise<ProjectDto[]> {
    return ApiClient.get<ProjectDto[]>('/project/getAllProjects');
  }

  static async getProjectById(id: number): Promise<ProjectDto> {
    return ApiClient.get<ProjectDto>(`/project/getProject/${id}`);
  }

  static async updateProject(id: number, payload: CreateProjectForm): Promise<any> {
    const updatePayload = {
      projectId: id,
      ...payload
    };
    return ApiClient.put<any>('/project/updateProject', updatePayload);
  }

  static async deleteProject(id: number): Promise<any> {
    return ApiClient.delete<any>(`/project/deleteProject/${id}`);
  }

  static async getUsersInOneTeam(projectId: number): Promise<UserDto[]> {
    return ApiClient.get<UserDto[]>(`/project/${projectId}/users/single-team`);
  }
}
