import { clamp } from './math';
import type { Profile, Sex } from './types';

export function bmi(weightKg: number, heightCm: number) {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export type BmiClass = 'under' | 'normal' | 'over' | 'obese';

/** Classificação da OMS para adultos. */
export function bmiClass(value: number): BmiClass {
  if (value < 18.5) return 'under';
  if (value < 25) return 'normal';
  if (value < 30) return 'over';
  return 'obese';
}

/** Relative Fat Mass (Woolcott & Bergman, 2018). */
export function rfm(sex: Sex, heightCm: number, waistCm: number) {
  return 64 - 20 * (heightCm / waistCm) + (sex === 'female' ? 12 : 0);
}

/** %G estimado pelo IMC (Deurenberg et al., 1991). */
export function deurenberg(sex: Sex, age: number, bmiValue: number) {
  return 1.2 * bmiValue + 0.23 * age - 10.8 * (sex === 'male' ? 1 : 0) - 5.4;
}

/**
 * %G aproximado de cada silhueta da escala de 9 figuras (estilo Stunkard).
 * Usado só para suavizar a estimativa quando não há medida de cintura.
 */
const SILHOUETTE_BF: Record<Sex, readonly number[]> = {
  female: [16, 19, 22, 25, 28, 32, 36, 40, 45],
  male: [8, 11, 14, 17, 20, 24, 28, 32, 37],
};

export function silhouetteBodyFat(sex: Sex, silhouette: number) {
  return SILHOUETTE_BF[sex][clamp(Math.round(silhouette), 1, 9) - 1];
}

/** Relação cintura/estatura (Ashwell & Hsieh, 2005): < 0,5 é o ponto de corte saudável. */
export function waistToHeight(waistCm: number, heightCm: number) {
  return waistCm / heightCm;
}

export interface BodyComposition {
  bmi: number;
  bmiClass: BmiClass;
  bodyFatPct: number;
  leanMassKg: number;
  whtr?: number;
  method: 'rfm' | 'bmi+silhouette';
}

export function estimateComposition(p: Profile): BodyComposition {
  const b = bmi(p.weightKg, p.heightCm);
  let bf: number;
  let method: BodyComposition['method'];
  if (p.waistCm) {
    bf = rfm(p.sex, p.heightCm, p.waistCm);
    method = 'rfm';
  } else {
    bf = 0.7 * deurenberg(p.sex, p.age, b) + 0.3 * silhouetteBodyFat(p.sex, p.silhouette);
    method = 'bmi+silhouette';
  }
  bf = clamp(bf, p.sex === 'female' ? 10 : 3, 60);
  return {
    bmi: b,
    bmiClass: bmiClass(b),
    bodyFatPct: bf,
    leanMassKg: p.weightKg * (1 - bf / 100),
    whtr: p.waistCm ? waistToHeight(p.waistCm, p.heightCm) : undefined,
    method,
  };
}
