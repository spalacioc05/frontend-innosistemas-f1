import { ApiClient } from '@/config/api';
import type { UserDto, UserWithRoleDto, CreateUserDto } from '@/types';

export interface UserStats {
  total: number;
  students: number;
  professors: number;
  administrators: number;
}

export class UsersService {
  static async getAllUsers(): Promise<UserWithRoleDto[]> {
    return ApiClient.get<UserWithRoleDto[]>('/users/getAllUsers');
  }

  static async getStudents(): Promise<UserDto[]> {
    return ApiClient.get<UserDto[]>('/users/getStudents');
  }

  static async createUser(payload: CreateUserDto): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>('/users/createUser', payload);
  }

  static async deleteUser(email: string): Promise<{ message: string }> {
    return ApiClient.delete<{ message: string }>(`/users/deleteUser/${email}`);
  }

  static async getUserStats(): Promise<UserStats> {
    try {
      const users = await this.getAllUsers();
      const stats: UserStats = {
        total: users.length,
        students: 0,
        professors: 0,
        administrators: 0
      };

      users.forEach(user => {
        if (user.role) {
          const role = user.role.toLowerCase();
          if (role.includes('estudiante') || role.includes('student')) {
            stats.students++;
          } else if (role.includes('profesor') || role.includes('professor')) {
            stats.professors++;
          } else if (role.includes('admin') || role.includes('administrador')) {
            stats.administrators++;
          }
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        total: 0,
        students: 0,
        professors: 0,
        administrators: 0
      };
    }
  }
}