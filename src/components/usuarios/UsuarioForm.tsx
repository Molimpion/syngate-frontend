'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { criarUsuario, atualizarUsuario, listarTurnos, type Turno } from '@/services/usuarios.service';
import type { PapelUsuario } from '@/types';

const papeisPermitidos: PapelUsuario[] = ['ALUNO', 'PROFESSOR', 'FUNCIONARIO', 'COORDENADOR', 'GESTOR', 'VISITANTE'];

const schemaBase = z.object({
  nome:      z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  email:     z.string().email('Formato de e-mail inválido.'),
  papel:     z.enum(['ALUNO', 'PROFESSOR', 'FUNCIONARIO', 'COORDENADOR', 'GESTOR', 'VISITANTE']),
  matricula: z.string().optional(),
  curso:     z.string().optional(),
  turnoId:   z.string().optional(),
});

const schemaCriacao = schemaBase.extend({
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

const schemaEdicao = schemaBase;

type UsuarioCreateFormValues = z.infer<typeof schemaCriacao>;
type UsuarioEditFormValues   = z.infer<typeof schemaEdicao>;

interface UsuarioFormProps {
  modo: 'criar' | 'editar';
  usuarioId?: string;
  valoresIniciais?: {
    nome: string;
    email: string;
    papel: PapelUsuario;
    matricula?: string | null;
    curso?: string | null;
    turnoId?: string | null;
  };
}

const selectClass =
  'flex h-8 w-full rounded-lg border border-input bg-background text-foreground px-3 text-sm transition-colors focus:outline-none focus:border-ring';

export function UsuarioForm({ modo, usuarioId, valoresIniciais }: UsuarioFormProps) {
  const isCriacao = modo === 'criar';
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<UsuarioCreateFormValues | UsuarioEditFormValues>({
    resolver: zodResolver(isCriacao ? schemaCriacao : schemaEdicao),
    defaultValues: {
      nome:      valoresIniciais?.nome      ?? '',
      email:     valoresIniciais?.email     ?? '',
      senha:     '',
      papel:     valoresIniciais?.papel     ?? 'ALUNO',
      matricula: valoresIniciais?.matricula ?? '',
      curso:     valoresIniciais?.curso     ?? '',
      turnoId:   valoresIniciais?.turnoId   ?? '',
    },
  });

  const turnosQuery = useQuery({
    queryKey: ['turnos-form'],
    queryFn: listarTurnos,
    staleTime: 60_000,
  });

  useEffect(() => {
    form.reset({
      nome:      valoresIniciais?.nome      ?? '',
      email:     valoresIniciais?.email     ?? '',
      senha:     '',
      papel:     valoresIniciais?.papel     ?? 'ALUNO',
      matricula: valoresIniciais?.matricula ?? '',
      curso:     valoresIniciais?.curso     ?? '',
      turnoId:   valoresIniciais?.turnoId   ?? '',
    });
  }, [form, valoresIniciais]);

  const turnos: Turno[] = turnosQuery.data?.data ?? [];

  const onSubmit = async (values: UsuarioCreateFormValues | UsuarioEditFormValues) => {
    try {
      if (isCriacao) {
        await criarUsuario(values as UsuarioCreateFormValues);
        toast.success('Usuário criado com sucesso!');
      } else if (usuarioId) {
        await atualizarUsuario(usuarioId, values);
        toast.success('Usuário atualizado com sucesso!');
      }

      // Invalida o cache para a listagem refletir a mudança
      await queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      if (usuarioId) {
        await queryClient.invalidateQueries({ queryKey: ['usuario', usuarioId] });
      }

      router.push('/dashboard/usuarios');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro ao salvar usuário.';
      toast.error(msg);
    }
  };

  return (
    <Form {...form}>
      {/* div em vez de form — padrão do projeto */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          <FormField control={form.control} name="nome" render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl><Input placeholder="Nome completo" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl><Input type="email" placeholder="email@exemplo.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {isCriacao && (
            <FormField control={form.control} name="senha" render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl><Input type="password" placeholder="Mínimo 6 caracteres" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          <FormField control={form.control} name="papel" render={({ field }) => (
            <FormItem>
              <FormLabel>Papel</FormLabel>
              <FormControl>
                <select className={selectClass} value={field.value} onChange={field.onChange}>
                  {papeisPermitidos.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="matricula" render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula</FormLabel>
              <FormControl><Input placeholder="Opcional" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="curso" render={({ field }) => (
            <FormItem>
              <FormLabel>Curso</FormLabel>
              <FormControl><Input placeholder="Opcional" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="turnoId" render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Turno</FormLabel>
              <FormControl>
                <select className={selectClass} value={field.value ?? ''} onChange={field.onChange}>
                  <option value="">Sem turno</option>
                  {turnos.map((turno) => (
                    <option key={turno.id} value={turno.id}>{turno.nome}</option>
                  ))}
                </select>
              </FormControl>
              {turnosQuery.isError && (
                <p className="text-xs text-destructive">Não foi possível carregar os turnos.</p>
              )}
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="bg-[#004a99] hover:bg-[#003d7d] text-white"
          >
            {form.formState.isSubmitting ? 'Salvando...' : 'Salvar usuário'}
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/usuarios">Cancelar</Link>
          </Button>
        </div>
      </div>
    </Form>
  );
}