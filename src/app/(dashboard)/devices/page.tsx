'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, KeySquare, Edit, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DevicesService } from '@/services/devices.service';
import { Device } from '@/types';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await DevicesService.listar();
      setDevices(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dispositivos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ATIVO':       return <Badge className="bg-emerald-500 text-white">ATIVO</Badge>;
      case 'INATIVO':     return <Badge className="bg-slate-400 text-white">INATIVO</Badge>;
      case 'MANUTENCAO':  return <Badge className="bg-yellow-500 text-white">MANUTENÇÃO</Badge>;
      default:            return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dispositivos IoT</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={loadDevices}
            disabled={loading}
            title="Recarregar"
          >
            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Link href="/dashboard/devices/new">
            <Button className="bg-[#f47920] hover:bg-[#e8621a] text-white">
              <Plus className="h-4 w-4 mr-2" /> Novo Dispositivo
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Erro ao carregar dispositivos</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* bg-card + border-border respondem ao dark mode */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f47920]" />
              <p className="mt-2 text-muted-foreground">Carregando dispositivos...</p>
            </div>
          </div>
        ) : devices.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Nenhum dispositivo cadastrado</p>
              <Link href="/dashboard/devices/new">
                <Button className="bg-[#f47920] hover:bg-[#e8621a] text-white">
                  <Plus className="h-4 w-4 mr-2" /> Cadastrar Primeiro Dispositivo
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>MAC Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium text-foreground">{device.nome}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{device.enderecoMac}</TableCell>
                  <TableCell>{getStatusBadge(device.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/devices/${device.id}`}>
                        <Button variant="ghost" size="icon-sm" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/devices/${device.id}/provision`}>
                        <Button variant="outline" size="icon-sm" className="text-[#004a99]" title="Provisionar Chave">
                          <KeySquare className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}