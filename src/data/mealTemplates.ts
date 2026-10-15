export type MealRole = 'protein' | 'carb' | 'fat';

export interface MealTemplate {
  id: string;
  name: string;
  time: string;
  /** Fração das metas diárias. */
  share: number;
  /** Fração da proteína diária (concentrada nas refeições principais). */
  proteinShare: number;
  /** Opções por papel, em ordem de preferência; a primeira permitida é a sugerida. */
  roles: Record<MealRole, string[]>;
  fixed: { food: string; grams: number }[];
}

export const MEAL_TEMPLATES: MealTemplate[] = [
  {
    id: 'breakfast',
    name: 'Café da manhã',
    time: '07:30',
    share: 0.25,
    proteinShare: 0.2,
    roles: {
      protein: ['egg', 'greekYogurt', 'lfYogurt', 'tofu'],
      carb: ['wholeBread', 'tapioca', 'couscous', 'oats'],
      fat: ['peanutButter', 'avocado', 'nuts'],
    },
    fixed: [{ food: 'papaya', grams: 150 }],
  },
  {
    id: 'lunch',
    name: 'Almoço',
    time: '12:30',
    share: 0.35,
    proteinShare: 0.35,
    roles: {
      protein: ['chicken', 'beef', 'fish', 'tofu', 'soy', 'egg'],
      carb: ['rice', 'brownRice', 'sweetPotato', 'cassava'],
      fat: ['oliveOil', 'avocado'],
    },
    fixed: [
      { food: 'beans', grams: 80 },
      { food: 'salad', grams: 100 },
      { food: 'veggies', grams: 100 },
    ],
  },
  {
    id: 'snack',
    name: 'Lanche',
    time: '16:00',
    share: 0.15,
    proteinShare: 0.15,
    roles: {
      protein: ['greekYogurt', 'lfYogurt', 'cottage', 'egg', 'tofu'],
      carb: ['banana', 'apple', 'oats', 'tapioca'],
      fat: ['nuts', 'peanutButter', 'avocado'],
    },
    fixed: [],
  },
  {
    id: 'dinner',
    name: 'Jantar',
    time: '19:30',
    share: 0.25,
    proteinShare: 0.3,
    roles: {
      protein: ['fish', 'chicken', 'egg', 'soy', 'tofu', 'chickpea'],
      carb: ['sweetPotato', 'rice', 'couscous', 'cassava'],
      fat: ['oliveOil', 'avocado'],
    },
    fixed: [
      { food: 'veggies', grams: 100 },
      { food: 'salad', grams: 100 },
    ],
  },
];
