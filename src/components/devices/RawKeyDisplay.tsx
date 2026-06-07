'use client';

import { CheckCircle2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  rawKey: string;
  onClose: () => void;
}

export function RawKeyDisplay({ rawKey, onClose }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(rawKey);
    toast.success('Chave copiada para a área de transferência!');
  };

  return (
    <div className="p-6 border border-orange-200 bg-orange-50 rounded-xl shadow-sm max-w-2xl">
      <div className="flex items-center gap-2 text-orange-700 mb-2">
        <CheckCircle2 className="h-5 w-5" />
        <h3 className="font-bold text-lg">Chave Gerada com Sucesso!</h3>
      </div>
      
      <p className="text-orange-800 text-sm mb-4">
        <strong>AVISO CRÍTICO:</strong> Esta chave não será exibida novamente por motivos de segurança. 
        Copie-a agora mesmo e grave no firmware do dispositivo.
      </p>

      <div className="flex items-center gap-2 mb-6">
        <code className="flex-1 p-3 bg-white border border-orange-200 rounded-lg text-lg font-mono text-center break-all select-all">
          {rawKey}
        </code>
        <Button variant="outline" onClick={handleCopy} className="h-14">
          <Copy className="h-5 w-5" />
        </Button>
      </div>

      <Button onClick={onClose} className="w-full bg-[#004a99] hover:bg-[#003d7d]">
        Já copiei a chave, finalizar
      </Button>
    </div>
  );
}