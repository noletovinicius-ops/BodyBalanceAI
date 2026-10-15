import type { BodyComposition } from './bodyComposition';
import { LEAN_TARGET_BF } from './score';
import type { Experience, Goal, Profile } from './types';

/** Perda segura: 0,5–1% do peso por semana (ACSM; Helms et al., 2014). */
export const MAX_LOSS_RATE = 0.01;
/** Abaixo disso o déficit fica tão pequeno que não vale a pena desacelerar mais. */
export const MIN_LOSS_RATE = 0.0025;
/** Ganho de massa magra realista por semana, por experiência (Aragon; ISSN). */
export const GAIN_RATE: Record<Experience, number> = {
  beginner: 0.004,
  intermediate: 0.0025,
  advanced: 0.001,
};

export const DEADLINE_OPTIONS = [
  { weeks: 4, label: '1 mês' },
  { weeks: 13, label: '3 meses' },
  { weeks: 26, label: '6 meses' },
  { weeks: 52, label: '1 ano' },
] as const;

export interface GoalPlan {
  type: Goal['type'];
  startWeightKg: number;
  targetWeightKg: number;
  targetBodyFatPct?: number;
  /** Variação semanal como fração do peso (negativa = perda). */
  weeklyRate: number;
  weeks: number;
}

export type GoalIssue = 'underweight' | 'alreadyThere';

export type GoalResolution =
  | { status: 'feasible'; plan: GoalPlan }
  /** Prazo curto demais: oferece estender o prazo ou manter o prazo com uma meta menor. */
  | { status: 'adjusted'; requestedWeeks: number; extendDeadline: GoalPlan; keepDeadline: GoalPlan }
  | { status: 'blocked'; issue: GoalIssue };

/** Semanas para ir de w0 a w1 com variação composta r por semana. */
export const weeksFor = (w0: number, w1: number, r: number) => Math.log(w1 / w0) / Math.log(1 + r);
/** Variação composta por semana para ir de w0 a w1 em n semanas. */
export const rateFor = (w0: number, w1: number, n: number) => Math.pow(w1 / w0, 1 / n) - 1;

export function resolveGoal(p: Profile, c: BodyComposition, goal: Goal): GoalResolution {
  const w = p.weightKg;

  if (goal.type === 'maintain') {
    return { status: 'feasible', plan: { type: 'maintain', startWeightKg: w, targetWeightKg: w, weeklyRate: 0, weeks: 12 } };
  }

  if (goal.type === 'leaner') {
    if (c.bmiClass === 'under') return { status: 'blocked', issue: 'underweight' };
    const targetBf = LEAN_TARGET_BF[goal.target][p.sex];
    if (c.bodyFatPct <= targetBf + 0.5) return { status: 'blocked', issue: 'alreadyThere' };

    // Assume preservação da massa magra (treino de força + proteína alta).
    const targetW = c.leanMassKg / (1 - targetBf / 100);
    const base = { type: 'leaner' as const, startWeightKg: w };
    const required = -rateFor(w, targetW, goal.deadlineWeeks);

    if (required <= MAX_LOSS_RATE) {
      const rate = Math.max(required, MIN_LOSS_RATE);
      const weeks = Math.min(goal.deadlineWeeks, Math.ceil(weeksFor(w, targetW, -rate)));
      return { status: 'feasible', plan: { ...base, targetWeightKg: targetW, targetBodyFatPct: targetBf, weeklyRate: -rate, weeks } };
    }

    const minWeeks = Math.ceil(weeksFor(w, targetW, -MAX_LOSS_RATE));
    const reachable = w * Math.pow(1 - MAX_LOSS_RATE, goal.deadlineWeeks);
    return {
      status: 'adjusted',
      requestedWeeks: goal.deadlineWeeks,
      extendDeadline: {
        ...base,
        targetWeightKg: targetW,
        targetBodyFatPct: targetBf,
        weeklyRate: rateFor(w, targetW, minWeeks),
        weeks: minWeeks,
      },
      keepDeadline: {
        ...base,
        targetWeightKg: reachable,
        targetBodyFatPct: ((reachable - c.leanMassKg) / reachable) * 100,
        weeklyRate: -MAX_LOSS_RATE,
        weeks: goal.deadlineWeeks,
      },
    };
  }

  const maxRate = GAIN_RATE[p.experience];
  const targetW = w + goal.gainKg;
  const base = { type: 'muscle' as const, startWeightKg: w };
  const needed = weeksFor(w, targetW, maxRate);

  if (needed <= goal.deadlineWeeks) {
    return {
      status: 'feasible',
      // Usa todo o prazo: ganho mais lento acumula menos gordura.
      plan: { ...base, targetWeightKg: targetW, weeklyRate: rateFor(w, targetW, goal.deadlineWeeks), weeks: goal.deadlineWeeks },
    };
  }

  const minWeeks = Math.ceil(needed);
  return {
    status: 'adjusted',
    requestedWeeks: goal.deadlineWeeks,
    extendDeadline: { ...base, targetWeightKg: targetW, weeklyRate: rateFor(w, targetW, minWeeks), weeks: minWeeks },
    keepDeadline: {
      ...base,
      targetWeightKg: w * Math.pow(1 + maxRate, goal.deadlineWeeks),
      weeklyRate: maxRate,
      weeks: goal.deadlineWeeks,
    },
  };
}
