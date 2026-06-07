'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilterX } from 'lucide-react';

export function ReportsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 flex flex-wrap gap-4 items-end">
      <div className="space-y-1.5 flex-1 min-w-[150px]">
        <Label>Data Início</Label>
        <Input 
          type="date" 
          value={searchParams.get('dataInicio') || ''} 
          onChange={(e) => handleChange('dataInicio', e.target.value)} 
        />
      </div>
      <div className="space-y-1.5 flex-1 min-w-[150px]">
        <Label>Data Fim</Label>
        <Input 
          type="date" 
          value={searchParams.get('dataFim') || ''} 
          onChange={(e) => handleChange('dataFim', e.target.value)} 
        />
      </div>
      <div className="space-y-1.5 flex-1 min-w-[150px]">
        <Label>Status</Label>
        <select 
          className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm shadow-sm"
          value={searchParams.get('status') || ''} 
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="">Todos</option>
          <option value="CONCEDIDO">Concedido</option>
          <option value="NEGADO">Negado</option>
        </select>
      </div>
      <Button variant="outline" onClick={clearFilters} className="h-8">
        <FilterX className="h-4 w-4 mr-2" /> Limpar
      </Button>
    </div>
  );
}