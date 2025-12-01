import { ApiClient } from '@/config/api';
import type { TeamDto, TeamShowDto, CreateTeamForm, UserDto } from '@/types';

export class TeamsService {

  static async createTeam(payload: CreateTeamForm): Promise<TeamDto> {
    return ApiClient.post<TeamDto>('/team', payload);
  }

  static async getAllTeams(): Promise<TeamShowDto[]> {
    return ApiClient.get<TeamShowDto[]>('/team/getAllTeam');
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
