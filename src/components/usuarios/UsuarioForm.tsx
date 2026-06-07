'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { listarTurnos, type Turno } from '@/services/usuarios.service';
import type { PapelUsuario } from '@/types';

const papeisPermitidos: PapelUsuario[] = ['ALUNO', 'PROFESSOR', 'FUNCIONARIO', 'COORDENADOR', 'GESTOR', 'VISITANTE'];

const schemaBase = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  email: z.string().email('Formato de e-mail inválido.'),
  papel: z.enum(['ALUNO', 'PROFESSOR', 'FUNCIONARIO', 'COORDENADOR', 'GESTOR', 'VISITANTE']),
  matricula: z.string().optional(),
  curso: z.string().optional(),
  turnoId: z.string().optional(),
});

const schemaCriacao = schemaBase.extend({
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

const schemaEdicao = schemaBase;

type UsuarioCreateFormValues = z.infer<typeof schemaCriacao>;
type UsuarioEditFormValues = z.infer<typeof schemaEdicao>;

interface UsuarioFormProps {
  modo: 'criar' | 'editar';
  valoresIniciais?: {
    nome: string;
    email: string;
    papel: PapelUsuario;
    matricula?: string | null;
    curso?: string | null;
    turnoId?: string | null;
  };
  isSubmitting?: boolean;
  onSubmit: (values: UsuarioCreateFormValues | UsuarioEditFormValues) => Promise<void>;
}

export function UsuarioForm({ modo, valoresIniciais, isSubmitting, onSubmit }: UsuarioFormProps) {
  const isCriacao = modo === 'criar';

  const form = useForm<UsuarioCreateFormValues | UsuarioEditFormValues>({
    resolver: zodResolver(isCriacao ? schemaCriacao : schemaEdicao),
    defaultValues: {
      nome: valoresIniciais?.nome ?? '',
      email: valoresIniciais?.email ?? '',
      senha: '',
      papel: valoresIniciais?.papel ?? 'ALUNO',
      matricula: valoresIniciais?.matricula ?? '',
      curso: valoresIniciais?.curso ?? '',
      turnoId: valoresIniciais?.turnoId ?? '',
    },
  });

  const turnosQuery = useQuery({
    queryKey: ['turnos-form'],
    queryFn: listarTurnos,
    staleTime: 60_000,
  });

  useEffect(() => {
    form.reset({
      nome: valoresIniciais?.nome ?? '',
      email: valoresIniciais?.email ?? '',
      senha: '',
      papel: valoresIniciais?.papel ?? 'ALUNO',
      matricula: valoresIniciais?.matricula ?? '',
      curso: valoresIniciais?.curso ?? '',
      turnoId: valoresIniciais?.turnoId ?? '',
    });
  }, [form, valoresIniciais]);

  const turnos: Turno[] = turnosQuery.data?.data ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="usuario@dominio.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isCriacao && (
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mínimo de 6 caracteres" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="papel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Papel</FormLabel>
                <FormControl>
                  <select
                    className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {papeisPermitidos.map((papel) => (
                      <option key={papel} value={papel}>
                        {papel}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="matricula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matrícula</FormLabel>
                <FormControl>
                  <Input placeholder="Opcional" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="curso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Curso</FormLabel>
                <FormControl>
                  <Input placeholder="Opcional" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="turnoId"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Turno</FormLabel>
                <FormControl>
                  <select
                    className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                  >
                    <option value="">Sem turno</option>
                    {turnos.map((turno) => (
                      <option key={turno.id} value={turno.id}>
                        {turno.nome}
                      </option>
                    ))}
                  </select>
                </FormControl>
                {turnosQuery.isError && (
                  <p className="text-xs text-destructive">Não foi possível carregar os turnos.</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar usuário'}
          </Button>
          <Button asChild variant="outline" type="button">
            <Link href="/usuarios">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
