// src/hooks/useSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    
    if (!url) {
      console.warn("⚠️ NEXT_PUBLIC_SOCKET_URL não definida. WebSocket offline.");
      return;
    }

    const socketInstance = io(url, {
      transports: ['websocket'],
      autoConnect: true,
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket };
}