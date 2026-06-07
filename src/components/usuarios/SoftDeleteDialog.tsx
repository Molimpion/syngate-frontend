'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SoftDeleteDialogProps {
  usuarioNome: string;
  disabled?: boolean;
  onConfirm: () => Promise<void>;
}

export function SoftDeleteDialog({ usuarioNome, disabled, onConfirm }: SoftDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    try {
      setIsLoading(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={disabled}>
          Inativar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar inativação</DialogTitle>
          <DialogDescription>
            Você está prestes a inativar o usuário <strong>{usuarioNome}</strong>. Essa ação é um soft delete e
            poderá ser revertida por edição posterior.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Inativando...' : 'Confirmar inativação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
