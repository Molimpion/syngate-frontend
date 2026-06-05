'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';

const COOKIE_NAME = 'syngate_token';

export async function loginAction(payload: any) {
  try {
    // Chama o endpoint de login
    const data = await apiFetch<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // Debug: Verifica a estrutura que chega
    // console.log("Dados recebidos:", data);

    // Correção: O backend devolve { status: "success", data: { accessToken: "..." } }
    // Precisamos de ir buscar o token dentro de data -> data -> accessToken
    const token = data?.data?.accessToken;

    if (!token) {
      console.error("Token não encontrado na estrutura recebida:", JSON.stringify(data, null, 2));
      throw new Error("Token não recebido do backend.");
    }

    // Configuração do Cookie
    (await cookies()).set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true em produção (HTTPS), false em dev
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return { success: true };
  } catch (error: any) {
    console.error("Erro no loginAction:", error);
    return { success: false, error: error.message || 'Erro ao realizar login.' };
  }
}

export async function getSessionAction() {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;

    // Decodificação básica do JWT para ler o payload
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(base64)));
  } catch {
    return null;
  }
}

export async function logoutAction() {
  (await cookies()).delete(COOKIE_NAME);
  redirect('/login');
}