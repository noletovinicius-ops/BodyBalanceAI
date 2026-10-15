import { describe, expect, it } from '@jest/globals';

import {
  bmr,
  bodyScore,
  buildFullPlan,
  buildMealPlan,
  deurenberg,
  estimateComposition,
  isAllowed,
  MAX_LOSS_RATE,
  MIN_KCAL,
  nutritionTargets,
  resolveGoal,
  rfm,
  type GoalPlan,
  type Profile,
} from '..';
import { FOODS } from '../../data/foods';

const woman: Profile = {
  sex: 'female',
  age: 30,
  heightCm: 165,
  weightKg: 70,
  waistCm: 80,
  silhouette: 5,
  activity: 'light',
  daysPerWeek: 3,
  location: 'gym',
  experience: 'beginner',
  restrictions: [],
};

const man: Profile = { ...woman, sex: 'male', age: 35, heightCm: 178, weightKg: 92, waistCm: 98, silhouette: 6 };

describe('composição corporal', () => {
  it('calcula RFM conforme Woolcott & Bergman', () => {
    expect(rfm('female', 165, 80)).toBeCloseTo(34.75, 1);
    expect(rfm('male', 178, 98)).toBeCloseTo(27.67, 1);
  });

  it('calcula Deurenberg', () => {
    expect(deurenberg('male', 40, 25)).toBeCloseTo(23, 1);
  });

  it('usa RFM com cintura e IMC + silhueta sem cintura', () => {
    expect(estimateComposition(woman).method).toBe('rfm');
    const noWaist = estimateComposition({ ...woman, waistCm: undefined });
    expect(noWaist.method).toBe('bmi+silhouette');
    expect(noWaist.bodyFatPct).toBeGreaterThan(25);
    expect(noWaist.bodyFatPct).toBeLessThan(40);
  });

  it('calcula Mifflin-St Jeor', () => {
    expect(bmr(woman)).toBeCloseTo(10 * 70 + 6.25 * 165 - 5 * 30 - 161, 5);
  });
});

describe('score', () => {
  it('fica entre 0 e 100 e é maior para composição melhor', () => {
    const lean = bodyScore('female', estimateComposition({ ...woman, weightKg: 58, waistCm: 68 }));
    const high = bodyScore('female', estimateComposition({ ...woman, weightKg: 95, waistCm: 105 }));
    expect(lean.value).toBeGreaterThan(high.value);
    for (const s of [lean, high]) {
      expect(s.value).toBeGreaterThanOrEqual(0);
      expect(s.value).toBeLessThanOrEqual(100);
    }
    expect(lean.confidence).toBe('high');
  });
});

describe('metas', () => {
  const c = estimateComposition(woman);

  it('aceita prazo viável', () => {
    const r = resolveGoal(woman, c, { type: 'leaner', target: 'fitness', deadlineWeeks: 52 });
    expect(r.status).toBe('feasible');
    if (r.status === 'feasible') expect(-r.plan.weeklyRate).toBeLessThanOrEqual(MAX_LOSS_RATE);
  });

  it('ajusta prazo curto demais e oferece a opção viável mais próxima', () => {
    const r = resolveGoal(woman, c, { type: 'leaner', target: 'athletic', deadlineWeeks: 4 });
    expect(r.status).toBe('adjusted');
    if (r.status !== 'adjusted') return;
    expect(r.extendDeadline.weeks).toBeGreaterThan(4);
    expect(-r.extendDeadline.weeklyRate).toBeLessThanOrEqual(MAX_LOSS_RATE + 1e-9);
    expect(r.keepDeadline.weeks).toBe(4);
    expect(r.keepDeadline.targetWeightKg).toBeGreaterThan(r.extendDeadline.targetWeightKg);
  });

  it('perder ~10 kg em 1 mês exige ~14–20 semanas', () => {
    const r = resolveGoal(man, estimateComposition(man), { type: 'leaner', target: 'fitness', deadlineWeeks: 4 });
    expect(r.status).toBe('adjusted');
    if (r.status === 'adjusted') {
      expect(r.extendDeadline.startWeightKg - r.extendDeadline.targetWeightKg).toBeGreaterThan(8);
      expect(r.extendDeadline.weeks).toBeGreaterThanOrEqual(14);
      expect(r.extendDeadline.weeks).toBeLessThanOrEqual(20);
    }
  });

  it('bloqueia perda para quem já está na meta ou abaixo do peso', () => {
    const lean = { ...woman, weightKg: 52, waistCm: 64 };
    expect(resolveGoal(lean, estimateComposition(lean), { type: 'leaner', target: 'healthy', deadlineWeeks: 13 })).toEqual({
      status: 'blocked',
      issue: expect.any(String),
    });
  });

  it('limita ganho de massa pela experiência', () => {
    const r = resolveGoal(woman, c, { type: 'muscle', gainKg: 6, deadlineWeeks: 13 });
    expect(r.status).toBe('adjusted');
    const ok = resolveGoal(woman, c, { type: 'muscle', gainKg: 2, deadlineWeeks: 26 });
    expect(ok.status).toBe('feasible');
  });
});

describe('nutrição', () => {
  const aggressive: GoalPlan = { type: 'leaner', startWeightKg: 50, targetWeightKg: 45, weeklyRate: -0.01, weeks: 10 };

  it('nunca fica abaixo do piso calórico', () => {
    const small: Profile = { ...woman, heightCm: 150, weightKg: 50, age: 60, activity: 'sedentary' };
    const t = nutritionTargets(small, aggressive);
    expect(t.kcal).toBeGreaterThanOrEqual(MIN_KCAL.female);
  });

  it('macros somam as calorias (±5%)', () => {
    for (const p of [woman, man]) {
      const r = resolveGoal(p, estimateComposition(p), { type: 'leaner', target: 'fitness', deadlineWeeks: 26 });
      const plan = r.status === 'feasible' ? r.plan : r.status === 'adjusted' ? r.extendDeadline : aggressive;
      const t = nutritionTargets(p, plan);
      const kcal = t.proteinG * 4 + t.carbsG * 4 + t.fatG * 9;
      expect(Math.abs(kcal - t.kcal) / t.kcal).toBeLessThan(0.05);
      expect(t.proteinG / p.weightKg).toBeGreaterThanOrEqual(1.5);
    }
  });
});

describe('cardápio', () => {
  it('bate as calorias do dia em ±5%', () => {
    const plan: GoalPlan = { type: 'leaner', startWeightKg: 70, targetWeightKg: 64, weeklyRate: -0.005, weeks: 20 };
    const t = nutritionTargets(woman, plan);
    for (const v of [0, 1]) {
      const menu = buildMealPlan(t, [], v);
      expect(Math.abs(menu.totals.kcal - t.kcal) / t.kcal).toBeLessThan(0.05);
      expect(Math.abs(menu.totals.proteinG - t.proteinG) / t.proteinG).toBeLessThan(0.1);
    }
  });

  it('respeita restrições alimentares', () => {
    const plan: GoalPlan = { type: 'maintain', startWeightKg: 70, targetWeightKg: 70, weeklyRate: 0, weeks: 12 };
    const restrictions = ['vegetarian', 'lactoseFree', 'glutenFree'] as const;
    const menu = buildMealPlan(nutritionTargets(woman, plan), [...restrictions], 0);
    for (const meal of menu.meals) {
      for (const item of meal.items) {
        expect(isAllowed(item.food, [...restrictions])).toBe(true);
        for (const s of item.swaps) expect(isAllowed(s.food, [...restrictions])).toBe(true);
      }
    }
    expect(FOODS.chicken.meat).toBe(true);
  });
});

describe('plano completo', () => {
  it.each([2, 3, 4, 5, 6])('gera %i dias de treino', (days) => {
    const p = { ...woman, daysPerWeek: days, location: 'home' as const };
    const goal: GoalPlan = { type: 'muscle', startWeightKg: 70, targetWeightKg: 72, weeklyRate: 0.002, weeks: 13 };
    const full = buildFullPlan(p, goal);
    expect(full.training.days).toHaveLength(days);
    expect(full.menus).toHaveLength(2);
    expect(full.nutrition.deltaKcal).toBeGreaterThan(0);
  });
});
