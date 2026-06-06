export function minutesToTime(minutes: number): string {
  if (!Number.isFinite(minutes)) {
    throw new Error('Valor de minutos inválido.');
  }

  const normalized = Math.max(0, Math.min(23 * 60 + 59, Math.floor(minutes)));
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function timeToMinutes(time: string): number {
  const [hoursText, minutesText] = time.split(':');
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  const isValid =
    Number.isInteger(hours) &&
    Number.isInteger(minutes) &&
    hours >= 0 &&
    hours <= 23 &&
    minutes >= 0 &&
    minutes <= 59;

  if (!isValid) {
    throw new Error('Horário inválido. Use o formato HH:MM.');
  }

  return hours * 60 + minutes;
}
