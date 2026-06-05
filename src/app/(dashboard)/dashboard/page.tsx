'use client';

import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { session, isLoading } = useSession();

  if (isLoading) return <p className="text-muted-foreground">Carregando painel...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Bem-vindo ao Syngate</h2>
        <p className="text-muted-foreground">
          Sistema de Controle de Acesso - Senac
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Cards de Resumo Temporários */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meu Acesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{session?.papel}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}