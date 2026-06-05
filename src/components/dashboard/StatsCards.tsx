'use client';

import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatsCards() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) return <div className="text-sm text-muted-foreground">Carregando métricas...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Acessos</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{data?.totalAcessos || 0}</div></CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Concedidos</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold text-green-600">{data?.concedidos || 0}</div></CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Negados</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold text-red-600">{data?.negados || 0}</div></CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Dispositivos Ativos</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{data?.dispositivosAtivos || 0}</div></CardContent>
      </Card>
    </div>
  );
}