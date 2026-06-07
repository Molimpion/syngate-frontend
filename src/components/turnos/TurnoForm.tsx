'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
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
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  onSubmit: (values: SalvarTurnoPayload) => Promise<unknown>;
}

function applyTimeMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function TimeInput({ value, onChange, disabled }: TimeInputProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hh, mm] = value.split(':');
  const selectedHour = hh ?? '08';
  const selectedMinute = mm ?? '00';

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(applyTimeMask(e.target.value));
  }

  function selectTime(hour: string, minute: string) {
    onChange(`${hour}:${minute}`);
    setOpen(false);
  }

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center">
        <Input
          placeholder="HH:MM"
          maxLength={5}
          value={value}
          onChange={handleTextChange}
          disabled={disabled}
          className="pr-9"
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          disabled={disabled}
          className={cn(
            "absolute right-2.5 text-muted-foreground hover:text-foreground transition-colors",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          <Clock className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-48 rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
          <div className="flex divide-x divide-border">
            {/* Coluna de horas */}
            <div className="flex-1 flex flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest text-center py-1.5 border-b border-border">
                Hora
              </span>
              <div className="overflow-y-auto max-h-64 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => selectTime(h, selectedMinute)}
                    className={cn(
                      "w-full text-center text-sm py-1.5 transition-colors",
                      selectedHour === h
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Coluna de minutos */}
            <div className="flex-1 flex flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest text-center py-1.5 border-b border-border">
                Min
              </span>
              <div className="overflow-y-auto max-h-64 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
                {MINUTES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => selectTime(selectedHour, m)}
                    className={cn(
                      "w-full text-center text-sm py-1.5 transition-colors",
                      selectedMinute === m
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
                <Input placeholder="Ex: Manhã" {...field} />
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
                <FormLabel>Horário início</FormLabel>
                <FormControl>
                  <TimeInput
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
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
                <FormLabel>Horário fim</FormLabel>
                <FormControl>
                  <TimeInput
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
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
                <DiasSemanaSelector
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
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
            {isSubmitting ? 'Salvando...' : modo === 'criar' ? 'Criar turno' : 'Salvar alterações'}
          </Button>
          <Button asChild variant="outline" type="button">
            <Link href="/turnos">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}