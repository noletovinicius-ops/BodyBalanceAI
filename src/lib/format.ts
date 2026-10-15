export const num = (v: number, digits = 1) => v.toLocaleString('pt-BR', { maximumFractionDigits: digits, minimumFractionDigits: 0 });

export const kg = (v: number) => `${num(v)} kg`;

export function duration(weeks: number) {
  if (weeks < 8) return `${weeks} semanas`;
  const months = Math.round(weeks / 4.345);
  return `${weeks} semanas (~${months} ${months === 1 ? 'mês' : 'meses'})`;
}

/** Variação semanal em kg a partir da fração do peso. */
export const weeklyKg = (rate: number, weightKg: number) => `${rate > 0 ? '+' : rate < 0 ? '−' : ''}${num(Math.abs(rate * weightKg), 2)} kg/semana`;
