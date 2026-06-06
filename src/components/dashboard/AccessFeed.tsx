'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { AccessLog } from '@/types';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export function AccessFeed() {
  const { socket } = useSocket();
  const [logs, setLogs] = useState<AccessLog[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleNewAccess = (newLog: AccessLog) => {
      setLogs((prev) => [newLog, ...prev].slice(0, 50));
    };

    socket.on('access:new', handleNewAccess);

    return () => {
      socket.off('access:new', handleNewAccess);
    };
  }, [socket]);

  return (
    <div className="space-y-3">
      {logs.length === 0 ? (
        <p className="text-sm text-slate-400">Aguardando novos acessos...</p>
      ) : (
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg border border-slate-100"
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">
                  {log.usuarioNome || 'Usuário Desconhecido'}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(log.horario).toLocaleTimeString()} {log.salaNome && `- ${log.salaNome}`}
                </span>
              </div>
              
              <Badge 
                variant={log.tipo === 'CONCEDIDO' ? 'default' : 'destructive'}
                className={log.tipo === 'CONCEDIDO' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}
              >
                {log.tipo}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}