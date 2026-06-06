'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { AccessLog } from '@/types';

export function AccessFeed() {
  const { socket } = useSocket();
  const [logs, setLogs] = useState<AccessLog[]>([]);

  useEffect(() => {
    // A segurança essencial: se socket for null, não faz nada
    if (!socket) return;

    const handleNewAccess = (newLog: AccessLog) => {
      setLogs((prev) => [newLog, ...prev].slice(0, 50));
    };

    // Agora o TypeScript e o Runtime sabem que socket existe
    socket.on('access:new', handleNewAccess);

    // Limpeza ao desmontar
    return () => {
      socket.off('access:new', handleNewAccess);
    };
  }, [socket]); // O useEffect depende do socket

  return (
    <div className="space-y-4">
      {logs.length === 0 ? (
        <p className="text-sm text-slate-400">Aguardando novos acessos...</p>
      ) : (
        logs.map((log) => (
          <div key={log.id} className="text-sm p-2 border-b border-slate-100">
             {log.usuarioNome} - {log.tipo} ({new Date(log.horario).toLocaleTimeString()})
          </div>
        ))
      )}
    </div>
  );
}