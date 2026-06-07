'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DeviceForm } from '@/components/devices/DeviceForm';
import { DevicesService } from '@/services/devices.service';
import { Device } from '@/types';

export default function EditarDispositivoPage() {
  const { id } = useParams();
  const [data, setData] = useState<Device | null>(null);

  useEffect(() => {
    if (id) {
      DevicesService.buscarPorId(id as string)
        .then((res) => setData(res.data))
        .catch(() => console.error('Erro ao buscar dispositivo'));
    }
  }, [id]);

  if (!data) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f47920]" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Editar Dispositivo</h1>
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <DeviceForm initialData={data} />
      </div>
    </div>
  );
}