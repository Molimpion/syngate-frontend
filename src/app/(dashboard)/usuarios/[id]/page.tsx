'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsuarioForm } from '@/components/usuarios/UsuarioForm';
import {
  atualizarUsuario,
  buscarUsuarioPorId,
  type AtualizarUsuarioPayload,
} from '@/services/usuarios.service';

export default function EditarUsuarioPage() {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const usuarioQuery = useQuery({
    queryKey: ['usuario', userId],
    queryFn: () => buscarUsuarioPorId(userId),
    enabled: Boolean(userId),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: AtualizarUsuarioPayload) => atualizarUsuario(userId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
        queryClient.invalidateQueries({ queryKey: ['usuario', userId] }),
      ]);
      toast.success('Usuário atualizado com sucesso.');
      router.push('/usuarios');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar usuário.';
      toast.error(message);
    },
  });

  async function handleSubmit(values: AtualizarUsuarioPayload) {
    await updateMutation.mutateAsync({
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
          <CardTitle>Editar usuário</CardTitle>
        </CardHeader>
        <CardContent>
          {usuarioQuery.isLoading ? (
            <p className="text-sm text-slate-500">Carregando usuário...</p>
          ) : usuarioQuery.isError || !usuarioQuery.data?.data ? (
            <p className="text-sm text-destructive">Não foi possível carregar os dados do usuário.</p>
          ) : (
            <UsuarioForm
              modo="editar"
              valoresIniciais={usuarioQuery.data.data}
              onSubmit={handleSubmit}
              isSubmitting={updateMutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
