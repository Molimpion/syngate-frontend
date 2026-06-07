'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilterX } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Device } from '@/types';

interface UsuarioBasico {
  id: string;
  nome: string;
}

const selectClass =
  'flex h-8 w-full rounded-lg border border-input bg-background text-foreground px-2.5 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:border-ring';

export function ReportsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [usuarios, setUsuarios] = useState<UsuarioBasico[]>([]);
  const [dispositivos, setDispositivos] = useState<Device[]>([]);

  useEffect(() => {
    apiFetch<{ data: UsuarioBasico[] }>('/users?limit=200')
      .then((res) => setUsuarios(res.data))
      .catch(() => {});

    apiFetch<{ data: Device[] }>('/devices')
      .then((res) => setDispositivos(res.data))
      .catch(() => {});
  }, []);

  const handleChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/dashboard/reports');
  };

  return (
    <div className="bg-card p-4 rounded-xl border border-border shadow-sm mb-6 flex flex-wrap gap-4 items-end">

      <div className="space-y-1.5 flex-1 min-w-[140px]">
        <Label>Data Início</Label>
        <Input
          type="date"
          value={searchParams.get('dataInicio') || ''}
          onChange={(e) => handleChange('dataInicio', e.target.value)}
        />
      </div>

      <div className="space-y-1.5 flex-1 min-w-[140px]">
        <Label>Data Fim</Label>
        <Input
          type="date"
          value={searchParams.get('dataFim') || ''}
          onChange={(e) => handleChange('dataFim', e.target.value)}
        />
      </div>

      <div className="space-y-1.5 flex-1 min-w-[140px]">
        <Label>Usuário</Label>
        <select
          className={selectClass}
          value={searchParams.get('usuarioId') || ''}
          onChange={(e) => handleChange('usuarioId', e.target.value)}
        >
          <option value="">Todos</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>{u.nome}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5 flex-1 min-w-[140px]">
        <Label>Dispositivo</Label>
        <select
          className={selectClass}
          value={searchParams.get('dispositivoId') || ''}
          onChange={(e) => handleChange('dispositivoId', e.target.value)}
        >
          <option value="">Todos</option>
          {dispositivos.map((d) => (
            <option key={d.id} value={d.id}>{d.nome}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5 flex-1 min-w-[120px]">
        <Label>Status</Label>
        <select
          className={selectClass}
          value={searchParams.get('status') || ''}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="">Todos</option>
          <option value="CONCEDIDO">Concedido</option>
          <option value="NEGADO">Negado</option>
        </select>
      </div>

      <Button variant="outline" onClick={clearFilters} className="h-8 shrink-0">
        <FilterX className="h-4 w-4 mr-2" /> Limpar
      </Button>
    </div>
  );
}