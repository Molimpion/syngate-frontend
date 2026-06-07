'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reports.service';

export function AccessChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'chartData'],
    queryFn: () => reportsService.getDashboard({}), // Pega um apanhado geral
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <div className="h-[300px] flex items-center justify-center text-slate-400">Carregando gráfico...</div>;

  // Transforma os dados brutos de logs em um agrupamento por dia para o Recharts
  const logs = data?.data?.detalhes || [];
  
  interface ChartDataPoint {
    name: string;
    CONCEDIDO: number;
    NEGADO: number;
  }
  
  const chartData = logs.reduce((acc: ChartDataPoint[], log) => {
    const dateObj = new Date(log.dataHora);
    const day = dateObj.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' });
    
    const existing = acc.find((item) => item.name === day);
    if (existing) {
      existing[log.status as keyof Omit<ChartDataPoint, 'name'>] += 1;
    } else {
      acc.push({ name: day, CONCEDIDO: log.status === 'CONCEDIDO' ? 1 : 0, NEGADO: log.status === 'NEGADO' ? 1 : 0 });
    }
    return acc;
  }, []).reverse().slice(0, 7); // Últimos 7 dias

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }} 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
          />
          <Bar dataKey="CONCEDIDO" name="Acessos Liberados" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
          <Bar dataKey="NEGADO" name="Acessos Bloqueados" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}