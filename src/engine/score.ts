import type { BodyComposition } from './bodyComposition';
import { interpolate, round } from './math';
import type { LeanTarget, Sex } from './types';

/** Faixas de %G do American Council on Exercise (limite inferior de cada categoria). */
export const ACE_BANDS: Record<Sex, { essential: number; athletes: number; fitness: number; average: number; above: number }> = {
  female: { essential: 10, athletes: 14, fitness: 21, average: 25, above: 32 },
  male: { essential: 2, athletes: 6, fitness: 14, average: 18, above: 25 },
};

export type BodyCategory = keyof (typeof ACE_BANDS)['female'];

export const CATEGORY_LABEL: Record<BodyCategory, string> = {
  essential: 'Muito baixo',
  athletes: 'Atlético',
  fitness: 'Fitness',
  average: 'Saudável',
  above: 'Acima do ideal',
};

export function bodyCategory(sex: Sex, bf: number): BodyCategory {
  const b = ACE_BANDS[sex];
  if (bf >= b.above) return 'above';
  if (bf >= b.average) return 'average';
  if (bf >= b.fitness) return 'fitness';
  if (bf >= b.athletes) return 'athletes';
  return 'essential';
}

/** %G-alvo de cada meta de definição, dentro das faixas do ACE. */
export const LEAN_TARGET_BF: Record<LeanTarget, Record<Sex, number>> = {
  athletic: { female: 20, male: 12 },
  fitness: { female: 23, male: 16 },
  healthy: { female: 28, male: 21 },
};

export const LEAN_TARGET_LABEL: Record<LeanTarget, string> = {
  athletic: 'Atlético',
  fitness: 'Fitness',
  healthy: 'Saudável',
};

const BF_SCORE: Record<Sex, readonly (readonly [number, number])[]> = {
  female: [[10, 40], [14, 80], [18, 100], [24, 100], [28, 82], [32, 65], [38, 45], [45, 25], [55, 10]],
  male: [[3, 40], [6, 80], [10, 100], [16, 100], [20, 82], [25, 65], [30, 45], [37, 25], [45, 10]],
};

const WHTR_SCORE: readonly (readonly [number, number])[] = [[0.5, 100], [0.55, 75], [0.6, 50], [0.7, 20]];

export type ScoreLevel = 'excellent' | 'good' | 'attention' | 'priority';

export const SCORE_LABEL: Record<ScoreLevel, string> = {
  excellent: 'Excelente',
  good: 'Bom',
  attention: 'Atenção',
  priority: 'Prioridade',
};

export interface BodyScore {
  value: number;
  level: ScoreLevel;
  category: BodyCategory;
  /** Maior quando há medida de cintura. */
  confidence: 'high' | 'medium';
  summary: string;
}

/**
 * Score BodyBalance (0–100): 80% vem do %G frente às faixas saudáveis por sexo
 * e 20% da relação cintura/estatura, quando informada.
 */
export function bodyScore(sex: Sex, c: BodyComposition): BodyScore {
  const bfScore = interpolate(BF_SCORE[sex], c.bodyFatPct);
  const value = round(c.whtr ? 0.8 * bfScore + 0.2 * interpolate(WHTR_SCORE, c.whtr) : bfScore);
  const level: ScoreLevel = value >= 85 ? 'excellent' : value >= 70 ? 'good' : value >= 50 ? 'attention' : 'priority';
  const category = bodyCategory(sex, c.bodyFatPct);
  return {
    value,
    level,
    category,
    confidence: c.method === 'rfm' ? 'high' : 'medium',
    summary: summaryFor(category, c),
  };
}

function summaryFor(category: BodyCategory, c: BodyComposition) {
  const bf = `cerca de ${round(c.bodyFatPct)}% de gordura corporal`;
  switch (category) {
    case 'essential':
      return `Você está com ${bf}, abaixo do recomendado. O foco deve ser ganhar massa com segurança.`;
    case 'athletes':
      return `Você está com ${bf}, uma composição de atleta. Ótima base para ganhar força e massa.`;
    case 'fitness':
      return `Você está com ${bf}, na faixa fitness. Dá para definir mais ou focar em massa muscular.`;
    case 'average':
      return `Você está com ${bf}, dentro da faixa saudável. Pequenos ajustes já trazem resultado visível.`;
    case 'above':
      return `Você está com ${bf}. Reduzir gordura trará o maior ganho para sua saúde e estética.`;
  }
}
