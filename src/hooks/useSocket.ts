'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;

    if (!url) {
      console.warn('NEXT_PUBLIC_SOCKET_URL não definida. WebSocket offline.');
      return;
    }

    const socketInstance = io(url, {
      transports: ['websocket'],
      withCredentials: true, // envia o cookie HttpOnly para autenticar no socket
      autoConnect: true,
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket.io connection error:', err.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket };
}