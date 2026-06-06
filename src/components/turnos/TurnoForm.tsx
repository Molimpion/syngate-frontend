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
import { DiasSemanaSelector } from '@/components/turnos/DiasSemanaSelector';
import type { SalvarTurnoPayload, Turno } from '@/services/turnos.service';
import { minutesToTime, timeToMinutes } from '@/utils/time';

const turnoSchema = z
  .object({
    nome: z.string().min(2, 'Informe o nome do turno.'),
    horaInicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Informe o horário inicial em HH:MM.'),
    horaFim: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Informe o horário final em HH:MM.'),
    diasSemana: z.array(z.number().int().min(0).max(6)).min(1, 'Selecione ao menos um dia da semana.'),
  })
  .refine((values) => timeToMinutes(values.horaFim) > timeToMinutes(values.horaInicio), {
    path: ['horaFim'],
    message: 'O horário final deve ser maior que o inicial.',
  });

type TurnoFormValues = z.infer<typeof turnoSchema>;

interface TurnoFormProps {
  modo: 'criar' | 'editar';
  valoresIniciais?: Turno;
  isSubmitting?: boolean;
  onSubmit: (values: SalvarTurnoPayload) => Promise<void>;
}

export function TurnoForm({ modo, valoresIniciais, isSubmitting, onSubmit }: TurnoFormProps) {
  const form = useForm<TurnoFormValues>({
    resolver: zodResolver(turnoSchema),
    defaultValues: {
      nome: valoresIniciais?.nome ?? '',
      horaInicio: valoresIniciais ? minutesToTime(valoresIniciais.horaInicio) : '08:00',
      horaFim: valoresIniciais ? minutesToTime(valoresIniciais.horaFim) : '12:00',
      diasSemana: valoresIniciais?.diasSemana ?? [1, 2, 3, 4, 5],
    },
  });

  useEffect(() => {
    form.reset({
      nome: valoresIniciais?.nome ?? '',
      horaInicio: valoresIniciais ? minutesToTime(valoresIniciais.horaInicio) : '08:00',
      horaFim: valoresIniciais ? minutesToTime(valoresIniciais.horaFim) : '12:00',
      diasSemana: valoresIniciais?.diasSemana ?? [1, 2, 3, 4, 5],
    });
  }, [form, valoresIniciais]);

  async function handleSubmit(values: TurnoFormValues) {
    await onSubmit({
      nome: values.nome.trim(),
      horaInicio: timeToMinutes(values.horaInicio),
      horaFim: timeToMinutes(values.horaFim),
      diasSemana: values.diasSemana,
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
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Manha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="horaInicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horario inicio</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="horaFim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horario fim</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="diasSemana"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dias da semana</FormLabel>
              <FormControl>
                <DiasSemanaSelector value={field.value} onChange={field.onChange} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : modo === 'criar' ? 'Criar turno' : 'Salvar alteracoes'}
          </Button>
          <Button asChild variant="outline" type="button">
            <Link href="/turnos">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
