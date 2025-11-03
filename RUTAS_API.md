# Rutas de API Actualizadas - Frontend Innosistemas

Este documento describe las rutas de API del frontend que han sido actualizadas para coincidir con el backend Java Spring Boot.

## Configuración Base
- **URL Base**: `http://localhost:8080/api`
- **Puerto Frontend**: `3004`
- **Puerto Backend**: `8080`

## Servicios Actualizados

### 1. AuthService (`/api/auth`)
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Cerrar sesión

### 2. CoursesService (`/api/courses`)
- `GET /courses` - Obtener todos los cursos
- `GET /courses/{id}` - Obtener curso por ID
- `POST /courses` - Crear nuevo curso (requiere `create_courses` permission)
- `PUT /courses/{id}` - Actualizar curso (requiere `create_courses` permission)
- `DELETE /courses/{id}` - Eliminar curso (requiere `create_courses` permission)

### 3. TeamsService (`/api/team`)
- `GET /team/getAllTeam` - Obtener todos los equipos
- `GET /team/{id}` - Obtener equipo por ID
- `POST /team` - Crear nuevo equipo
- `PUT /team/{id}` - Actualizar equipo
- `DELETE /team/{id}` - Eliminar equipo
- `POST /team/{teamId}/users` - Agregar usuario a equipo
- `DELETE /team/{teamId}/users/{userEmail}` - Remover usuario de equipo

### 4. ProjectsService (`/api/project`)
- `GET /project/getAllProjects` - Obtener todos los proyectos
- `GET /project/{id}` - Obtener proyecto por ID
- `GET /project/{projectId}/users/single-team` - Obtener usuarios de un equipo específico
- `POST /project` - Crear nuevo proyecto
- `PUT /project/{id}` - Actualizar proyecto
- `DELETE /project/{id}` - Eliminar proyecto

### 5. UsersService (`/api/users`)
- `GET /users/getAllUsers` - Obtener todos los usuarios (requiere `read_users` permission)
- `GET /users/getStudents` - Obtener solo estudiantes (requiere `read_students` permission)
- `POST /users/createUser` - Crear nuevo usuario
- `DELETE /users/deleteUser/{email}` - Eliminar usuario por email (requiere `delete_user` permission)

## Tipos TypeScript Actualizados

### DTOs Principales
```typescript
// Coincide con CourseDto.java
export interface CourseDto {
  idCourse: number;
  nameCourse: string;
}

// Coincide con ProjectDto.java
export interface ProjectDto {
  id: number;
  name: string;
}

// Coincide con TeamShowDto.java
export interface TeamShowDto {
  idTeam: number;
  nameTeam: string;
  projectId: number;
  projectName: string;
  courseId: number;
  students: UserDto[];
}
```

## Permisos Requeridos

### Cursos
- `read_courses` - Leer cursos
- `create_courses` - Crear/actualizar/eliminar cursos

### Equipos
- `read_teams` - Leer equipos

### Proyectos
- `read_project` - Leer proyectos

### Usuarios
- `read_users` - Leer todos los usuarios
- `read_students` - Leer solo estudiantes
- `delete_user` - Eliminar usuarios

## Autenticación
Todas las rutas protegidas requieren:
- Header `Authorization: Bearer {token}`
- Token válido obtenido mediante `/auth/login`
- Permisos específicos según la operación

## CORS
El backend está configurado para aceptar peticiones desde:
- `http://localhost:3004` (Frontend)

## Estado Actual
✅ Servidor frontend funcionando en puerto 3004
✅ Rutas actualizadas para coincidir con backend Spring Boot
✅ Tipos TypeScript sincronizados con DTOs de Java
✅ Autenticación JWT implementada
✅ Servicios de API actualizados