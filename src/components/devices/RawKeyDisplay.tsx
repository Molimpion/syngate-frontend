'use client';

import { AlertTriangle, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
  rawKey: string;
  onClose: () => void;
}

export function RawKeyDisplay({ rawKey, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawKey);
    setCopied(true);
    toast.success('Chave copiada para a área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 max-w-2xl space-y-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <h3 className="font-bold text-base">Chave gerada com sucesso — atenção!</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Esta chave não será exibida novamente</span> por motivos de segurança.
        Copie-a agora e grave no firmware do dispositivo antes de fechar esta tela.
      </p>

      <div className="flex items-center gap-2">
        <code className="flex-1 rounded-lg border border-border bg-muted px-4 py-3 text-sm font-mono text-foreground break-all select-all">
          {rawKey}
        </code>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          className={cn("h-12 w-12 shrink-0 transition-colors", copied && "border-emerald-500 text-emerald-500")}
          title="Copiar chave"
        >
          {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </Button>
      </div>

      <Button
        onClick={onClose}
        className="w-full bg-[#004a99] hover:bg-[#003d7d] text-white"
      >
        Já copiei a chave — finalizar
      </Button>
    </div>
  );
}