import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TOKEN_COOKIE = 'syngate_token';

function buildCandidates(baseUrl: string) {
  const cleanedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  return [
    `${cleanedBase}/auth/trocar-senha`,
    `${cleanedBase}/auth/change-password`,
    `${cleanedBase}/users/me/password`,
  ];
}

export async function POST(req: NextRequest) {
  try {
    const baseUrl = process.env.API_URL;
    if (!baseUrl) {
      throw new Error('API_URL nao configurada no ambiente.');
    }

    const token = (await cookies()).get(TOKEN_COOKIE)?.value;
    const body = await req.text();
    const candidates = buildCandidates(baseUrl);

    let lastResponse: Response | null = null;

    for (const targetUrl of candidates) {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body,
        cache: 'no-store',
      });

      if (response.status === 404) {
        lastResponse = response;
        continue;
      }

      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'content-type': response.headers.get('content-type') ?? 'application/json',
        },
      });
    }

    const lastText = lastResponse ? await lastResponse.text() : JSON.stringify({ status: 'error', message: 'Endpoint nao encontrado.' });
    return new NextResponse(lastText, {
      status: 404,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado ao trocar senha.';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
