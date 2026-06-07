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

// ─── Logs de Acesso (Socket.io) ────────────────────────────────────────────

export interface AccessLog {
  id: string;
  usuarioId: string;
  salaId: string;
  tipo: TipoAcesso;
  horario: string | Date;
  usuarioNome?: string;
  salaNome?: string;
}

// ─── Logs de Acesso (Relatórios / API REST) ────────────────────────────────

export interface AccessLogDetail {
  id: string;
  dataHora: string;
  status: TipoAcesso;
  direcao: string;
  motivo?: string | null;
  uidCartao?: string | null;
  usuario?: {
    nome: string;
    papel: PapelUsuario;
    matricula: string;
  } | null;
  dispositivo: {
    nome: string;
    sala: {
      nome: string;
      bloco?: string;
    };
  };
}

// ─── Relatórios ────────────────────────────────────────────────────────────

export interface ReportFilters {
  dataInicio?: string;
  dataFim?: string;
  status?: string;
  usuarioId?: string;
  dispositivoId?: string;
}

/** Shape real retornado pelo backend em GET /reports/dashboard */
export interface DashboardReportResponse {
  resumo: {
    totalAcessos: number;
    porStatus: { status: string; _count: number }[];
    porDirecao: { direcao: string; _count: number }[];
  };
  detalhes: AccessLogDetail[];
}

// ─── Dispositivos ──────────────────────────────────────────────────────────

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