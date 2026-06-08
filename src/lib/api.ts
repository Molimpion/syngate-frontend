export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const isServer = typeof window === 'undefined';
  const isInternalApiRoute = endpoint.startsWith('/api/');
  const baseUrl = isInternalApiRoute ? '' : isServer ? process.env.NEXT_PUBLIC_API_URL : '/api';

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (response.status === 401) {
      throw new Error(errorData?.message || 'Sessão expirada. Faça login novamente.');
    }

    if (response.status === 403) {
      throw new Error(errorData?.message || 'Acesso negado para esta operação.');
    }

    throw new Error(errorData?.message || 'Erro na requisição.');
  }

  if (response.status === 204) return {} as T;
  return response.json();
}