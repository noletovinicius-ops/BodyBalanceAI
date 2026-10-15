import { FOODS, type Food } from '../data/foods';
import { MEAL_TEMPLATES, type MealRole } from '../data/mealTemplates';
import { clamp, round } from './math';
import type { Macros } from './nutrition';
import type { Restriction } from './types';

export interface Portion {
  food: Food;
  grams: number;
  /** Ex.: "≈ 4 col. de sopa". */
  household: string;
  role?: MealRole;
  /** Trocas equivalentes no nutriente principal do papel. */
  swaps: { food: Food; grams: number; household: string }[];
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  items: Portion[];
  totals: Macros;
}

export interface MealPlan {
  meals: Meal[];
  totals: Macros;
}

const ROLES: MealRole[] = ['protein', 'carb', 'fat'];
const MAIN_NUTRIENT: Record<MealRole, 'protein' | 'carbs' | 'fat'> = { protein: 'protein', carb: 'carbs', fat: 'fat' };

export function isAllowed(food: Food, restrictions: Restriction[]) {
  if (restrictions.includes('vegetarian') && food.meat) return false;
  if (restrictions.includes('lactoseFree') && food.lactose) return false;
  if (restrictions.includes('glutenFree') && food.gluten) return false;
  return true;
}

export function household(food: Food, grams: number) {
  const qty = round(grams / food.measure.grams, 0.5);
  if (qty < 0.5) return `${grams} g`;
  const n = qty.toLocaleString('pt-BR');
  return `≈ ${n} ${food.measure.label}`;
}

export function macrosOf(food: Food, grams: number): Macros {
  const k = grams / 100;
  const protein = food.protein * k;
  const carbs = food.carbs * k;
  const fat = food.fat * k;
  return { proteinG: protein, carbsG: carbs, fatG: fat, kcal: protein * 4 + carbs * 4 + fat * 9 };
}

function sum(list: Macros[]): Macros {
  return list.reduce(
    (a, m) => ({ kcal: a.kcal + m.kcal, proteinG: a.proteinG + m.proteinG, carbsG: a.carbsG + m.carbsG, fatG: a.fatG + m.fatG }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
}

/**
 * Encontra as gramas dos três alimentos variáveis que mais aproximam as metas de
 * proteína, carboidrato e gordura (mínimos quadrados ponderados por kcal),
 * por descida coordenada com limites [0, maxG].
 */
function solveGrams(foods: Food[], target: { p: number; c: number; f: number }) {
  // Proteína pesa mais: é o macro que mais importa bater.
  const w = { p: 8, c: 4, f: 9 };
  const g = foods.map(() => 0);
  const per = foods.map((f) => ({ p: f.protein / 100, c: f.carbs / 100, f: f.fat / 100 }));
  for (let iter = 0; iter < 60; iter++) {
    for (let i = 0; i < foods.length; i++) {
      // Resíduo sem o alimento i.
      const r = { p: target.p, c: target.c, f: target.f };
      for (let j = 0; j < foods.length; j++) {
        if (j === i) continue;
        r.p -= per[j].p * g[j];
        r.c -= per[j].c * g[j];
        r.f -= per[j].f * g[j];
      }
      const a = per[i];
      const num = w.p ** 2 * a.p * r.p + w.c ** 2 * a.c * r.c + w.f ** 2 * a.f * r.f;
      const den = w.p ** 2 * a.p ** 2 + w.c ** 2 * a.c ** 2 + w.f ** 2 * a.f ** 2;
      g[i] = den > 0 ? clamp(num / den, 0, foods[i].maxG) : 0;
    }
  }
  return g.map((x) => round(x, 5));
}

export function buildMealPlan(targets: Macros, restrictions: Restriction[], variant = 0): MealPlan {
  const meals = MEAL_TEMPLATES.map((t): Meal => {
    const fixed: Portion[] = t.fixed.map(({ food, grams }) => ({
      food: FOODS[food],
      grams,
      household: household(FOODS[food], grams),
      swaps: [],
    }));
    const fixedTotals = sum(fixed.map((x) => macrosOf(x.food, x.grams)));

    const options = Object.fromEntries(
      ROLES.map((role) => [role, t.roles[role].map((id) => FOODS[id]).filter((f) => isAllowed(f, restrictions))]),
    ) as Record<MealRole, Food[]>;
    const chosen = ROLES.map((role) => options[role][variant % options[role].length]);

    const grams = solveGrams(chosen, {
      p: Math.max(targets.proteinG * t.proteinShare - fixedTotals.proteinG, 0),
      c: Math.max(targets.carbsG * t.share - fixedTotals.carbsG, 0),
      f: Math.max(targets.fatG * t.share - fixedTotals.fatG, 0),
    });

    const variable: Portion[] = chosen
      .map((food, i) => {
        const role = ROLES[i];
        const key = MAIN_NUTRIENT[role];
        const swaps = options[role]
          .filter((alt) => alt.id !== food.id && alt[key] > 0)
          .map((alt) => {
            const g = round(clamp((grams[i] * food[key]) / alt[key], 0, alt.maxG), 5);
            return { food: alt, grams: g, household: household(alt, g) };
          });
        return { food, grams: grams[i], household: household(food, grams[i]), role, swaps };
      })
      .filter((x) => x.grams > 0);

    const items = [...variable, ...fixed];
    return { id: t.id, name: t.name, time: t.time, items, totals: sum(items.map((x) => macrosOf(x.food, x.grams))) };
  });

  return { meals, totals: sum(meals.map((m) => m.totals)) };
}
