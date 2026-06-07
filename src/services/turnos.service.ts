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

export interface Turno {
  id: string;
  nome: string;
  horaInicio: number;
  horaFim: number;
  diasSemana: number[];
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface ListarTurnosParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SalvarTurnoPayload {
  nome: string;
  horaInicio: number;
  horaFim: number;
  diasSemana: number[];
}

export async function listarTurnos(params: ListarTurnosParams = {}) {
  const searchParams = new URLSearchParams();

  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('limit', String(params.limit ?? 10));

  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  const query = searchParams.toString();
  return apiFetch<ApiPaginatedResponse<Turno[]>>(`/api/turnos?${query}`);
}

export async function buscarTurnoPorId(id: string) {
  return apiFetch<ApiResponse<Turno>>(`/api/turnos/${id}`);
}

export async function criarTurno(payload: SalvarTurnoPayload) {
  return apiFetch<ApiResponse<Turno>>('/api/turnos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function atualizarTurno(id: string, payload: SalvarTurnoPayload) {
  return apiFetch<ApiResponse<Turno>>(`/api/turnos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function excluirTurno(id: string) {
  return apiFetch<void>(`/api/turnos/${id}`, {
    method: 'DELETE',
  });
}
