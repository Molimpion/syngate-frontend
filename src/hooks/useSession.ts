'use client';

import { useState, useEffect } from 'react';
import { getSessionAction } from '@/actions/auth';
import { JwtPayload } from '@/types';

export function useSession() {
  const [session, setSession] = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      const data = await getSessionAction();
      setSession(data);
      setIsLoading(false);
    }
    fetchSession();
  }, []);

  return { session, isLoading };
}