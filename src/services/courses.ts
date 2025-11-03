import { ApiClient } from '@/config/api';
import type { CourseDto, CreateCourseForm } from '@/types';

export class CoursesService {
  static async createCourse(name: string): Promise<CourseDto> {
    return ApiClient.post<CourseDto>('/courses', { name });
  }

  static async getAllCourses(): Promise<CourseDto[]> {
    return ApiClient.get<CourseDto[]>('/courses');
  }

  static async getCourseById(id: number): Promise<CourseDto> {
    return ApiClient.get<CourseDto>(`/courses/${id}`);
  }

  static async updateCourse(id: number, name: string): Promise<CourseDto> {
    return ApiClient.put<CourseDto>(`/courses/${id}`, name);
  }

  static async deleteCourse(id: number): Promise<void> {
    return ApiClient.delete<void>(`/courses/${id}`);
  }
}
