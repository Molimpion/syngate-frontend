'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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
import { trocarSenha } from '@/services/perfil.service';

const trocarSenhaSchema = z
  .object({
    senhaAtual: z.string().min(1, 'Informe sua senha atual.'),
    novaSenha: z
      .string()
      .min(8, 'A nova senha deve ter no minimo 8 caracteres.')
      .regex(/[A-Z]/, 'A nova senha deve conter ao menos 1 letra maiuscula.')
      .regex(/[0-9]/, 'A nova senha deve conter ao menos 1 numero.'),
    confirmarNovaSenha: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((values) => values.novaSenha === values.confirmarNovaSenha, {
    path: ['confirmarNovaSenha'],
    message: 'As senhas nao conferem.',
  });

type TrocarSenhaFormValues = z.infer<typeof trocarSenhaSchema>;

export function TrocarSenhaForm() {
  const [tentativasFalhas, setTentativasFalhas] = useState(0);
  const [bloqueadoAte, setBloqueadoAte] = useState<number | null>(null);
  const [agora, setAgora] = useState(Date.now());

  const form = useForm<TrocarSenhaFormValues>({
    resolver: zodResolver(trocarSenhaSchema),
    defaultValues: {
      senhaAtual: '',
      novaSenha: '',
      confirmarNovaSenha: '',
    },
  });

  const isBloqueado = Boolean(bloqueadoAte && bloqueadoAte > agora);

  useEffect(() => {
    if (!isBloqueado) {
      return;
    }

    const timer = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isBloqueado]);

  useEffect(() => {
    if (!bloqueadoAte || bloqueadoAte <= Date.now()) {
      return;
    }

    const timeoutMs = bloqueadoAte - Date.now();
    const timeoutId = setTimeout(() => {
      setTentativasFalhas(0);
      setBloqueadoAte(null);
      setAgora(Date.now());
    }, timeoutMs);

    return () => clearTimeout(timeoutId);
  }, [bloqueadoAte]);

  const segundosRestantes = useMemo(() => {
    if (!isBloqueado || !bloqueadoAte) {
      return 0;
    }

    return Math.max(0, Math.ceil((bloqueadoAte - agora) / 1000));
  }, [agora, bloqueadoAte, isBloqueado]);

  const trocarSenhaMutation = useMutation({
    mutationFn: (payload: { senhaAtual: string; novaSenha: string }) => trocarSenha(payload),
    onSuccess: () => {
      setTentativasFalhas(0);
      setBloqueadoAte(null);
      form.reset({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' });
      toast.success('Senha alterada com sucesso.');
    },
    onError: () => {
      const novasTentativas = tentativasFalhas + 1;
      setTentativasFalhas(novasTentativas);

      if (novasTentativas >= 3) {
        setBloqueadoAte(Date.now() + 30_000);
      }

      toast.error('Nao foi possivel alterar a senha. Verifique os dados e tente novamente.');
    },
  });

  async function handleSubmit(values: TrocarSenhaFormValues) {
    if (isBloqueado) {
      return;
    }

    await trocarSenhaMutation.mutateAsync({
      senhaAtual: values.senhaAtual,
      novaSenha: values.novaSenha,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="senhaAtual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha atual</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="current-password" disabled={isBloqueado || trocarSenhaMutation.isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="novaSenha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" disabled={isBloqueado || trocarSenhaMutation.isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmarNovaSenha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nova senha</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" disabled={isBloqueado || trocarSenhaMutation.isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isBloqueado && (
          <p className="text-sm text-amber-700">
            Formulario bloqueado temporariamente. Tente novamente em {segundosRestantes}s.
          </p>
        )}

        <Button type="submit" disabled={isBloqueado || trocarSenhaMutation.isPending}>
          {trocarSenhaMutation.isPending ? 'Salvando...' : 'Alterar senha'}
        </Button>
      </form>
    </Form>
  );
}
