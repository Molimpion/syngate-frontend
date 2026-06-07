import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('syngate_token')?.value;

  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/usuarios') ||
    request.nextUrl.pathname.startsWith('/turnos') ||
    request.nextUrl.pathname.startsWith('/salas') ||
    request.nextUrl.pathname.startsWith('/perfil')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/usuarios/:path*', '/turnos/:path*', '/salas/:path*', '/perfil/:path*'],
};