'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrocarSenhaForm } from '@/components/perfil/TrocarSenhaForm';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PapelUsuario } from '@/types';

interface PerfilUsuario {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  matricula?: string | null;
  curso?: string | null;
  turnoId?: string | null;
  cartaoId?: string | null;
  dataExpiracao?: string | null;
  ativo: boolean;
  emailVerificado: boolean;
  criadoEm: string;
}

export default function PerfilPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['perfil', 'me'],
    queryFn: () => apiFetch<{ status: string; data: PerfilUsuario }>('/api/usuarios/me'),
    staleTime: 60_000,
  });

  const usuario = data?.data;

  return (
    <div className="p-6 md:p-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground">Visualize seus dados e gerencie sua senha.</p>
      </div>

      {/* Dados do perfil */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-base">Dados da conta</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : isError || !usuario ? (
            <p className="text-sm text-destructive">Não foi possível carregar o perfil.</p>
          ) : (
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Nome</dt>
                <dd className="text-sm text-foreground font-medium">{usuario.nome}</dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">E-mail</dt>
                <dd className="text-sm text-foreground">{usuario.email}</dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Papel</dt>
                <dd>
                  <Badge variant="outline" className="text-xs">{usuario.papel}</Badge>
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Matrícula</dt>
                <dd className="text-sm text-foreground">{usuario.matricula || '—'}</dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Curso</dt>
                <dd className="text-sm text-foreground">{usuario.curso || '—'}</dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Turno</dt>
                <dd className="text-sm text-foreground">{usuario.turnoId || '—'}</dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Cartão RFID</dt>
                <dd className="text-sm font-mono text-foreground">
                  {usuario.cartaoId ? (
                    <span className="bg-muted px-2 py-0.5 rounded text-xs">{usuario.cartaoId}</span>
                  ) : (
                    <span className="text-muted-foreground">Nenhum cartão vinculado</span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Expiração da conta</dt>
                <dd className="text-sm text-foreground">
                  {usuario.dataExpiracao
                    ? format(new Date(usuario.dataExpiracao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : '—'}
                </dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Troca de senha */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-base">Alterar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <TrocarSenhaForm />
        </CardContent>
      </Card>
    </div>
  );
}