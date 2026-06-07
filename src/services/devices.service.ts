import { apiFetch } from '@/lib/api';
import { Device, Sala } from '@/types';

export const DevicesService = {
  listar: () => apiFetch<{ data: Device[] }>('/devices?limit=100'),
  buscarPorId: (id: string) => apiFetch<{ data: Device }>(`/devices/${id}`),
  criar: (data: Partial<Device>) => apiFetch('/devices', { method: 'POST', body: JSON.stringify(data) }),
  atualizar: (id: string, data: Partial<Device>) => apiFetch(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  provisionar: (id: string) => apiFetch<{ data: { rawKey: string } }>(`/devices/${id}/provision`, { method: 'POST' }),
  listarSalas: () => apiFetch<{ data: Sala[] }>('/rooms?limit=100'),
};