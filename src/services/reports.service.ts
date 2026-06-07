import { apiFetch } from '@/lib/api';
import { ReportFilters, DashboardReportResponse } from '@/types';

export const reportsService = {
  getDashboard: (filters: ReportFilters) => {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    return apiFetch<{ data: DashboardReportResponse }>(`/reports/dashboard?${params}`);
  },
  
  exportCSV: async (filters: ReportFilters) => {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer ? process.env.API_URL : '/api/proxy';
    
    // Precisamos usar fetch direto aqui para tratar a resposta como Blob (arquivo)
    const token = document.cookie.split('syngate_token=')[1]?.split(';')[0];
    
    const response = await fetch(`${baseUrl}/reports/export/csv?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
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
  }
};