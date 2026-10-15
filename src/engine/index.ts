import { estimateComposition } from './bodyComposition';
import type { GoalPlan } from './goals';
import { buildMealPlan } from './mealPlan';
import { nutritionTargets } from './nutrition';
import { bodyScore } from './score';
import { buildTrainingPlan } from './training';
import type { Profile } from './types';

export * from './bodyComposition';
export * from './goals';
export * from './mealPlan';
export * from './nutrition';
export * from './score';
export * from './training';
export * from './types';

/** Tudo o que o app mostra, derivado do perfil e da meta escolhida. */
export function buildFullPlan(profile: Profile, goal: GoalPlan) {
  const composition = estimateComposition(profile);
  const nutrition = nutritionTargets(profile, goal);
  return {
    composition,
    score: bodyScore(profile.sex, composition),
    nutrition,
    menus: [0, 1].map((v) => buildMealPlan(nutrition, profile.restrictions, v)),
    training: buildTrainingPlan(profile, goal),
  };
}

export type FullPlan = ReturnType<typeof buildFullPlan>;
