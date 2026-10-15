import { router } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { ScoreRing } from '@/components/ScoreRing';
import { AppText, Button, Card, ProgressBar, Screen, SectionTitle, Stat } from '@/components/ui';
import { CATEGORY_LABEL, SCORE_LABEL } from '@/engine';
import { kg, num } from '@/lib/format';
import { today, useAppStore } from '@/store/useAppStore';
import { usePlan } from '@/store/usePlan';
import { usePalette } from '@/theme';

const TIPS = [
  'Proteína em todas as refeições ajuda a saciedade e preserva os músculos.',
  'Dormir 7–9 horas melhora a recuperação e controla a fome.',
  'Pese-se sempre no mesmo horário, de manhã, para comparar de forma justa.',
  'Beba um copo de água antes de cada refeição.',
  'Constância vence perfeição: 80% do plano, toda semana, já traz resultado.',
  'Encha metade do prato com salada e legumes.',
  'Use as trocas do cardápio para não enjoar da comida.',
];

export default function Home() {
  const c = usePalette();
  const data = usePlan();
  const completed = useAppStore((s) => s.completedWorkouts);
  if (!data) return null;

  const { goal, profile, score, nutrition, training, week, composition } = data;
  const workout = training.days.find((d) => d.weekday === new Date().getDay());
  const total = goal.targetWeightKg - goal.startWeightKg;
  const progress = goal.type === 'maintain' || total === 0 ? week / goal.weeks : (profile.weightKg - goal.startWeightKg) / total;
  const tip = TIPS[new Date().getDate() % TIPS.length];

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <AppText variant="label" muted>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
        </AppText>
        <AppText variant="title">Olá! Semana {week} de {goal.weeks}</AppText>
      </View>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
        <ScoreRing value={score.value} level={score.level} size={120} label={SCORE_LABEL[score.level]} />
        <View style={{ flex: 1, gap: 4 }}>
          <AppText variant="heading">Faixa {CATEGORY_LABEL[score.category]}</AppText>
          <AppText variant="caption" muted>
            ~{Math.round(composition.bodyFatPct)}% de gordura · IMC {num(composition.bmi)}
          </AppText>
        </View>
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Stat label="Início" value={kg(goal.startWeightKg)} />
          <Stat label="Atual" value={kg(profile.weightKg)} />
          <Stat label="Meta" value={kg(goal.targetWeightKg)} />
        </View>
        <ProgressBar value={progress} />
        <AppText variant="caption" muted>
          {goal.type === 'maintain' ? 'Fase de manutenção e tonificação.' : `${Math.round(Math.max(0, Math.min(1, progress)) * 100)}% do caminho até a meta.`}
        </AppText>
      </Card>

      <SectionTitle>Hoje</SectionTitle>
      <Card tone="soft" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Icon name="dumbbell" color={c.primary} size={28} />
        <View style={{ flex: 1 }}>
          <AppText variant="heading">{workout ? workout.name : 'Descanso ativo'}</AppText>
          <AppText variant="caption" muted>
            {workout
              ? completed.includes(today())
                ? 'Treino concluído. Mandou bem!'
                : `${workout.exercises.length} exercícios`
              : 'Caminhe e alongue-se. Recuperar também é treino.'}
          </AppText>
        </View>
        {workout ? <Button title="Ver" variant="secondary" onPress={() => router.navigate('/training')} style={{ minHeight: 40 }} /> : null}
      </Card>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Icon name="leaf" color={c.primary} size={28} />
        <View style={{ flex: 1 }}>
          <AppText variant="heading">{nutrition.kcal} kcal</AppText>
          <AppText variant="caption" muted>
            {nutrition.proteinG} g proteína · {nutrition.carbsG} g carbo · {nutrition.fatG} g gordura
          </AppText>
        </View>
        <Button title="Cardápio" variant="secondary" onPress={() => router.navigate('/diet')} style={{ minHeight: 40 }} />
      </Card>

      <Card tone="accent">
        <AppText variant="label" muted>
          DICA DO DIA
        </AppText>
        <AppText>{tip}</AppText>
      </Card>
    </Screen>
  );
}
