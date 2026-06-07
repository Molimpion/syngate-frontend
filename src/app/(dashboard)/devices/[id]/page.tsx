'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DeviceForm } from '@/components/devices/DeviceForm';
import { DevicesService } from '@/services/devices.service';

export default function EditarDispositivoPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      DevicesService.buscarPorId(id as string).then(res => setData(res.data));
    }
  }, [id]);

  if (!data) return <div className="p-6">Carregando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Editar Dispositivo</h1>
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <DeviceForm initialData={data} />
      </div>
    </div>
  );
}