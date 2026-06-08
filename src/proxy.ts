import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas que não precisam de autenticação
const PUBLIC_PATHS = ['/login', '/verificar-email'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite rotas públicas e assets
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Permite rotas de API internas (proxy para o backend)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Todas as demais rotas exigem autenticação
  const token = request.cookies.get('syngate_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Aplica o middleware em todas as rotas exceto arquivos estáticos
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
};