'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SoftDeleteDialog } from '@/components/usuarios/SoftDeleteDialog';
import { useSession } from '@/hooks/useSession';
import { inativarUsuario, listarUsuarios, reativarUsuario, type Usuario } from '@/services/usuarios.service';

const PAGE_SIZE = 10;

export default function UsuariosPage() {
  const queryClient = useQueryClient();
  const { session, isLoading } = useSession();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const usuariosQuery = useQuery({
    queryKey: ['usuarios', page, debouncedSearch],
    queryFn: () => listarUsuarios({ page, limit: PAGE_SIZE, search: debouncedSearch }),
  });

  const inativarMutation = useMutation({
    mutationFn: (id: string) => inativarUsuario(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuário inativado com sucesso.');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Não foi possível inativar o usuário.';
      toast.error(message);
    },
  });

  const reativarMutation = useMutation({
    mutationFn: (id: string) => reativarUsuario(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuário reativado com sucesso.');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Não foi possível reativar o usuário.';
      toast.error(message);
    },
  });

  const canAccess = session?.papel === 'GESTOR' || session?.papel === 'COORDENADOR';

  if (isLoading) {
    return <div className="p-6">Carregando sessão...</div>;
  }

  if (!canAccess) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Acesso restrito</CardTitle>
          </CardHeader>
          <CardContent>
            Seu perfil não possui permissão para acessar a gestão de usuários.
          </CardContent>
        </Card>
      </div>
    );
  }

  const usuarios: Usuario[] = usuariosQuery.data?.data ?? [];
  const totalPages = usuariosQuery.data?.meta?.totalPages ?? 1;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestão de usuários</h1>
          <p className="text-sm text-slate-500">Cadastre, edite, inative e vincule cartões RFID.</p>
        </div>

        <Button asChild>
          <Link href="/usuarios/novo">Novo usuário</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Usuários cadastrados</CardTitle>
            <Input
              placeholder="Buscar por nome, e-mail ou matrícula"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {usuariosQuery.isLoading ? (
            <p className="text-sm text-slate-500">Carregando usuários...</p>
          ) : usuariosQuery.isError ? (
            <p className="text-sm text-destructive">Erro ao carregar usuários.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-slate-500">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{usuario.papel}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={usuario.ativo ? 'border-emerald-500/40 bg-emerald-50 text-emerald-700' : 'border-slate-300 bg-slate-100 text-slate-500'}
                          >
                            {usuario.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/usuarios/${usuario.id}`}>Editar</Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/usuarios/${usuario.id}/cartao`}>Cartão</Link>
                            </Button>
                            {!usuario.ativo && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={reativarMutation.isPending || inativarMutation.isPending}
                                onClick={() => reativarMutation.mutateAsync(usuario.id)}
                              >
                                Reativar
                              </Button>
                            )}
                            <SoftDeleteDialog
                              usuarioNome={usuario.nome}
                              disabled={!usuario.ativo || inativarMutation.isPending || reativarMutation.isPending}
                              onConfirm={() => inativarMutation.mutateAsync(usuario.id)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-slate-500">
                  Página {page} de {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page <= 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page >= totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
