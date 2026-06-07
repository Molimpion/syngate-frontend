'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { useSession } from '@/hooks/useSession';
import { listarSalas, type Sala } from '@/services/salas.service';

const PAGE_SIZE = 20;

export default function SalasPage() {
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

  const salasQuery = useQuery({
    queryKey: ['salas', page, debouncedSearch],
    queryFn: () => listarSalas({ page, limit: PAGE_SIZE, search: debouncedSearch }),
  });

  const canAccess = session?.papel === 'GESTOR' || session?.papel === 'COORDENADOR';

  const salasPorBloco = useMemo(() => {
    const salas: Sala[] = salasQuery.data?.data ?? [];

    return salas.reduce<Record<string, Sala[]>>((acc, sala) => {
      const bloco = sala.bloco || 'Sem bloco';
      if (!acc[bloco]) {
        acc[bloco] = [];
      }
      acc[bloco].push(sala);
      return acc;
    }, {});
  }, [salasQuery.data?.data]);

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
          <CardContent>Seu perfil nao possui permissao para acessar as salas.</CardContent>
        </Card>
      </div>
    );
  }

  const blocosOrdenados = Object.keys(salasPorBloco).sort();
  const totalPages = salasQuery.data?.meta?.totalPages ?? 1;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestao de salas</h1>
          <p className="text-sm text-slate-500">Visualize as salas agrupadas por bloco.</p>
        </div>

        <Button asChild>
          <Link href="/salas/nova">Nova sala</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Salas cadastradas</CardTitle>
            <Input
              placeholder="Buscar por nome ou bloco"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {salasQuery.isLoading ? (
            <p className="text-sm text-slate-500">Carregando salas...</p>
          ) : salasQuery.isError ? (
            <p className="text-sm text-destructive">Erro ao carregar salas.</p>
          ) : blocosOrdenados.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma sala encontrada.</p>
          ) : (
            <>
              {blocosOrdenados.map((bloco) => (
                <div key={bloco} className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Bloco {bloco}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Bloco</TableHead>
                        <TableHead className="text-right">Acoes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salasPorBloco[bloco].map((sala) => (
                        <TableRow key={sala.id}>
                          <TableCell className="font-medium">{sala.nome}</TableCell>
                          <TableCell>{sala.bloco}</TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/salas/${sala.id}`}>Editar</Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}

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
