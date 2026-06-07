'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsuarioForm } from '@/components/usuarios/UsuarioForm';
import { criarUsuario, type CriarUsuarioPayload } from '@/services/usuarios.service';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CriarUsuarioPayload) => criarUsuario(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuário criado com sucesso.');
      router.push('/usuarios');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erro ao criar usuário.';
      toast.error(message);
    },
  });

  async function handleSubmit(values: CriarUsuarioPayload) {
    await createMutation.mutateAsync({
      ...values,
      matricula: values.matricula?.trim() || undefined,
      curso: values.curso?.trim() || undefined,
      turnoId: values.turnoId?.trim() || undefined,
    });
  }

  return (
    <div className="p-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Novo usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <UsuarioForm modo="criar" onSubmit={handleSubmit} isSubmitting={createMutation.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
