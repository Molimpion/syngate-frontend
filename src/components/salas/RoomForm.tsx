'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import type { Sala, SalvarSalaPayload } from '@/services/salas.service';

const roomSchema = z.object({
  nome: z.string().min(1, 'Informe o nome da sala.'),
  bloco: z.string().min(1, 'Informe o bloco.'),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface RoomFormProps {
  modo: 'criar' | 'editar';
  valoresIniciais?: Sala;
  isSubmitting?: boolean;
  onSubmit: (values: SalvarSalaPayload) => Promise<unknown>;
}

export function RoomForm({ modo, valoresIniciais, isSubmitting, onSubmit }: RoomFormProps) {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      nome: valoresIniciais?.nome ?? '',
      bloco: valoresIniciais?.bloco ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      nome: valoresIniciais?.nome ?? '',
      bloco: valoresIniciais?.bloco ?? '',
    });
  }, [form, valoresIniciais]);

  async function handleSubmit(values: RoomFormValues) {
    await onSubmit({
      nome: values.nome.trim(),
      bloco: values.bloco.trim().toUpperCase(),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da sala</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Laboratório 01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bloco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bloco</FormLabel>
              <FormControl>
                <Input placeholder="Ex: A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#004a99] hover:bg-[#003d7d] text-white"
          >
            {isSubmitting ? 'Salvando...' : modo === 'criar' ? 'Criar sala' : 'Salvar alterações'}
          </Button>
          <Button asChild variant="outline" type="button">
            <Link href="/salas">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}