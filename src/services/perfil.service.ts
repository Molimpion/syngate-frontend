import { apiFetch } from '@/lib/api';
import type { Usuario } from '@/services/usuarios.service';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

export interface TrocarSenhaPayload {
  senhaAtual: string;
  novaSenha: string;
}

export async function buscarPerfil() {
  return apiFetch<ApiResponse<Usuario>>('/api/usuarios/me');
}

export async function trocarSenha(payload: TrocarSenhaPayload) {
  return apiFetch<ApiResponse<{ message?: string }>>('/api/perfil/trocar-senha', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
