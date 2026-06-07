'use client';

import { Button } from '@/components/ui/button';

const DIAS_SEMANA = [
  { value: 0, shortLabel: 'Dom' },
  { value: 1, shortLabel: 'Seg' },
  { value: 2, shortLabel: 'Ter' },
  { value: 3, shortLabel: 'Qua' },
  { value: 4, shortLabel: 'Qui' },
  { value: 5, shortLabel: 'Sex' },
  { value: 6, shortLabel: 'Sab' },
];

interface DiasSemanaSelectorProps {
  value: number[];
  onChange: (dias: number[]) => void;
  disabled?: boolean;
}

export function DiasSemanaSelector({ value, onChange, disabled }: DiasSemanaSelectorProps) {
  function toggleDia(dia: number) {
    if (value.includes(dia)) {
      onChange(value.filter((current) => current !== dia));
      return;
    }

    onChange([...value, dia].sort((a, b) => a - b));
  }

  return (
    <div className="flex flex-wrap gap-2">
      {DIAS_SEMANA.map((dia) => {
        const isSelected = value.includes(dia.value);

        return (
          <Button
            key={dia.value}
            type="button"
            size="sm"
            variant={isSelected ? 'default' : 'outline'}
            disabled={disabled}
            onClick={() => toggleDia(dia.value)}
          >
            {dia.shortLabel}
          </Button>
        );
      })}
    </div>
  );
}

export function formatarDiasSemana(dias: number[]) {
  if (dias.length === 0) {
    return '-';
  }

  const labels = DIAS_SEMANA.filter((dia) => dias.includes(dia.value)).map((dia) => dia.shortLabel);
  return labels.join(', ');
}
