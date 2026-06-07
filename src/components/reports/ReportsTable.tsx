'use client';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AccessLogDetail } from '@/types';

export function ReportsTable({ logs }: { logs: AccessLogDetail[] }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Usuário / UID</TableHead>
            <TableHead>Sala / Dispositivo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Motivo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 && (
            <TableRow><TableCell colSpan={5} className="text-center py-6 text-slate-500">Nenhum registro encontrado.</TableCell></TableRow>
          )}
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="text-xs whitespace-nowrap">
                {new Date(log.dataHora).toLocaleString('pt-BR')}
              </TableCell>
              <TableCell>
                {log.usuario ? (
                  <div>
                    <p className="font-semibold">{log.usuario.nome}</p>
                    <p className="text-xs text-slate-500">{log.usuario.papel} • {log.usuario.matricula}</p>
                  </div>
                ) : (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Cartão Desconhecido ({log.uidCartao})
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <p className="font-medium">{log.dispositivo.sala.nome} {log.dispositivo.sala.bloco && `(${log.dispositivo.sala.bloco})`}</p>
                <p className="text-xs text-slate-500">{log.dispositivo.nome} • {log.direcao}</p>
              </TableCell>
              <TableCell>
                <Badge className={log.status === 'CONCEDIDO' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}>
                  {log.status}
                </Badge>
              </TableCell>
              <TableCell className="text-xs max-w-[200px] truncate" title={log.motivo || '-'}>
                {log.motivo || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}