export type PapelUsuario = 'ADMIN' | 'GESTOR' | 'PROFESSOR' | 'ALUNO' | 'PORTARIA';
export type TipoDispositivo = 'CATRACA' | 'LEITOR_QR' | 'TOTEM';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface JwtPayload {
  sub: string;
  papel: PapelUsuario;
  exp?: number;
}

export interface TokenResponse {
  accessToken: string;
}