import { DeviceForm } from '@/components/devices/DeviceForm';

export default function NovoDispositivoPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Cadastrar Dispositivo</h1>
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <DeviceForm />
      </div>
    </div>
  );
}