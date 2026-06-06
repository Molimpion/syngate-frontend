'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatarDiasSemana } from '@/components/turnos/DiasSemanaSelector';
import { useSession } from '@/hooks/useSession';
import { listarTurnos, type Turno } from '@/services/turnos.service';
import { minutesToTime } from '@/utils/time';

const PAGE_SIZE = 10;

export default function TurnosPage() {
  const { session, isLoading } = useSession();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const turnosQuery = useQuery({
    queryKey: ['turnos', page, debouncedSearch],
    queryFn: () => listarTurnos({ page, limit: PAGE_SIZE, search: debouncedSearch }),
  });

  const canAccess = session?.papel === 'GESTOR' || session?.papel === 'COORDENADOR';

  if (isLoading) {
    return <div className="p-6">Carregando sessao...</div>;
  }

  if (!canAccess) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Acesso restrito</CardTitle>
          </CardHeader>
          <CardContent>Seu perfil nao possui permissao para acessar os turnos.</CardContent>
        </Card>
      </div>
    );
  }

  const turnos: Turno[] = turnosQuery.data?.data ?? [];
  const totalPages = turnosQuery.data?.meta?.totalPages ?? 1;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestao de turnos</h1>
          <p className="text-sm text-slate-500">Configure horarios e dias da semana de cada turno.</p>
        </div>

        <Button asChild>
          <Link href="/turnos/novo">Novo turno</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Turnos cadastrados</CardTitle>
            <Input
              placeholder="Buscar por nome"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {turnosQuery.isLoading ? (
            <p className="text-sm text-slate-500">Carregando turnos...</p>
          ) : turnosQuery.isError ? (
            <p className="text-sm text-destructive">Erro ao carregar turnos.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Dias</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turnos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-slate-500">
                        Nenhum turno encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    turnos.map((turno) => (
                      <TableRow key={turno.id}>
                        <TableCell className="font-medium">{turno.nome}</TableCell>
                        <TableCell>
                          {minutesToTime(turno.horaInicio)} - {minutesToTime(turno.horaFim)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{formatarDiasSemana(turno.diasSemana)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/turnos/${turno.id}`}>Editar</Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-slate-500">
                  Pagina {page} de {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page <= 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page >= totalPages}
                  >
                    Proxima
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
