'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DevicesService } from '@/services/devices.service';
import { Sala } from '@/types';

const macRegex = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;

const schema = z.object({
  nome: z.string().min(3, 'Mínimo de 3 caracteres'),
  tipo: z.enum(['CATRACA', 'LEITOR_CARTAO']),
  salaId: z.string().uuid('Selecione uma sala'),
  enderecoMac: z.string().toUpperCase().regex(macRegex, 'Formato: AA:BB:CC:DD:EE:FF'),
  ipLocal: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'IP inválido').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export function DeviceForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [salas, setSalas] = useState<Sala[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || { tipo: 'LEITOR_CARTAO', salaId: '', enderecoMac: '' },
  });

  useEffect(() => {
    DevicesService.listarSalas().then((res) => setSalas(res.data)).catch(() => toast.error('Erro ao carregar salas'));
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      if (initialData?.id) {
        await DevicesService.atualizar(initialData.id, data);
        toast.success('Dispositivo atualizado!');
      } else {
        await DevicesService.criar(data);
        toast.success('Dispositivo cadastrado!');
      }
      router.push('/dashboard/dispositivos');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label>Nome do Dispositivo</Label>
        <Input {...register('nome')} placeholder="Ex: Catraca Entrada Principal" />
        {errors.nome && <p className="text-red-500 text-xs">{errors.nome.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <select {...register('tipo')} className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base shadow-sm">
            <option value="CATRACA">Catraca</option>
            <option value="LEITOR_CARTAO">Leitor de Cartão</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Sala / Local</Label>
          <select {...register('salaId')} className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base shadow-sm">
            <option value="">Selecione...</option>
            {salas.map((sala) => (
              <option key={sala.id} value={sala.id}>{sala.nome} {sala.bloco && `(${sala.bloco})`}</option>
            ))}
          </select>
          {errors.salaId && <p className="text-red-500 text-xs">{errors.salaId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>MAC Address</Label>
          <Input 
            {...register('enderecoMac')} 
            placeholder="AA:BB:CC:DD:EE:FF" 
            onChange={(e) => setValue('enderecoMac', e.target.value.toUpperCase())}
          />
          {errors.enderecoMac && <p className="text-red-500 text-xs">{errors.enderecoMac.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>IP Local (Opcional)</Label>
          <Input {...register('ipLocal')} placeholder="192.168.1.100" />
          {errors.ipLocal && <p className="text-red-500 text-xs">{errors.ipLocal.message}</p>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-4">{isSubmitting ? 'Salvando...' : 'Salvar Dispositivo'}</Button>
    </form>
  );
}