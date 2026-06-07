'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reports.service';
import { subDays, format } from 'date-fns';

export function AccessChart() {
  // Passa os últimos 7 dias como filtro — evita puxar todo o histórico
  const dataInicio = format(subDays(new Date(), 6), 'yyyy-MM-dd');
  const dataFim    = format(new Date(), 'yyyy-MM-dd');

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'chartData', dataInicio, dataFim],
    queryFn: () => reportsService.getDashboard({ dataInicio, dataFim }),
    staleTime: 5 * 60 * 1000,
    gcTime:    5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
        Carregando gráfico...
      </div>
    );
  }

  const logs = data?.data?.detalhes ?? [];

  interface ChartDataPoint {
    name: string;
    CONCEDIDO: number;
    NEGADO: number;
  }

  // Agrupa por dia
  const byDay = logs.reduce<Record<string, ChartDataPoint>>((acc, log) => {
    const day = format(new Date(log.dataHora), 'dd/MM');
    if (!acc[day]) acc[day] = { name: day, CONCEDIDO: 0, NEGADO: 0 };
    acc[day][log.status as 'CONCEDIDO' | 'NEGADO'] += 1;
    return acc;
  }, {});

  // Garante os 7 dias em ordem cronológica (mais antigo → mais recente)
  // mesmo que não haja logs em algum dia
  const chartData: ChartDataPoint[] = Array.from({ length: 7 }, (_, i) => {
    const day = format(subDays(new Date(), 6 - i), 'dd/MM');
    return byDay[day] ?? { name: day, CONCEDIDO: 0, NEGADO: 0 };
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            dy={10}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="CONCEDIDO" name="Liberados"  stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
          <Bar dataKey="NEGADO"    name="Bloqueados" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}