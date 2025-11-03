import { ApiClient } from '@/config/api';
import type { UserDto, CreateUserDto } from '@/types';

export class UsersService {
  static async getAllUsers(): Promise<UserDto[]> {
    return ApiClient.get<UserDto[]>('/users/getAllUsers');
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
}