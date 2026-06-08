import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TOKEN_COOKIE = 'syngate_token';

function buildTargetUrl(req: NextRequest, slug: string[]) {
  const baseUrl = process.env.API_URL;
  if (!baseUrl) throw new Error('API_URL não configurada.');
  const cleanedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const suffix = slug.length > 0 ? `/${slug.join('/')}` : '';
  const target = new URL(`${cleanedBase}/devices${suffix}`);
  req.nextUrl.searchParams.forEach((value, key) => target.searchParams.set(key, value));
  return target.toString();
}

async function handle(req: NextRequest, slug: string[]) {
  try {
    const token = (await cookies()).get(TOKEN_COOKIE)?.value;
    const targetUrl = buildTargetUrl(req, slug);
    const headers: HeadersInit = { Accept: 'application/json' };
    const contentType = req.headers.get('content-type');
    if (contentType) headers['Content-Type'] = contentType;
    if (token) headers.Authorization = `Bearer ${token}`;

    const method = req.method.toUpperCase();
    const hasBody = !['GET', 'HEAD'].includes(method);

    const response = await fetch(targetUrl, {
      method,
      headers,
      body: hasBody ? await req.text() : undefined,
      cache: 'no-store',
    });

    const responseText = await response.text();
    const nextHeaders = new Headers();
    const ct = response.headers.get('content-type');
    if (ct) nextHeaders.set('content-type', ct);

    return new NextResponse(responseText, { status: response.status, headers: nextHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado no proxy de devices.';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await context.params;
  return handle(req, slug);
}
export async function POST(req: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await context.params;
  return handle(req, slug);
}
export async function PUT(req: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await context.params;
  return handle(req, slug);
}
export async function PATCH(req: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await context.params;
  return handle(req, slug);
}
export async function DELETE(req: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await context.params;
  return handle(req, slug);
}