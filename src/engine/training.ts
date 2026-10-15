import { COMPOUND, EXERCISES, SPLITS, WORKOUTS, type Pattern } from '../data/exercises';
import type { GoalPlan } from './goals';
import { clamp } from './math';
import type { Experience, Profile } from './types';

export interface ExercisePrescription {
  pattern: Pattern;
  name: string;
  cue: string;
  sets: number;
  reps: string;
  restSec: number;
}

export interface WorkoutDay {
  weekday: number;
  name: string;
  exercises: ExercisePrescription[];
}

export interface TrainingPlan {
  days: WorkoutDay[];
  cardio: string;
  progression: string;
}

export const WEEKDAY_LABEL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

/** Volume e intensidade segundo a posição do ACSM (2009) para cada nível. */
const DOSE: Record<Experience, { sets: number; compound: string; accessory: string; rest: number }> = {
  beginner: { sets: 2, compound: '10–12', accessory: '12–15', rest: 60 },
  intermediate: { sets: 3, compound: '8–12', accessory: '10–15', rest: 90 },
  advanced: { sets: 4, compound: '6–10', accessory: '10–12', rest: 120 },
};

function prescribe(pattern: Pattern, p: Profile): ExercisePrescription {
  const dose = DOSE[p.experience];
  const ex = EXERCISES[pattern][p.location];
  const compound = COMPOUND.includes(pattern);
  // Sem carga externa, o estímulo vem de mais repetições.
  const reps =
    pattern === 'core'
      ? '30–45 s'
      : p.location === 'home' && compound
        ? dose.accessory
        : compound
          ? dose.compound
          : dose.accessory;
  return {
    pattern,
    name: ex.name,
    cue: ex.cue,
    sets: compound ? dose.sets + (p.experience === 'beginner' ? 1 : 0) : dose.sets,
    reps,
    restSec: compound ? dose.rest : 60,
  };
}

export function buildTrainingPlan(p: Profile, plan: GoalPlan): TrainingPlan {
  const split = SPLITS[clamp(Math.round(p.daysPerWeek), 2, 6)];
  const days = split.workouts.map((id, i) => ({
    weekday: split.weekdays[i],
    name: WORKOUTS[id].name,
    exercises: WORKOUTS[id].patterns.map((pt) => prescribe(pt, p)),
  }));

  const cardio =
    plan.type === 'leaner'
      ? 'Faça 2 a 3 sessões de 20–30 min de cardio moderado (caminhada rápida, bike ou elíptico). Você deve conseguir conversar, mas com esforço. Some isso à meta de passos diária.'
      : 'Faça 1 a 2 sessões leves de 20 min de cardio por semana para saúde cardiovascular, sem atrapalhar a recuperação.';

  const progression =
    'Escolha uma carga em que as últimas 2 repetições fiquem difíceis. Quando completar o topo da faixa em todas as séries, aumente a carga (ou a dificuldade) na semana seguinte. A cada 6 semanas, faça uma semana mais leve, com metade das séries.';

  return { days, cardio, progression };
}
