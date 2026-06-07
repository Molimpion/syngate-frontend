'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AccessLogDetail } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 20;

export function ReportsTable({ logs }: { logs: AccessLogDetail[] }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const paginated = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reseta para página 1 sempre que os logs mudarem (novo filtro aplicado)
  useEffect(() => {
    setPage(1);
  }, [logs]);

  return (
    <div className="space-y-4">
      {/* Tabela */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Usuário / UID</TableHead>
              <TableHead>Sala / Dispositivo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Motivo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
            {paginated.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs whitespace-nowrap text-foreground">
                  {new Date(log.dataHora).toLocaleString('pt-BR')}
                </TableCell>

                <TableCell>
                  {log.usuario ? (
                    <div>
                      <p className="font-semibold text-foreground">{log.usuario.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.usuario.papel} • {log.usuario.matricula}
                      </p>
                    </div>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700"
                    >
                      Cartão Desconhecido ({log.uidCartao})
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  <p className="font-medium text-foreground">
                    {log.dispositivo.sala.nome}{' '}
                    {log.dispositivo.sala.bloco && `(${log.dispositivo.sala.bloco})`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.dispositivo.nome} • {log.direcao}
                  </p>
                </TableCell>

                <TableCell>
                  <Badge
                    className={
                      log.status === 'CONCEDIDO'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-red-500 text-white'
                    }
                  >
                    {log.status}
                  </Badge>
                </TableCell>

                <TableCell
                  className="text-xs max-w-[200px] truncate text-muted-foreground"
                  title={log.motivo || '-'}
                >
                  {log.motivo || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages} · {logs.length} registros
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Páginas numeradas — mostra até 5 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === 'ellipsis' ? (
                  <span key={`ellipsis-${i}`} className="text-muted-foreground px-1">…</span>
                ) : (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    size="icon-sm"
                    onClick={() => setPage(p as number)}
                    className={p === page ? 'bg-[#004a99] text-white hover:bg-[#003d7d]' : ''}
                  >
                    {p}
                  </Button>
                )
              )}

            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}