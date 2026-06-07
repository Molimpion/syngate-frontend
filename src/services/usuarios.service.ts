import { apiFetch } from '@/lib/api';
import { PapelUsuario } from '@/types';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  matricula?: string | null;
  cartaoId?: string | null;
  curso?: string | null;
  papel: PapelUsuario;
  ativo: boolean;
  dataExpiracao?: string | null;
  turnoId?: string | null;
  criadoEm: string;
  atualizadoEm: string;
  emailVerificado: boolean;
}

export interface Turno {
  id: string;
  nome: string;
  horaInicio: number;
  horaFim: number;
  diasSemana: number[];
}

interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

interface ApiPaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}

export interface ListarUsuariosParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CriarUsuarioPayload {
  nome: string;
  email: string;
  senha: string;
  papel: PapelUsuario;
  matricula?: string;
  curso?: string;
  turnoId?: string;
}

export interface AtualizarUsuarioPayload {
  nome?: string;
  email?: string;
  papel?: PapelUsuario;
  matricula?: string;
  curso?: string;
  turnoId?: string;
  ativo?: boolean;
}

export async function listarUsuarios(params: ListarUsuariosParams = {}) {
  const searchParams = new URLSearchParams();

  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('limit', String(params.limit ?? 10));

  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  const query = searchParams.toString();
  return apiFetch<ApiPaginatedResponse<Usuario[]>>(`/api/usuarios?${query}`);
}

export async function buscarUsuarioPorId(id: string) {
  return apiFetch<ApiResponse<Usuario>>(`/api/usuarios/${id}`);
}

export async function criarUsuario(payload: CriarUsuarioPayload) {
  return apiFetch<ApiResponse<Usuario>>('/api/usuarios', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function atualizarUsuario(id: string, payload: AtualizarUsuarioPayload) {
  return apiFetch<ApiResponse<Usuario>>(`/api/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function inativarUsuario(id: string) {
  return apiFetch<void>(`/api/usuarios/${id}`, {
    method: 'DELETE',
  });
}

export async function reativarUsuario(id: string) {
  return apiFetch<ApiResponse<Usuario>>(`/api/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ativo: true }),
  });
}

export async function vincularCartaoUsuario(id: string, cartaoId: string | null) {
  return apiFetch<ApiResponse<Usuario>>(`/api/usuarios/${id}/cartao`, {
    method: 'PATCH',
    body: JSON.stringify({ cartaoId }),
  });
}

export async function listarTurnos() {
  return apiFetch<ApiPaginatedResponse<Turno[]>>('/api/turnos?page=1&limit=100');
}
