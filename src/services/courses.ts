import { ApiClient } from '@/config/api';

export interface CreateCoursePayload {
  name: string;
  description?: string;
}

export interface CourseDTO {
  id: string;
  name: string;
  description?: string;
}

export class CoursesService {
  static async createCourse(payload: CreateCoursePayload): Promise<CourseDTO> {
    // Ajusta el endpoint según el backend cuando esté disponible
    return ApiClient.post<CourseDTO>('/course/createCourse', payload);
  }

  static async existsByName(name: string): Promise<{ exists: boolean }> {
    return ApiClient.get<{ exists: boolean }>(`/course/existsByName?name=${encodeURIComponent(name)}`);
  }

  static async list(): Promise<CourseDTO[]> {
    return ApiClient.get<CourseDTO[]>('/course/getAllCourses');
  }
}
