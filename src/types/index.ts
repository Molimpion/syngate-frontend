export type PapelUsuario = 
  | 'ALUNO' 
  | 'PROFESSOR' 
  | 'FUNCIONARIO' 
  | 'COORDENADOR' 
  | 'GESTOR' 
  | 'VISITANTE';

export type TipoDispositivo = 'CATRACA' | 'LEITOR_QR' | 'TOTEM';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface JwtPayload {
  sub: string;
  papel: PapelUsuario;
  nome: string;
  exp?: number;
}

export interface TokenResponse {
  accessToken: string;
}

export type TipoAcesso = 'CONCEDIDO' | 'NEGADO';

export interface AccessLog {
  id: string;
  usuarioId: string;
  salaId: string;
  tipo: TipoAcesso;
  horario: string | Date;
  usuarioNome?: string;
  salaNome?: string;
}