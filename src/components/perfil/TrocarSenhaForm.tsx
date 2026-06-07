'use client';

import { useState, useEffect } from 'react';
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

const schema = z
  .object({
    senhaAtual:   z.string().min(1, 'Informe a senha atual.'),
    novaSenha:    z
      .string()
      .min(8, 'A nova senha deve ter no mínimo 8 caracteres.')
      .regex(/[A-Z]/, 'A nova senha deve conter ao menos 1 letra maiúscula.')
      .regex(/[0-9]/, 'A nova senha deve conter ao menos 1 número.'),
    confirmarSenha: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((d) => d.novaSenha === d.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  });

type FormValues = z.infer<typeof schema>;

const MAX_TENTATIVAS  = 3;
const LOCKOUT_SECONDS = 30;

export function TrocarSenhaForm() {
  const [tentativas, setTentativas]         = useState(0);
  const [bloqueadoAte, setBloqueadoAte]     = useState<number | null>(null);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { senhaAtual: '', novaSenha: '', confirmarSenha: '' },
  });

  // Countdown do bloqueio
  useEffect(() => {
    if (!bloqueadoAte) return;

    const interval = setInterval(() => {
      const restante = Math.ceil((bloqueadoAte - Date.now()) / 1000);
      if (restante <= 0) {
        setBloqueadoAte(null);
        setSegundosRestantes(0);
        setTentativas(0);
        clearInterval(interval);
      } else {
        setSegundosRestantes(restante);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [bloqueadoAte]);

  const bloqueado = bloqueadoAte !== null && Date.now() < bloqueadoAte;

  const onSubmit = async (values: FormValues) => {
    if (bloqueado) return;

    try {
      const response = await fetch('/api/perfil/trocar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          senhaAtual: values.senhaAtual,
          novaSenha:  values.novaSenha,
        }),
      });

      if (!response.ok) {
        const novasTentativas = tentativas + 1;
        setTentativas(novasTentativas);

        if (novasTentativas >= MAX_TENTATIVAS) {
          setBloqueadoAte(Date.now() + LOCKOUT_SECONDS * 1000);
          setSegundosRestantes(LOCKOUT_SECONDS);
          toast.error('Muitas tentativas incorretas. Aguarde 30 segundos.');
        } else {
          // Erro genérico — sem detalhes sobre o motivo
          toast.error('Não foi possível alterar a senha. Verifique os dados e tente novamente.');
        }
        return;
      }

      // Sucesso — limpa o formulário e zera tentativas
      toast.success('Senha alterada com sucesso!');
      form.reset();
      setTentativas(0);
    } catch {
      toast.error('Erro de conexão. Tente novamente.');
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-4 max-w-md">
        <FormField
          control={form.control}
          name="senhaAtual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha atual</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" disabled={bloqueado} {...field} />
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
                <Input type="password" placeholder="Mín. 8 chars, 1 maiúscula, 1 número" disabled={bloqueado} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmarSenha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nova senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" disabled={bloqueado} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {bloqueado && (
          <p className="text-sm text-destructive">
            Formulário bloqueado. Aguarde {segundosRestantes}s para tentar novamente.
          </p>
        )}

        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting || bloqueado}
          className="bg-[#004a99] hover:bg-[#003d7d] text-white"
        >
          {form.formState.isSubmitting ? 'Salvando...' : 'Alterar senha'}
        </Button>
      </div>
    </Form>
  );
}