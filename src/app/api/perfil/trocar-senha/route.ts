import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TOKEN_COOKIE = 'syngate_token';

export async function POST(req: NextRequest) {
  try {
    const baseUrl = process.env.API_URL;
    if (!baseUrl) {
      throw new Error('API_URL não configurada no ambiente.');
    }

    const cleanedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const token = (await cookies()).get(TOKEN_COOKIE)?.value;
    const body = await req.text();

    const response = await fetch(`${cleanedBase}/auth/trocar-senha`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
      cache: 'no-store',
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado ao trocar senha.';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}