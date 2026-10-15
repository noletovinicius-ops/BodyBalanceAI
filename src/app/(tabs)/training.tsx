import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppText, Button, Card, Screen, SectionTitle } from '@/components/ui';
import { WEEKDAY_LABEL, type ExercisePrescription } from '@/engine';
import { today, useAppStore } from '@/store/useAppStore';
import { usePlan } from '@/store/usePlan';
import { radius, usePalette } from '@/theme';

export default function Training() {
  const c = usePalette();
  const data = usePlan();
  const completed = useAppStore((s) => s.completedWorkouts);
  const toggleWorkout = useAppStore((s) => s.toggleWorkout);
  const todayIdx = new Date().getDay();
  const [selected, setSelected] = useState(todayIdx);
  if (!data) return null;

  const { training, week } = data;
  const workout = training.days.find((d) => d.weekday === selected);
  const isToday = selected === todayIdx;
  const done = completed.includes(today());
  const deload = week % 6 === 0;

  return (
    <Screen>
      <AppText variant="title">Seu treino</AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {[1, 2, 3, 4, 5, 6, 0].map((d) => {
          const has = training.days.some((w) => w.weekday === d);
          const active = d === selected;
          return (
            <Pressable
              key={d}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setSelected(d)}
              style={{
                width: 52,
                paddingVertical: 10,
                borderRadius: radius.md,
                alignItems: 'center',
                gap: 6,
                backgroundColor: active ? c.primary : c.surface,
                borderWidth: 1,
                borderColor: active ? c.primary : c.border,
              }}>
              <AppText variant="label" color={active ? c.onPrimary : c.textMuted}>
                {WEEKDAY_LABEL[d].slice(0, 3).toUpperCase()}
              </AppText>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: has ? (active ? c.onPrimary : c.primary) : 'transparent' }} />
            </Pressable>
          );
        })}
      </ScrollView>

      {deload && (
        <Card tone="accent">
          <AppText variant="heading">Semana leve</AppText>
          <AppText variant="caption">Faça metade das séries com a mesma carga para o corpo se recuperar.</AppText>
        </Card>
      )}

      {workout ? (
        <>
          <View>
            <AppText variant="heading">{workout.name}</AppText>
            <AppText variant="caption" muted>
              {WEEKDAY_LABEL[workout.weekday]} · aquecimento de 5 min antes de começar
            </AppText>
          </View>
          {workout.exercises.map((ex, i) => (
            <ExerciseCard key={`${ex.pattern}-${i}`} index={i + 1} ex={ex} />
          ))}
          {isToday && (
            <Button title={done ? 'Concluído ✓ (desfazer)' : 'Marcar treino como concluído'} variant={done ? 'secondary' : 'primary'} onPress={() => toggleWorkout(today())} />
          )}
        </>
      ) : (
        <Card tone="soft">
          <AppText variant="heading">Dia de descanso</AppText>
          <AppText variant="caption">Uma caminhada leve e alongamento ajudam na recuperação e somam passos.</AppText>
        </Card>
      )}

      <SectionTitle>Cardio</SectionTitle>
      <Card>
        <AppText variant="caption">{training.cardio}</AppText>
      </Card>
      <SectionTitle>Como progredir</SectionTitle>
      <Card>
        <AppText variant="caption">{training.progression}</AppText>
      </Card>
    </Screen>
  );
}

function ExerciseCard({ ex, index }: { ex: ExercisePrescription; index: number }) {
  const c = usePalette();
  const [open, setOpen] = useState(false);
  return (
    <Pressable accessibilityRole="button" accessibilityHint="Mostra a execução" onPress={() => setOpen(!open)}>
      <Card style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
            <AppText variant="label" color={c.primary}>
              {index}
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="heading">{ex.name}</AppText>
            <AppText variant="caption" muted>
              {ex.sets} séries × {ex.reps} · descanso {ex.restSec}s
            </AppText>
          </View>
        </View>
        {open ? (
          <AppText variant="caption" style={{ marginLeft: 42 }}>
            {ex.cue}
          </AppText>
        ) : null}
      </Card>
    </Pressable>
  );
}
