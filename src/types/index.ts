// ─── Enums e tipos primitivos ──────────────────────────────────────────────

export type PapelUsuario =
  | 'ALUNO'
  | 'PROFESSOR'
  | 'FUNCIONARIO'
  | 'COORDENADOR'
  | 'GESTOR'
  | 'VISITANTE';

export type TipoDispositivo = 'CATRACA' | 'LEITOR_CARTAO';

/** Status de um evento de acesso — deve bater com o enum do backend */
export type TipoAcesso = 'CONCEDIDO' | 'NEGADO';

// ─── Auth ──────────────────────────────────────────────────────────────────

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

// ─── Logs de Acesso ────────────────────────────────────────────────────────

/**
 * Shape do evento `access:new` emitido pelo Socket.io do backend.
 * Campos opcionais refletem joins que o backend pode ou não incluir.
 */
export interface AccessLog {
  id: string;
  usuarioId: string;
  salaId: string;
  tipo: TipoAcesso;
  /** ISO 8601 string ou Date — use `new Date(log.horario)` para formatar */
  horario: string | Date;
  usuarioNome?: string;
  salaNome?: string;
}

export type StatusDispositivo = 'ATIVO' | 'INATIVO' | 'MANUTENCAO';

export interface Device {
  id: string;
  nome: string;
  tipo: TipoDispositivo;
  status: StatusDispositivo;
  enderecoMac: string;
  ipLocal?: string;
  salaId: string;
}

export interface Sala {
  id: string;
  nome: string;
  bloco?: string;
}