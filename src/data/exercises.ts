import type { TrainingLocation } from '../engine/types';

export type Pattern =
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'glute'
  | 'pushH'
  | 'pushV'
  | 'pullH'
  | 'pullV'
  | 'core'
  | 'calf'
  | 'biceps'
  | 'triceps';

export interface Exercise {
  name: string;
  cue: string;
}

export const COMPOUND: Pattern[] = ['squat', 'hinge', 'lunge', 'pushH', 'pushV', 'pullH', 'pullV'];

export const EXERCISES: Record<Pattern, Record<TrainingLocation, Exercise>> = {
  squat: {
    home: { name: 'Agachamento livre', cue: 'Pés na largura dos ombros. Desça como se fosse sentar, com os joelhos na direção dos pés.' },
    gym: { name: 'Leg press 45°', cue: 'Desça até cerca de 90° nos joelhos sem tirar a lombar do encosto.' },
  },
  hinge: {
    home: { name: 'Stiff com mochila', cue: 'Leve o quadril para trás com a coluna neutra e a carga perto das pernas.' },
    gym: { name: 'Stiff com halteres', cue: 'Leve o quadril para trás com a coluna neutra e os halteres rente às coxas.' },
  },
  lunge: {
    home: { name: 'Afundo alternado', cue: 'Passo largo à frente, joelho de trás quase toca o chão e o tronco fica firme.' },
    gym: { name: 'Agachamento búlgaro com halteres', cue: 'Pé de trás apoiado no banco. Desça na vertical controlando o joelho da frente.' },
  },
  glute: {
    home: { name: 'Elevação de quadril no chão', cue: 'Empurre pelos calcanhares e contraia os glúteos no topo por 1 segundo.' },
    gym: { name: 'Elevação de quadril com barra', cue: 'Costas no banco e barra no quadril. Suba até alinhar tronco e coxas.' },
  },
  pushH: {
    home: { name: 'Flexão de braço', cue: 'Corpo em linha reta. Apoie os joelhos se precisar e desça o peito até perto do chão.' },
    gym: { name: 'Supino com halteres', cue: 'Escápulas encaixadas no banco. Desça os halteres até a linha do peito.' },
  },
  pushV: {
    home: { name: 'Flexão pike', cue: 'Quadril alto em "V invertido". Desça a cabeça em direção às mãos.' },
    gym: { name: 'Desenvolvimento com halteres', cue: 'Sentado, empurre os halteres acima da cabeça sem arquear a lombar.' },
  },
  pullH: {
    home: { name: 'Remada curvada com mochila', cue: 'Tronco inclinado e coluna neutra. Puxe a mochila em direção ao umbigo.' },
    gym: { name: 'Remada baixa na polia', cue: 'Peito aberto. Puxe o triângulo até o abdômen juntando as escápulas.' },
  },
  pullV: {
    home: { name: 'Remada invertida na mesa', cue: 'Deitado sob uma mesa firme, puxe o peito em direção à borda.' },
    gym: { name: 'Puxada frontal na polia', cue: 'Puxe a barra até a parte de cima do peito, cotovelos apontando para baixo.' },
  },
  core: {
    home: { name: 'Prancha', cue: 'Antebraços no chão, abdômen e glúteos contraídos, sem deixar o quadril cair.' },
    gym: { name: 'Prancha', cue: 'Antebraços no chão, abdômen e glúteos contraídos, sem deixar o quadril cair.' },
  },
  calf: {
    home: { name: 'Panturrilha no degrau', cue: 'Ponta dos pés no degrau. Suba o máximo e desça devagar.' },
    gym: { name: 'Panturrilha na máquina', cue: 'Amplitude completa: alongue embaixo e contraia em cima.' },
  },
  biceps: {
    home: { name: 'Rosca com mochila ou elástico', cue: 'Cotovelos colados ao corpo. Suba sem balançar o tronco.' },
    gym: { name: 'Rosca direta com halteres', cue: 'Cotovelos colados ao corpo. Suba sem balançar o tronco.' },
  },
  triceps: {
    home: { name: 'Tríceps no banco ou cadeira', cue: 'Mãos na borda da cadeira. Desça dobrando os cotovelos para trás.' },
    gym: { name: 'Tríceps na polia', cue: 'Cotovelos fixos ao lado do corpo. Estenda os braços por completo.' },
  },
};

export const WORKOUTS: Record<string, { name: string; patterns: Pattern[] }> = {
  fullA: { name: 'Corpo inteiro A', patterns: ['squat', 'pushH', 'pullH', 'hinge', 'core'] },
  fullB: { name: 'Corpo inteiro B', patterns: ['lunge', 'pushV', 'pullV', 'glute', 'calf'] },
  upper: { name: 'Superiores', patterns: ['pushH', 'pullH', 'pushV', 'pullV', 'biceps', 'triceps'] },
  lower: { name: 'Inferiores', patterns: ['squat', 'hinge', 'lunge', 'glute', 'calf', 'core'] },
  push: { name: 'Empurrar', patterns: ['pushH', 'pushV', 'triceps', 'core'] },
  pull: { name: 'Puxar', patterns: ['pullV', 'pullH', 'hinge', 'biceps'] },
  legs: { name: 'Pernas', patterns: ['squat', 'lunge', 'glute', 'calf', 'core'] },
};

/** Divisão semanal por dias disponíveis e dias da semana sugeridos (0 = domingo). */
export const SPLITS: Record<number, { workouts: string[]; weekdays: number[] }> = {
  2: { workouts: ['fullA', 'fullB'], weekdays: [1, 4] },
  3: { workouts: ['fullA', 'fullB', 'fullA'], weekdays: [1, 3, 5] },
  4: { workouts: ['upper', 'lower', 'upper', 'lower'], weekdays: [1, 2, 4, 5] },
  5: { workouts: ['push', 'pull', 'legs', 'upper', 'lower'], weekdays: [1, 2, 3, 5, 6] },
  6: { workouts: ['push', 'pull', 'legs', 'push', 'pull', 'legs'], weekdays: [1, 2, 3, 4, 5, 6] },
};
