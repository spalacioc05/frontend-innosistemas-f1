import { ApiClient } from '@/config/api';
import type { TeamDto, TeamShowDto, CreateTeamForm, UserDto } from '@/types';

export class TeamsService {

  static async createTeam(payload: CreateTeamForm): Promise<TeamDto> {
    return ApiClient.post<TeamDto>('/team', payload);
  }

  /**
   * Obtener equipos con soporte de query params: search, courseId, status, sort
   * status = 'formed' | 'incomplete'
   * sort = 'course' | 'name' | 'state'
   */
  static async getAllTeams(params?: { search?: string; courseId?: string; status?: string; sort?: string; minSize?: number }): Promise<TeamShowDto[]> {
    const qs = [] as string[];
    if (params) {
      if (params.search) qs.push(`search=${encodeURIComponent(params.search)}`);
      if (params.courseId) qs.push(`courseId=${encodeURIComponent(params.courseId)}`);
      if (params.status) qs.push(`status=${encodeURIComponent(params.status)}`);
      if (params.sort) qs.push(`sort=${encodeURIComponent(params.sort)}`);
      if (params.minSize) qs.push(`minSize=${encodeURIComponent(String(params.minSize))}`);
    }
    const endpoint = `/team/getAllTeam${qs.length ? `?${qs.join('&')}` : ''}`;
    return ApiClient.get<TeamShowDto[]>(endpoint);
  }

  static async getTeamById(id: string): Promise<TeamDto> {
    return ApiClient.get<TeamDto>(`/team/getTeam/${id}`);
  }

  static async updateTeam(id: string, payload: CreateTeamForm): Promise<TeamDto> {
    return ApiClient.put<TeamDto>(`/team/updateTeam/${id}`, payload);
  }

  static async deleteTeam(id: string): Promise<void> {
    return ApiClient.delete<void>(`/team/deleteTeam/${id}`);
  }

  static async addUserToTeam(teamId: string, userId: string): Promise<void> {
    return ApiClient.post<void>(`/team/${teamId}/addUser/${userId}`, {});
  }

  static async removeUserFromTeam(teamId: string, userId: string): Promise<void> {
    return ApiClient.delete<void>(`/team/${teamId}/removeUser/${userId}`);
  }

  static async getTeamMembers(teamId: string): Promise<UserDto[]> {
    return ApiClient.get<UserDto[]>(`/team/${teamId}/members`);
  }
}