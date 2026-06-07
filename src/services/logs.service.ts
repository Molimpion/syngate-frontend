import { apiFetch } from '@/lib/api';
import { AccessLogDetail, ReportFilters } from '@/types';

export interface LogsResponse {
  status: 'success' | 'error';
  data: {
    resumo: {
      totalAcessos: number;
      porStatus: { status: string; _count: number }[];
      porDirecao: { direcao: string; _count: number }[];
    };
    detalhes: AccessLogDetail[];
  };
}

export interface ListarLogsParams extends ReportFilters {
  page?: number;
  limit?: number;
}

export const logsService = {
  listar: (params: ListarLogsParams = {}): Promise<LogsResponse> => {
    const searchParams = new URLSearchParams();

    if (params.dataInicio)    searchParams.set('dataInicio', params.dataInicio);
    if (params.dataFim)       searchParams.set('dataFim', params.dataFim);
    if (params.status)        searchParams.set('status', params.status);
    if (params.usuarioId)     searchParams.set('usuarioId', params.usuarioId);
    if (params.dispositivoId) searchParams.set('dispositivoId', params.dispositivoId);

    return apiFetch<LogsResponse>(`/api/reports/dashboard?${searchParams.toString()}`);
  },
};