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
import { Device, Sala } from '@/types';

const macRegex = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;

const schema = z.object({
  nome: z.string().min(3, 'Mínimo de 3 caracteres'),
  tipo: z.enum(['CATRACA', 'LEITOR_CARTAO']),
  salaId: z.string().uuid('Selecione uma sala'),
  enderecoMac: z.string().toUpperCase().regex(macRegex, 'Formato: AA:BB:CC:DD:EE:FF'),
  ipLocal: z
    .string()
    .regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'IP inválido')
    .optional()
    .or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface DeviceFormProps {
  initialData?: Device;
}

export function DeviceForm({ initialData }: DeviceFormProps) {
  const router = useRouter();
  const [salas, setSalas] = useState<Sala[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          nome: initialData.nome,
          tipo: initialData.tipo,
          salaId: initialData.salaId,
          enderecoMac: initialData.enderecoMac,
          ipLocal: initialData.ipLocal ?? '',
        }
      : { tipo: 'LEITOR_CARTAO', salaId: '', enderecoMac: '' },
  });

  useEffect(() => {
    DevicesService.listarSalas()
      .then((res) => setSalas(res.data))
      .catch(() => toast.error('Erro ao carregar salas'));
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
      // rota canônica em inglês
      router.push('/dashboard/devices');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro ao salvar dispositivo.';
      toast.error(msg);
    }
  };

  const selectClass =
    'flex h-8 w-full rounded-lg border border-input bg-background text-foreground px-2.5 py-1 text-base shadow-sm transition-colors focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/30';

  return (
    // div com onSubmit via handleSubmit — sem <form> nativo
    <div className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label>Nome do Dispositivo</Label>
        <Input {...register('nome')} placeholder="Ex: Catraca Entrada Principal" />
        {errors.nome && <p className="text-destructive text-xs">{errors.nome.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <select {...register('tipo')} className={selectClass}>
            <option value="CATRACA">Catraca</option>
            <option value="LEITOR_CARTAO">Leitor de Cartão</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Sala / Local</Label>
          <select {...register('salaId')} className={selectClass}>
            <option value="">Selecione...</option>
            {salas.map((sala) => (
              <option key={sala.id} value={sala.id}>
                {sala.nome} {sala.bloco && `(${sala.bloco})`}
              </option>
            ))}
          </select>
          {errors.salaId && <p className="text-destructive text-xs">{errors.salaId.message}</p>}
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
          {errors.enderecoMac && (
            <p className="text-destructive text-xs">{errors.enderecoMac.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>IP Local (Opcional)</Label>
          <Input {...register('ipLocal')} placeholder="192.168.1.100" />
          {errors.ipLocal && (
            <p className="text-destructive text-xs">{errors.ipLocal.message}</p>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="mt-4 bg-[#004a99] hover:bg-[#003d7d] text-white"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar Dispositivo'}
      </Button>
    </div>
  );
}