'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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

const selectClass =
  'flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground shadow-sm transition-colors outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 dark:bg-input/30';

export function DeviceForm({ initialData }: DeviceFormProps) {
  const router = useRouter();
  const [salas, setSalas] = useState<Sala[]>([]);

  const form = useForm<FormData>({
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
      router.push('/devices');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro ao salvar dispositivo.';
      toast.error(msg);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Dispositivo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Catraca Entrada Principal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <select {...field} className={selectClass}>
                    <option value="CATRACA">Catraca</option>
                    <option value="LEITOR_CARTAO">Leitor de Cartão</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sala / Local</FormLabel>
                <FormControl>
                  <select {...field} className={selectClass}>
                    <option value="">Selecione...</option>
                    {salas.map((sala) => (
                      <option key={sala.id} value={sala.id}>
                        {sala.nome} {sala.bloco && `(${sala.bloco})`}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="enderecoMac"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MAC Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="AA:BB:CC:DD:EE:FF"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ipLocal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP Local (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="192.168.1.100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-2 bg-[#004a99] hover:bg-[#003d7d] text-white"
        >
          {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Dispositivo'}
        </Button>
      </form>
    </Form>
  );
}