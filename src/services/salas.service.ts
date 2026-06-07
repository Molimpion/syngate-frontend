import { apiFetch } from '@/lib/api';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

interface ApiPaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}

export interface Sala {
  id: string;
  nome: string;
  bloco: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface ListarSalasParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SalvarSalaPayload {
  nome: string;
  bloco: string;
}

export async function listarSalas(params: ListarSalasParams = {}) {
  const searchParams = new URLSearchParams();

  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('limit', String(params.limit ?? 20));

  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  const query = searchParams.toString();
  return apiFetch<ApiPaginatedResponse<Sala[]>>(`/api/salas?${query}`);
}

export async function buscarSalaPorId(id: string) {
  return apiFetch<ApiResponse<Sala>>(`/api/salas/${id}`);
}

export async function criarSala(payload: SalvarSalaPayload) {
  return apiFetch<ApiResponse<Sala>>('/api/salas', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function atualizarSala(id: string, payload: SalvarSalaPayload) {
  return apiFetch<ApiResponse<Sala>>(`/api/salas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function excluirSala(id: string) {
  return apiFetch<void>(`/api/salas/${id}`, {
    method: 'DELETE',
  });
}
