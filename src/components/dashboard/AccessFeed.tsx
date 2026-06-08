'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { apiFetch } from '@/lib/api';
import { AccessLog } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

interface RawLog {
  id: string;
  dataHora: string;
  status: 'CONCEDIDO' | 'NEGADO';
  usuario?: { nome: string } | null;
  dispositivo?: { sala?: { nome: string } | null } | null;
}

function rawToAccessLog(raw: RawLog): AccessLog {
  return {
    id: raw.id,
    usuarioId: '',
    salaId: '',
    tipo: raw.status,
    horario: raw.dataHora,
    usuarioNome: raw.usuario?.nome ?? undefined,
    salaNome: raw.dispositivo?.sala?.nome ?? undefined,
  };
}

export function AccessFeed() {
  const { socket } = useSocket();
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega histórico inicial via /reports/dashboard
  useEffect(() => {
    setIsLoading(true);
    apiFetch<{ resumo: unknown; detalhes: RawLog[] }>('/reports/dashboard')
      .then((res) => setLogs((res.detalhes ?? []).map(rawToAccessLog)))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Novos eventos em tempo real
  useEffect(() => {
    if (!socket) return;
    const handleNewAccess = (newLog: AccessLog) => {
      setLogs((prev) => [newLog, ...prev].slice(0, 50));
      setPage(1);
    };
    socket.on('access:new', handleNewAccess);
    return () => { socket.off('access:new', handleNewAccess); };
  }, [socket]);

  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const paginated  = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando acessos...</p>;
  }

  return (
    <div className="space-y-3">
      {logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum acesso registrado.</p>
      ) : (
        <>
          <AnimatePresence initial={false}>
            {paginated.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: -12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {log.usuarioNome || 'Usuário Desconhecido'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.horario).toLocaleString('pt-BR')}
                    {log.salaNome && ` · ${log.salaNome}`}
                  </span>
                </div>
                <Badge
                  className={
                    log.tipo === 'CONCEDIDO'
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }
                >
                  {log.tipo}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Página {page} de {totalPages} · {logs.length} registros
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}