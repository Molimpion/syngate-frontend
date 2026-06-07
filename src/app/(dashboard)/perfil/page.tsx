'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrocarSenhaForm } from '@/components/perfil/TrocarSenhaForm';
import { buscarPerfil } from '@/services/perfil.service';
import { listarTurnos, type Turno } from '@/services/turnos.service';

function formatarData(data?: string | null) {
  if (!data) return '-';
  const parsed = new Date(data);
  if (Number.isNaN(parsed.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR').format(parsed);
}

function InfoField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value || '-'}</p>
    </div>
  );
}

export default function PerfilPage() {
  const perfilQuery = useQuery({
    queryKey: ['perfil'],
    queryFn: buscarPerfil,
  });

  const turnosQuery = useQuery({
    queryKey: ['turnos-perfil'],
    queryFn: () => listarTurnos({ page: 1, limit: 100 }),
  });

  const turnoNome = useMemo(() => {
    const perfil = perfilQuery.data?.data;
    const turnos: Turno[] = turnosQuery.data?.data ?? [];
    if (!perfil?.turnoId) return '-';
    return turnos.find((turno) => turno.id === perfil.turnoId)?.nome ?? '-';
  }, [perfilQuery.data?.data, turnosQuery.data?.data]);

  return (
    <div className="space-y-6 p-6 md:p-8">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Meu perfil</CardTitle>
        </CardHeader>
        <CardContent>
          {perfilQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando dados do perfil...</p>
          ) : perfilQuery.isError || !perfilQuery.data?.data ? (
            <p className="text-sm text-destructive">Não foi possível carregar seu perfil.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoField label="Nome"               value={perfilQuery.data.data.nome} />
              <InfoField label="E-mail"             value={perfilQuery.data.data.email} />
              <InfoField label="Papel"              value={perfilQuery.data.data.papel} />
              <InfoField label="Matrícula"          value={perfilQuery.data.data.matricula} />
              <InfoField label="Curso"              value={perfilQuery.data.data.curso} />
              <InfoField label="Turno vinculado"    value={turnoNome} />
              <InfoField label="Data de expiração"  value={formatarData(perfilQuery.data.data.dataExpiracao)} />
              <InfoField label="UID do cartão RFID" value={perfilQuery.data.data.cartaoId} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Trocar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <TrocarSenhaForm />
        </CardContent>
      </Card>
    </div>
  );
}