import { apiFetch } from '@/lib/api';
import { Device, Sala } from '@/types';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiPaginatedResponse<T> {
  status: 'success' | 'error';
  data: T;
  meta: PaginationMeta;
  message?: string;
}

export interface ListarDevicesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const DevicesService = {
  listar: (params: ListarDevicesParams = {}) => {
    const searchParams = new URLSearchParams();

    searchParams.set('page', String(params.page ?? 1));
    searchParams.set('limit', String(params.limit ?? 10));

    if (params.search?.trim()) {
      searchParams.set('search', params.search.trim());
    }

    return apiFetch<ApiPaginatedResponse<Device[]>>(`/devices?${searchParams.toString()}`);
  },
  buscarPorId: (id: string) => apiFetch<{ data: Device }>(`/devices/${id}`),
  criar: (data: Partial<Device>) => apiFetch('/devices', { method: 'POST', body: JSON.stringify(data) }),
  atualizar: (id: string, data: Partial<Device>) => apiFetch(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  provisionar: (id: string) => apiFetch<{ data: { rawKey: string } }>(`/devices/${id}/provision`, { method: 'POST' }),
  // Aumentamos o limite para garantir que as 127+ salas apareçam nos formulários
  listarSalas: () => apiFetch<{ data: Sala[] }>('/rooms?limit=200'),
};