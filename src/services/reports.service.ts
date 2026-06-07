import { apiFetch } from '@/lib/api';
import { ReportFilters, DashboardReportResponse } from '@/types';

function buildParams(filters: ReportFilters): string {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    ) as Record<string, string>
  ).toString();
}

export const reportsService = {
  getDashboard: (filters: ReportFilters) => {
    const params = buildParams(filters);
    return apiFetch<{ data: DashboardReportResponse }>(`/api/reports/dashboard?${params}`);
  },

  exportCSV: async (filters: ReportFilters) => {
    const params = buildParams(filters);

    const response = await fetch(`/api/reports/export/csv?${params}`, {
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