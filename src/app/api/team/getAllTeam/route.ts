import { NextResponse } from 'next/server';
import type { TeamShowDto, UserDto } from '@/types';

const MOCK_TEAMS: TeamShowDto[] = [
  {
    idTeam: 1,
    nameTeam: 'Equipo Alpha',
    projectId: 101,
    projectName: 'Proyecto A',
    courseId: 1,
    students: [
      { email: 'ana.perez@udea.edu.co', nameUser: 'Ana Pérez' },
      { email: 'juan.lopez@udea.edu.co', nameUser: 'Juan López' },
      { email: 'maria.gomez@udea.edu.co', nameUser: 'María Gómez' }
    ]
  },
  {
    idTeam: 2,
    nameTeam: 'Beta Squad',
    projectId: 102,
    projectName: 'Proyecto B',
    courseId: 2,
    students: [
      { email: 'carlos.rivera@udea.edu.co', nameUser: 'Carlos Rivera' },
      { email: 'laura.moreno@udea.edu.co', nameUser: 'Laura Moreno' }
    ]
  },
  {
    idTeam: 3,
    nameTeam: 'Gamma Team',
    projectId: 103,
    projectName: 'Proyecto C',
    courseId: 1,
    students: [
      { email: 'pedro.torres@udea.edu.co', nameUser: 'Pedro Torres' }
    ]
  },
  {
    idTeam: 4,
    nameTeam: 'Delta Force',
    projectId: 104,
    projectName: 'Proyecto D',
    courseId: 3,
    students: [
      { email: 'sofia.castro@udea.edu.co', nameUser: 'Sofía Castro' },
      { email: 'diego.mendez@udea.edu.co', nameUser: 'Diego Méndez' },
      { email: 'laura.garcia@udea.edu.co', nameUser: 'Laura García' },
      { email: 'andres.lopez@udea.edu.co', nameUser: 'Andrés López' }
    ]
  }
];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const courseId = url.searchParams.get('courseId');
    const status = url.searchParams.get('status'); // 'formed' | 'incomplete'
    const sort = url.searchParams.get('sort'); // 'course' | 'name' | 'state'
    const minSizeParam = url.searchParams.get('minSize');
    const minSize = minSizeParam ? parseInt(minSizeParam, 10) : 3; // por defecto 3

    let results = MOCK_TEAMS.slice();

    // Buscar por nombre del equipo (parcial, case-insensitive)
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(t => t.nameTeam.toLowerCase().includes(q));
    }

    // Filtrar por curso si se provee
    if (courseId) {
      const cid = parseInt(courseId, 10);
      results = results.filter(t => t.courseId === cid);
    }

    // Filtrar por estado
    if (status) {
      if (status === 'formed') {
        results = results.filter(t => t.students.length >= minSize);
      } else if (status === 'incomplete') {
        results = results.filter(t => t.students.length < minSize);
      }
    }

    // Ordenamiento
    if (sort) {
      if (sort === 'course') {
        results.sort((a, b) => a.courseId - b.courseId);
      } else if (sort === 'name') {
        results.sort((a, b) => a.nameTeam.localeCompare(b.nameTeam));
      } else if (sort === 'state') {
        // ordenar por estado: primero incompletos
        results.sort((a, b) => {
          const aIncomplete = a.students.length < minSize ? 0 : 1;
          const bIncomplete = b.students.length < minSize ? 0 : 1;
          return aIncomplete - bIncomplete;
        });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno al obtener equipos' }, { status: 500 });
  }
}
