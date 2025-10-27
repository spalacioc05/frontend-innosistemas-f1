# InnoSistemas — Gestión de Equipos (Frontend)

Plataforma web para la formación y gestión de equipos de desarrollo en los siete cursos del área de Ingeniería de Software de la Universidad de Antioquia.

![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwindcss&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?logo=eslint&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![Turbopack](https://img.shields.io/badge/Turbopack-Enabled-000000?logo=vercel&logoColor=white)

---

## 🧭 Contexto del Proyecto

InnoSistemas es una plataforma de integración y desarrollo que busca llevar a la práctica los conocimientos adquiridos por los estudiantes a lo largo de siete cursos del área de Ingeniería de Software. A través de la plataforma, los estudiantes conforman equipos multidisciplinarios, desarrollan MVPs y trabajan con metodologías ágiles y colaborativas, simulando escenarios reales del entorno laboral.

Objetivo general: facilitar la interacción entre estudiantes, el monitoreo del progreso y la entrega de retroalimentación de manera eficiente y estructurada.

Este repositorio corresponde al Frontend de la Feature 1: Gestión de Equipos de Desarrollo.

- Autenticación y autorización con credenciales institucionales (@udea.edu.co)
- Creación y gestión de equipos (2 a 3 integrantes) por curso
- Asociación de estudiantes a equipos y validaciones de negocio
- Notificaciones in-app para cambios relevantes
- Dashboards por rol (Administrador, Estudiante)
- Cumplimiento progresivo de accesibilidad y buenas prácticas de seguridad

---

## 🧩 Alcance de esta Feature (F1) — Gestión de Equipos

Permite crear, gestionar y asignar equipos de trabajo conformados por estudiantes de los siete cursos de Ingeniería de Software. Los equipos se organizan según necesidades del proyecto y las habilidades de cada miembro.

- 🔐 Autenticación y autorización: acceso con credenciales institucionales; control por rol (admin/estudiante)
- 👥 Creación y gestión de equipos: equipos de 2 a 3 estudiantes del mismo curso; edición previa a confirmación
- ➕ Asociación de estudiantes: unirse a equipos existentes según preferencia/rol y reglas del curso
- 🔔 Notificaciones: avisos automáticos en la app ante asignaciones/cambios relevantes
- 📊 Reporte/Estado: dashboards que muestran estado de formación y progreso del equipo
- ♿ Accesibilidad: diseño y flujos alineados a buenas prácticas (en progreso)
- 🔒 Seguridad: disponibilidad, confidencialidad e integridad de la información (en progreso)

---

## 🏁 Sprints y HU implementadas

Este trabajo se planificó en 3 sprints. En este repositorio (Frontend) ya están implementadas las HU de los Sprints 1 y 2.

### ✅ Sprint 1 — Equipos de Desarrollo

- HU-01 Crear equipo
  - Formulario para crear equipos con nombre y selección de miembros del mismo curso
  - Validaciones: mínimo 2 y máximo 3 integrantes; sin duplicidad por curso
  - Mensajes explicativos en errores de validación
  - Notificación in‑app a los miembros al crear el equipo
  - El equipo aparece en el listado del curso tras la creación

- HU-03 Editar equipo
  - El creador puede editar nombre y miembros antes de la confirmación final
  - Validaciones al agregar: mismo curso, no duplicidad, máximo 3
  - Notificación al miembro removido
  - Bloqueo si quedan menos de 2 integrantes (mensaje explicativo)

- HU-02 Abandonar / Disolver equipo
  - Cualquier miembro puede abandonar el equipo (notificaciones al resto)
  - Si quedan <2 miembros: equipo marcado “incompleto” y notificación al admin
  - El creador puede disolver el equipo (se elimina del listado y notifica a todos)

### ✅ Sprint 2 — Acceso, Cursos y Proyectos

- HU-06 Inicio de sesión
  - Login con email institucional @udea.edu.co y asignación de rol (estudiante/admin)
  - Redirección al dashboard según rol tras autenticación
  - Mensaje de error claro ante credenciales inválidas: “Credenciales incorrectas — por favor verifique”
  - Usuario inicial con rol de administrador (mock para dev, integración lista para backend)

- HU-07 Cierre de sesión
  - Cierre de sesión desde el menú
  - Invalida sesión y redirige al login
  - Rutas internas protegidas: tras logout, vuelven a login al intentar acceder
  - Limpieza de tokens/cookies en cliente y (opcional) servidor

- HU-04 Registro de usuario
  - Formulario con campos: nombre, email, rol en proyectos y contraseña + selección de cursos
  - Mensajes: “Registro exitoso”, “Email no válido”, “El usuario ya existe”
  - Registro por defecto con rol estudiante

- HU-08 Crear curso (administrador)
  - Crear curso con validación de requerido y unicidad por nombre
  - Mensajes: “Curso creado exitosamente” / “Ya existe un curso con este nombre”

- HU-09 Crear proyecto (administrador)
  - Crear proyecto con nombre, descripción y curso
  - Validación de unicidad por curso antes de guardar
  - Mensaje: “Proyecto creado exitosamente”

> Nota: La integración con backend está preparada con servicios tipados (GET/POST). Ajustar endpoints si el backend define rutas finales diferentes.

### ⏭️ Sprint 3 (planificado)

- Dashboard de profesor y asignaciones de proyectos
- Métricas avanzadas y reportes
- Accesibilidad WCAG (enfoque AA): navegabilidad por teclado, contraste, ARIA
- Endurecimiento de seguridad (OWASP Top 10) y auditorías

---

## 🛠️ Stack Tecnológico

- Next.js 15 (App Router) — SSR/SSG, Middleware y Turbopack
- React 19 — UI declarativa y componentes
- TypeScript — Tipado estático en componentes, contextos y servicios
- Tailwind CSS 4 — Estilos utilitarios y diseño responsivo
- ESLint 9 — Estándares de código y buenas prácticas

---

## 🧱 Arquitectura Frontend (resumen)

- Autenticación y estado
  - `src/contexts/AuthContext.tsx`: contexto de autenticación (login, register, logout, rol)
  - Cookies: `auth_token` y `auth_role` para middleware y headers

- Cliente API centralizado
  - `src/config/api.ts`: base URL + inyección automática de Authorization desde cookie

- Servicios tipados
  - `src/services/auth.ts`: login, register, logout
  - `src/services/courses.ts`: createCourse, existsByName, list
  - `src/services/projects.ts`: createProject, existsByNameInCourse, listByCourse

- Protección de rutas y redirecciones
  - `middleware.ts`:
    - Requiere token para rutas internas
    - Guards por rol en `/admin` y dashboards por rol
    - Si el usuario autenticado visita `/auth/login` o `/auth/register`, se redirige a su dashboard
    - Si el usuario autenticado visita `/`, se redirige a su dashboard

- UI y páginas principales
  - Auth: `src/components/auth/{LoginForm,RegisterForm}.tsx`
  - Admin: `src/app/admin/{cursos,proyectos}/page.tsx`
  - Cursos/equipos: `src/app/cursos/[id]/equipos/page.tsx`
  - Layout/Nav: `src/components/layout/NavBar.tsx`, `src/app/layout.tsx`

---

## 🧩 Rutas Clave

Públicas

- `/` — Página principal (si autenticado, redirige al dashboard del rol)
- `/auth/login` — Inicio de sesión (redirige si ya estás autenticado)
- `/auth/register` — Registro de usuarios (redirige si ya estás autenticado)

Protegidas

- `/dashboard` — Redirige al dashboard por rol
- `/dashboard/admin` — Panel de administración
- `/dashboard/student` — Panel de estudiante
- `/cursos` — Listado de cursos
- `/cursos/[id]` — Vista específica de curso
- `/cursos/[id]/equipos` — Gestión de equipos del curso
- `/admin/cursos` — Creación de cursos (admin)
- `/admin/proyectos` — Creación de proyectos (admin)

---

## 🔐 Seguridad y ♿ Accesibilidad

- Seguridad
  - Token en cookie (`auth_token`) y rol (`auth_role`)
  - Middleware con guards por rol y protección de rutas
  - Logout limpia estado local y cookies; endpoint de logout preparado
  - Cabeceras Authorization inyectadas automáticamente en el cliente API

- Accesibilidad (en progreso continuo)
  - Diseño responsivo con Tailwind
  - Contenido y mensajes claros en formularios y validaciones
  - Próximos pasos: foco visible, navegación por teclado, ARIA y contraste AA

---

## 🔌 Integración con Backend

- Base URL configurable: `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:8080/api`)
- Ajustar rutas/contratos en `src/services/*` si el backend define endpoints finales diferentes
- Respuestas y payloads tipados en `src/types`

---

## ▶️ Cómo ejecutar (dev)

Requisitos

- Node.js 20 o superior
- npm

Instalación

```bash
npm install
```

Desarrollo (Turbopack, puerto 3004)

```bash
npm run dev
```

Abre: http://localhost:3004

Build y producción

```bash
npm run build
npm start
```

Lint

```bash
npm run lint
```

Consejo VS Code: puedes usar la tarea “Start Development Server” para iniciar el servidor de desarrollo.

---

## ⚙️ Variables de entorno

Puedes crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 🗂️ Estructura del Proyecto

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── admin/page.tsx
│   │   └── student/page.tsx
│   ├── cursos/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── equipos/page.tsx
│   ├── admin/
│   │   ├── cursos/page.tsx
│   │   └── proyectos/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── auth/{LoginForm.tsx,RegisterForm.tsx}
│   ├── equipos/{CreateTeamModal.tsx,EditTeamModal.tsx,TeamActionsModal.tsx}
│   └── layout/NavBar.tsx
├── config/api.ts
├── contexts/AuthContext.tsx
├── services/{auth.ts,courses.ts,projects.ts,teams.ts}
├── types/index.ts
└── utils/cookies.ts

middleware.ts
```

---

## 👤 Usuarios de demo (para explorar flujos)

- Administrador: `admin@udea.edu.co` — contraseña: cualquier valor (demo)
- Estudiantes:
  - `juan.perez@udea.edu.co`
  - `maria.garcia@udea.edu.co`
  - `carlos.lopez@udea.edu.co`
  - contraseña: cualquier valor (demo)

---

## 🗺️ Roadmap (resumen)

- [x] Sprint 1: Equipos (crear/editar/abandonar/disolver) + notificaciones básicas
- [x] Sprint 2: Autenticación/registro, dashboards por rol, cursos y proyectos (admin)
- [ ] Sprint 3: Dashboard de profesor, asignaciones, accesibilidad AA y seguridad avanzada

---

## 🤝 Contribuir

1. Crea una branch: `git checkout -b feature/NuevaFuncionalidad`
2. Commit: `git commit -m "feat: describe tu cambio"`
3. Push: `git push origin feature/NuevaFuncionalidad`
4. Abre un Pull Request

---

Si necesitas alinear endpoints o agregar nuevas HU al frontend, abre un issue describiendo los contratos esperados del backend y los flujos de UI.
