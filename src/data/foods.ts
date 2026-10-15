/** Valores por 100 g (aproximados da TACO/UNICAMP e rótulos comuns). */
export interface Food {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  measure: { label: string; grams: number };
  /** Limite prático por refeição, em gramas. */
  maxG: number;
  meat?: boolean;
  lactose?: boolean;
  gluten?: boolean;
}

const list: Food[] = [
  // Proteínas
  { id: 'chicken', name: 'Peito de frango grelhado', protein: 31, carbs: 0, fat: 3.6, measure: { label: 'filé médio', grams: 100 }, maxG: 250, meat: true },
  { id: 'beef', name: 'Patinho moído refogado', protein: 27, carbs: 0, fat: 7.3, measure: { label: 'col. de sopa', grams: 25 }, maxG: 250, meat: true },
  { id: 'fish', name: 'Tilápia grelhada', protein: 26, carbs: 0, fat: 2.7, measure: { label: 'filé', grams: 120 }, maxG: 250, meat: true },
  { id: 'egg', name: 'Ovo cozido ou mexido', protein: 13, carbs: 1.1, fat: 9.5, measure: { label: 'unidade', grams: 50 }, maxG: 200 },
  { id: 'greekYogurt', name: 'Iogurte proteico (tipo skyr)', protein: 9.5, carbs: 5, fat: 0.3, measure: { label: 'pote', grams: 170 }, maxG: 340, lactose: true },
  { id: 'lfYogurt', name: 'Iogurte natural zero lactose', protein: 5, carbs: 6, fat: 1.5, measure: { label: 'pote', grams: 170 }, maxG: 340 },
  { id: 'cottage', name: 'Queijo cottage', protein: 11, carbs: 3, fat: 4.3, measure: { label: 'col. de sopa', grams: 30 }, maxG: 150, lactose: true },
  { id: 'tofu', name: 'Tofu grelhado', protein: 12, carbs: 2, fat: 7, measure: { label: 'fatia', grams: 50 }, maxG: 250 },
  { id: 'soy', name: 'Proteína de soja hidratada (PTS)', protein: 17, carbs: 10, fat: 0.5, measure: { label: 'col. de sopa', grams: 25 }, maxG: 250 },
  { id: 'chickpea', name: 'Grão-de-bico cozido', protein: 8.9, carbs: 27, fat: 2.6, measure: { label: 'col. de sopa', grams: 22 }, maxG: 200 },
  // Carboidratos
  { id: 'rice', name: 'Arroz branco', protein: 2.5, carbs: 28, fat: 0.2, measure: { label: 'col. de sopa', grams: 25 }, maxG: 300 },
  { id: 'brownRice', name: 'Arroz integral', protein: 2.6, carbs: 25.8, fat: 1, measure: { label: 'col. de sopa', grams: 25 }, maxG: 300 },
  { id: 'sweetPotato', name: 'Batata-doce cozida', protein: 0.6, carbs: 18.4, fat: 0.1, measure: { label: 'pedaço médio', grams: 80 }, maxG: 350 },
  { id: 'cassava', name: 'Mandioca cozida', protein: 0.6, carbs: 30, fat: 0.3, measure: { label: 'pedaço', grams: 60 }, maxG: 300 },
  { id: 'wholeBread', name: 'Pão integral', protein: 9.4, carbs: 49, fat: 3.7, measure: { label: 'fatia', grams: 25 }, maxG: 125, gluten: true },
  { id: 'tapioca', name: 'Tapioca (goma)', protein: 0, carbs: 54, fat: 0, measure: { label: 'col. de sopa', grams: 20 }, maxG: 120 },
  { id: 'couscous', name: 'Cuscuz de milho', protein: 2.2, carbs: 25, fat: 0.7, measure: { label: 'xícara', grams: 120 }, maxG: 300 },
  { id: 'oats', name: 'Aveia em flocos', protein: 14, carbs: 58, fat: 8, measure: { label: 'col. de sopa', grams: 15 }, maxG: 90, gluten: true },
  { id: 'banana', name: 'Banana', protein: 1.4, carbs: 22, fat: 0.1, measure: { label: 'unidade', grams: 90 }, maxG: 270 },
  { id: 'apple', name: 'Maçã', protein: 0.3, carbs: 15, fat: 0.2, measure: { label: 'unidade', grams: 130 }, maxG: 260 },
  // Gorduras
  { id: 'oliveOil', name: 'Azeite de oliva', protein: 0, carbs: 0, fat: 100, measure: { label: 'col. de sopa', grams: 13 }, maxG: 30 },
  { id: 'peanutButter', name: 'Pasta de amendoim', protein: 25, carbs: 20, fat: 50, measure: { label: 'col. de sopa', grams: 15 }, maxG: 45 },
  { id: 'nuts', name: 'Mix de castanhas', protein: 18, carbs: 20, fat: 55, measure: { label: 'punhado', grams: 20 }, maxG: 50 },
  { id: 'avocado', name: 'Abacate', protein: 1.2, carbs: 6, fat: 8.4, measure: { label: 'col. de sopa', grams: 30 }, maxG: 150 },
  // Fixos
  { id: 'beans', name: 'Feijão cozido', protein: 4.8, carbs: 13.6, fat: 0.5, measure: { label: 'concha', grams: 80 }, maxG: 160 },
  { id: 'salad', name: 'Salada de folhas e tomate', protein: 1.5, carbs: 3, fat: 0.2, measure: { label: 'prato raso', grams: 100 }, maxG: 300 },
  { id: 'veggies', name: 'Legumes cozidos (brócolis, cenoura, abobrinha)', protein: 2, carbs: 7, fat: 0.3, measure: { label: 'xícara', grams: 100 }, maxG: 300 },
  { id: 'papaya', name: 'Mamão', protein: 0.5, carbs: 11.6, fat: 0.1, measure: { label: 'fatia', grams: 150 }, maxG: 300 },
];

export const FOODS: Record<string, Food> = Object.fromEntries(list.map((f) => [f.id, f]));
