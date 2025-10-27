import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Rutas públicas que no requieren autenticación
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/',
];

// Rutas restringidas por rol
const ROLE_GUARDS: Array<{ prefix: string; role: string }> = [
  { prefix: '/dashboard/admin', role: 'admin' },
  { prefix: '/admin', role: 'admin' },
  { prefix: '/dashboard/student', role: 'student' },
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value;
  const role = req.cookies.get('auth_role')?.value as 'admin' | 'student' | 'professor' | undefined;

  // Si el usuario ya está autenticado y está en login/registro, redirigir al dashboard por rol
  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register';
  if (token && isAuthPage) {
    const redirect = req.nextUrl.clone();
    redirect.pathname = role === 'admin' ? '/dashboard/admin'
      : role === 'student' ? '/dashboard/student'
      : '/dashboard';
    return NextResponse.redirect(redirect);
  }

  // Si el usuario ya está autenticado y entra a la raíz '/', redirigir a su dashboard
  if (token && pathname === '/') {
    const redirect = req.nextUrl.clone();
    redirect.pathname = role === 'admin' ? '/dashboard/admin'
      : role === 'student' ? '/dashboard/student'
      : '/dashboard';
    return NextResponse.redirect(redirect);
  }

  // Permitir assets y rutas públicas
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return NextResponse.next();
  }

  // Si no hay sesión y la ruta no es pública, redirigir al login
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validar guardas por rol
  const guard = ROLE_GUARDS.find((g) => pathname.startsWith(g.prefix));
  if (guard && role !== guard.role) {
    const dashUrl = req.nextUrl.clone();
    dashUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
