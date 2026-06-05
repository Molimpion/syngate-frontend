'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export function AccessFeed() {
  const socket = useSocket();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Escuta o evento que o backend emite
    socket.on('access:new', (newLog) => {
      setLogs((prev) => [newLog, ...prev].slice(0, 50));
    });

    return () => { socket.off('access:new'); };
  }, [socket]);

  return (
    <div className="h-[400px] overflow-y-auto space-y-2 p-2 border rounded-lg bg-card">
      <AnimatePresence initial={false}>
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between p-3 border-b last:border-0"
          >
            <div>
              <p className="text-sm font-medium">{log.userName}</p>
              <p className="text-xs text-muted-foreground">{log.doorName}</p>
            </div>
            <Badge variant={log.status === 'CONCEDIDO' ? 'default' : 'destructive'}>
              {log.status}
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}