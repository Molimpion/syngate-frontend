export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const isServer = typeof window === 'undefined';
  const baseUrl = isServer ? process.env.API_URL : '/api/proxy';
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Erro na requisição.');
  }

  if (response.status === 204) return {} as T;
  return response.json();
}