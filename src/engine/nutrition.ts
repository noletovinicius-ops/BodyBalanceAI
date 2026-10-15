import { bmi } from './bodyComposition';
import type { GoalPlan } from './goals';
import { clamp, round } from './math';
import type { ActivityLevel, Profile } from './types';

export const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
};

export const MIN_KCAL = { female: 1200, male: 1500 } as const;
/** Energia aproximada de 1 kg de tecido adiposo. */
const KCAL_PER_KG_FAT = 7700;
/** Energia aproximada por kg de peso ganho em fase de massa (tecido magro + parte de gordura). */
const KCAL_PER_KG_GAIN = 5000;

/** Taxa metabólica basal por Mifflin-St Jeor (1990). */
export function bmr(p: Pick<Profile, 'sex' | 'weightKg' | 'heightCm' | 'age'>) {
  return 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === 'male' ? 5 : -161);
}

export function tdee(p: Profile) {
  return bmr(p) * ACTIVITY_FACTOR[p.activity];
}

export interface Macros {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface NutritionTargets extends Macros {
  tdee: number;
  /** Diferença diária frente ao gasto (negativa = déficit). */
  deltaKcal: number;
  waterMl: number;
  steps: number;
  /** Verdadeiro quando o piso calórico limitou o déficit. */
  floorApplied: boolean;
}

/**
 * Peso de referência para proteína e gordura: em IMC alto, usa o peso equivalente
 * a IMC 25 para não superestimar a necessidade.
 */
export function referenceWeight(p: Profile) {
  if (bmi(p.weightKg, p.heightCm) <= 27) return p.weightKg;
  const m = p.heightCm / 100;
  return 25 * m * m;
}

export function nutritionTargets(p: Profile, plan: GoalPlan): NutritionTargets {
  const total = tdee(p);
  let delta: number;
  if (plan.weeklyRate < 0) {
    // Déficit vindo da taxa de perda, limitado a 25% do gasto.
    delta = -Math.min((-plan.weeklyRate * p.weightKg * KCAL_PER_KG_FAT) / 7, total * 0.25);
  } else if (plan.weeklyRate > 0) {
    delta = clamp((plan.weeklyRate * p.weightKg * KCAL_PER_KG_GAIN) / 7, 150, 500);
  } else {
    delta = 0;
  }

  let kcal = total + delta;
  const floor = MIN_KCAL[p.sex];
  const floorApplied = kcal < floor;
  if (floorApplied) kcal = floor;
  kcal = round(kcal, 10);

  // Proteína 1,6–2,2 g/kg (ISSN): mais alta no déficit para preservar massa magra.
  const ref = referenceWeight(p);
  const proteinPerKg = plan.type === 'leaner' ? 2.0 : plan.type === 'muscle' ? 1.8 : 1.6;
  const proteinG = round(proteinPerKg * ref);
  // Gordura: 0,8 g/kg, nunca abaixo de 20% das kcal nem de 0,6 g/kg.
  let fatG = Math.max(0.8 * ref, (kcal * 0.2) / 9);
  let carbsG = (kcal - proteinG * 4 - fatG * 9) / 4;
  if (carbsG < 50) {
    fatG = Math.max(0.6 * ref, (kcal - proteinG * 4 - 50 * 4) / 9);
    carbsG = (kcal - proteinG * 4 - fatG * 9) / 4;
  }

  return {
    kcal,
    proteinG,
    fatG: round(fatG),
    carbsG: round(Math.max(carbsG, 0)),
    tdee: round(total, 10),
    deltaKcal: round(kcal - total, 10),
    waterMl: round(35 * p.weightKg, 50),
    steps: plan.type === 'leaner' ? 9000 : 7000,
    floorApplied,
  };
}
