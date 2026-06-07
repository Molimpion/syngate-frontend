import { apiFetch } from '@/lib/api';
import { ReportFilters, DashboardReportResponse } from '@/types';

export const reportsService = {
  getDashboard: (filters: ReportFilters) => {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined)
      ) as Record<string, string>
    ).toString();
    return apiFetch<{ data: DashboardReportResponse }>(`/reports/dashboard?${params}`);
  },

  exportCSV: async (filters: ReportFilters) => {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined)
      ) as Record<string, string>
    ).toString();

    // credentials: 'include' envia o cookie HttpOnly automaticamente
    // NÃO lemos document.cookie — o cookie é httpOnly e inacessível ao JS
    const response = await fetch(`/api/proxy/reports/export/csv?${params}`, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Erro ao exportar CSV');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-acessos-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};