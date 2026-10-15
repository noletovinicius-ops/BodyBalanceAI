export type Sex = 'female' | 'male';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high';
export type Experience = 'beginner' | 'intermediate' | 'advanced';
export type TrainingLocation = 'home' | 'gym';
export type Restriction = 'vegetarian' | 'lactoseFree' | 'glutenFree';

export interface Profile {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  /** Circunferência da cintura na altura do umbigo (opcional). */
  waistCm?: number;
  /** Silhueta autoavaliada, 1 (mais magra) a 9 (mais volumosa). */
  silhouette: number;
  activity: ActivityLevel;
  daysPerWeek: number;
  location: TrainingLocation;
  experience: Experience;
  restrictions: Restriction[];
}

/** Níveis de condição-alvo, baseados nas categorias de %G do ACE. */
export type LeanTarget = 'athletic' | 'fitness' | 'healthy';

export type Goal =
  | { type: 'leaner'; target: LeanTarget; deadlineWeeks: number }
  | { type: 'muscle'; gainKg: number; deadlineWeeks: number }
  | { type: 'maintain' };
