# Sistema de Gestión de Equipos - Universidad de Antioquia

Una aplicación web moderna para la gestión de equipos de trabajo en cursos de Ingeniería de Software, construida con Next.js, React y TypeScript.

## Características

- 🔐 **Sistema de Autenticación por Roles**: Administradores, Profesores y Estudiantes
- 👥 **Gestión de Equipos**: Creación, edición, y administración de equipos
- 📚 **Gestión de Cursos**: Múltiples cursos de Ingeniería de Software
- 🔔 **Sistema de Notificaciones**: Alertas en tiempo real para actividades del equipo
- 📱 **Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos
- 🎨 **UI Moderna**: Diseño limpio con Tailwind CSS
- ⚡ **Rendimiento Optimizado**: Construido con Next.js 15

## Tecnologías Utilizadas

- [Next.js 15](https://nextjs.org/) - Framework de React
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [React Context](https://reactjs.org/docs/context.html) - Gestión de estado global
- [ESLint](https://eslint.org/) - Linter de código

## Perfiles de Usuario

### 👨‍💼 Administrador
- Dashboard completo con estadísticas del sistema
- Gestión de usuarios (estudiantes y profesores)
- Supervisión de todos los equipos y cursos
- Resolución de conflictos y equipos problemáticos
- Reportes y analytics del sistema

### 👨‍🎓 Estudiante
- Dashboard personalizado con sus equipos
- Creación de equipos con validaciones de negocio
- Invitación de miembros del mismo curso
- Edición de equipos (nombre y miembros)
- Abandono de equipos o disolución (si es creador)
- Sistema de notificaciones

## Funcionalidades Implementadas

### 🔐 Autenticación y Autorización
- [x] Sistema de login diferenciado por roles
- [x] Contexto de autenticación con React Context
- [x] Redirección automática según el rol del usuario
- [x] Protección de rutas por rol

### 👥 Gestión de Equipos (Estudiantes)
- [x] **Crear Equipo**: Interface para crear equipos con selección de miembros
- [x] **Validaciones de Negocio**:
  - Mínimo 2 y máximo 3 integrantes por equipo
  - Solo estudiantes del mismo curso
  - Prevención de membresía duplicada
  - Validación de disponibilidad de estudiantes
- [x] **Editar Equipo**: Modificar nombre y agregar/quitar miembros
- [x] **Abandonar Equipo**: Cualquier miembro puede salir del equipo
- [x] **Disolver Equipo**: El creador puede eliminar completamente el equipo
- [x] **Sistema de Notificaciones**: Alertas para invitaciones, cambios y eventos

### 🏫 Gestión de Cursos
- [x] Listado de cursos de Ingeniería de Software
- [x] Vista de equipos por curso
- [x] Estadísticas de equipos por curso
- [x] Navegación breadcrumb

### 📊 Dashboard Diferenciado
- [x] **Dashboard de Administrador**: 
  - Estadísticas globales del sistema
  - Alertas de equipos problemáticos
  - Actividad reciente del sistema
  - Accesos rápidos a gestión
- [x] **Dashboard de Estudiante**:
  - Estadísticas personales
  - Sus equipos activos
  - Notificaciones personalizadas
  - Creación rápida de equipos por curso

### 🔔 Sistema de Notificaciones
- [x] Notificaciones por invitación a equipo
- [x] Alertas por abandono de miembros
- [x] Notificaciones por disolución de equipos
- [x] Marcadores de equipos incompletos
- [x] Indicadores visuales de notificaciones no leídas

### 🎨 UI/UX
- [x] Navegación adaptativa según el rol
- [x] Modales interactivos para gestión de equipos
- [x] Confirmaciones de acciones críticas
- [x] Estados de carga y validación en tiempo real
- [x] Diseño responsivo completo

## Reglas de Negocio Implementadas

### Creación de Equipos
1. **Tamaño del equipo**: Entre 2 y 3 integrantes (incluyendo al creador)
2. **Curso único**: Solo estudiantes del mismo curso pueden formar equipo
3. **Membresía única**: Un estudiante no puede estar en múltiples equipos del mismo curso
4. **Validación de disponibilidad**: Verificación de que los invitados no están en otros equipos

### Modificación de Equipos
1. **Solo antes de confirmación final**: Los equipos pueden editarse mientras están en estado "En Formación"
2. **Validaciones al agregar**: Mismo curso, máximo 3 miembros, sin duplicidades
3. **Validaciones al quitar**: Mínimo 2 miembros después de la remoción
4. **Notificaciones**: Todos los cambios generan notificaciones a los afectados

### Abandono y Disolución
1. **Abandono**: Cualquier miembro puede abandonar el equipo
2. **Equipo incompleto**: Si queda con menos de 2 miembros, se marca como "Incompleto"
3. **Disolución**: Solo el creador puede disolver completamente el equipo
4. **Notificaciones**: Todos los miembros son notificados de estos eventos

## Páginas Disponibles

### Públicas
- `/` - Página principal
- `/auth/login` - Inicio de sesión
- `/auth/register` - Registro de usuarios

### Protegidas
- `/dashboard` - Redirección automática según rol
- `/dashboard/admin` - Panel de administración
- `/dashboard/student` - Panel de estudiante
- `/cursos` - Listado de cursos
- `/cursos/[id]` - Vista específica del curso
- `/cursos/[id]/equipos` - Gestión de equipos del curso

## Usuarios de Demo

### Administrador
- **Email**: admin@udea.edu.co
- **Contraseña**: cualquier valor (para demo)

### Estudiantes
- **Email**: juan.perez@udea.edu.co
- **Email**: maria.garcia@udea.edu.co
- **Email**: carlos.lopez@udea.edu.co
- **Contraseña**: cualquier valor (para demo)

## Comenzar

1. Instala las dependencias:
```bash
npm install
```

2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

4. Usa las credenciales de demo para probar las diferentes funcionalidades

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter de código

## Estructura del Proyecto

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx           # Página de login
│   │   └── register/page.tsx        # Página de registro
│   ├── dashboard/
│   │   ├── page.tsx                 # Dashboard principal (redirección)
│   │   ├── admin/page.tsx           # Dashboard de administrador
│   │   └── student/page.tsx         # Dashboard de estudiante
│   ├── cursos/
│   │   ├── page.tsx                 # Listado de cursos
│   │   └── [id]/
│   │       ├── page.tsx             # Vista del curso
│   │       └── equipos/page.tsx     # Gestión de equipos
│   ├── layout.tsx                   # Layout principal con AuthProvider
│   ├── page.tsx                     # Página principal
│   └── globals.css                  # Estilos globales
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx            # Formulario de login
│   │   └── RegisterForm.tsx         # Formulario de registro
│   ├── equipos/
│   │   ├── CreateTeamModal.tsx      # Modal de creación de equipos
│   │   ├── EditTeamModal.tsx        # Modal de edición de equipos
│   │   └── TeamActionsModal.tsx     # Modal de acciones de equipo
│   └── layout/
│       └── NavBar.tsx               # Barra de navegación adaptativa
├── contexts/
│   └── AuthContext.tsx              # Contexto de autenticación
└── types/
    └── index.ts                     # Definiciones de tipos TypeScript
```

## Historias de Usuario Implementadas

### HU1: Crear Equipo (Estudiante)
✅ **Implementada completamente**
- Interface para crear equipo con nombre y selección de miembros
- Validación de 2-3 integrantes del mismo curso
- Prevención de duplicidad en equipos del mismo curso
- Notificaciones a miembros invitados
- Aparición del equipo en listado del curso

### HU2: Modificar Equipo (Estudiante Creador)
✅ **Implementada completamente**
- Edición de nombre y miembros antes de confirmación final
- Validaciones de reglas de negocio al agregar/quitar
- Notificaciones a miembros afectados
- Bloqueo de edición si quedan menos de 2 miembros

### HU3: Abandonar/Disolver Equipo (Estudiante)
✅ **Implementada completamente**
- Opción de "abandonar equipo" para cualquier miembro
- Opción de "disolver equipo" solo para el creador
- Manejo de equipos incompletos (<2 miembros)
- Notificaciones a todos los miembros
- Eliminación del equipo del listado activo

## Próximas Características

- [ ] Dashboard de profesor
- [ ] Gestión de proyectos y asignaciones
- [ ] Sistema de evaluación por pares
- [ ] Chat interno de equipos
- [ ] Integración con calendario académico
- [ ] Exportación de reportes
- [ ] API REST completa
- [ ] Base de datos persistente

## Contribuir

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request
