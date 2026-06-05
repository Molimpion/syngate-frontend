'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiFetch<{ 
      totalAcessos: number; 
      concedidos: number; 
      negados: number; 
      dispositivosAtivos: number 
    }>('/reports/stats'),
    staleTime: 60000,
    refetchInterval: 60000,
  });
}