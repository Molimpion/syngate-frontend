'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrocarSenhaForm } from '@/components/perfil/TrocarSenhaForm';
import { buscarPerfil } from '@/services/perfil.service';
import { listarTurnos, type Turno } from '@/services/turnos.service';

function formatarData(data?: string | null) {
  if (!data) {
    return '-';
  }

  const parsed = new Date(data);
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR').format(parsed);
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

    if (!perfil?.turnoId) {
      return '-';
    }

    return turnos.find((turno) => turno.id === perfil.turnoId)?.nome ?? '-';
  }, [perfilQuery.data?.data, turnosQuery.data?.data]);

  return (
    <div className="space-y-6 p-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Meu perfil</CardTitle>
        </CardHeader>
        <CardContent>
          {perfilQuery.isLoading ? (
            <p className="text-sm text-slate-500">Carregando dados do perfil...</p>
          ) : perfilQuery.isError || !perfilQuery.data?.data ? (
            <p className="text-sm text-destructive">Nao foi possivel carregar seu perfil.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Nome</p>
                <p className="font-medium text-slate-900">{perfilQuery.data.data.nome}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">E-mail</p>
                <p className="font-medium text-slate-900">{perfilQuery.data.data.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Papel</p>
                <p className="font-medium text-slate-900">{perfilQuery.data.data.papel}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Matricula</p>
                <p className="font-medium text-slate-900">{perfilQuery.data.data.matricula || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Curso</p>
                <p className="font-medium text-slate-900">{perfilQuery.data.data.curso || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Turno vinculado</p>
                <p className="font-medium text-slate-900">{turnoNome}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Data de expiracao</p>
                <p className="font-medium text-slate-900">{formatarData(perfilQuery.data.data.dataExpiracao)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">UID do cartao RFID</p>
                <p className="font-medium text-slate-900">{perfilQuery.data.data.cartaoId || '-'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trocar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <TrocarSenhaForm />
        </CardContent>
      </Card>
    </div>
  );
}
