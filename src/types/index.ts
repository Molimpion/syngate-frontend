// ─── Enums e tipos primitivos ──────────────────────────────────────────────

export type PapelUsuario =
  | 'ALUNO'
  | 'PROFESSOR'
  | 'FUNCIONARIO'
  | 'COORDENADOR'
  | 'GESTOR'
  | 'VISITANTE';

export type TipoDispositivo = 'CATRACA' | 'LEITOR_QR' | 'TOTEM';

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

export interface ReportFilters {
  dataInicio?: string;
  dataFim?: string;
  usuarioId?: string;
  dispositivoId?: string;
  status?: string;
}

export interface AccessLogDetail {
  id: string;
  dataHora: string;
  status: 'CONCEDIDO' | 'NEGADO';
  finalidade: string;
  direcao: 'ENTRADA' | 'SAIDA';
  motivo?: string;
  uidCartao: string;
  usuario?: {
    nome: string;
    matricula: string;
    papel: string;
  };
  dispositivo: {
    nome: string;
    sala: {
      nome: string;
      bloco?: string;
    };
  };
}

export interface DashboardReportResponse {
  resumo: {
    totalAcessos: number;
    porStatus: { status: string; _count: number }[];
    porDirecao: { direcao: string; _count: number }[];
  };
  detalhes: AccessLogDetail[];
}