import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TOKEN_COOKIE = 'syngate_token';

function buildTargetUrl(req: NextRequest, path: string[]) {
	const baseUrl = process.env.API_URL;

	if (!baseUrl) {
		throw new Error('API_URL não configurada no ambiente.');
	}

	const cleanedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
	const suffix = path.length > 0 ? `/${path.join('/')}` : '';

	const target = new URL(`${cleanedBase}/users${suffix}`);
	req.nextUrl.searchParams.forEach((value, key) => target.searchParams.set(key, value));

	return target.toString();
}

async function handle(req: NextRequest, path: string[]) {
	try {
		const token = (await cookies()).get(TOKEN_COOKIE)?.value;
		const targetUrl = buildTargetUrl(req, path);

		const headers: HeadersInit = {
			Accept: 'application/json',
		};

		const contentType = req.headers.get('content-type');
		if (contentType) {
			headers['Content-Type'] = contentType;
		}

		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

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
		const responseContentType = response.headers.get('content-type');

		if (responseContentType) {
			nextHeaders.set('content-type', responseContentType);
		}

		return new NextResponse(responseText, {
			status: response.status,
			headers: nextHeaders,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Erro inesperado no proxy de usuários.';
		return NextResponse.json({ status: 'error', message }, { status: 500 });
	}
}

export async function GET(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
	const { path = [] } = await context.params;
	return handle(req, path);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
	const { path = [] } = await context.params;
	return handle(req, path);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
	const { path = [] } = await context.params;
	return handle(req, path);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
	const { path = [] } = await context.params;
	return handle(req, path);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
	const { path = [] } = await context.params;
	return handle(req, path);
}
