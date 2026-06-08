'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

interface DashboardStats {
  totalAcessos: number;
  concedidos: number;
  negados: number;
  dispositivosAtivos: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () =>
  apiFetch<{ status: string; data: DashboardStats }>('/reports/stats')
    .then((res) => res.data),
  });
}