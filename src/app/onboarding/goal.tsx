import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { StepHeader } from '@/components/StepHeader';
import { AppText, Button, Card, Chip, OptionCard, Screen, SectionTitle } from '@/components/ui';
import {
  bodyScore,
  CATEGORY_LABEL,
  DEADLINE_OPTIONS,
  estimateComposition,
  LEAN_TARGET_BF,
  LEAN_TARGET_LABEL,
  type Goal,
  type LeanTarget,
  type Profile,
} from '@/engine';
import { useAppStore } from '@/store/useAppStore';

const LEAN_TARGETS: LeanTarget[] = ['healthy', 'fitness', 'athletic'];
const GAIN_OPTIONS = [2, 4, 6];

export default function GoalStep() {
  const draft = useAppStore((s) => s.draft);
  const saved = useAppStore((s) => s.goal);
  const setGoal = useAppStore((s) => s.setGoal);
  const profile = draft as Profile;
  const comp = useMemo(() => estimateComposition(profile), [profile]);
  const score = bodyScore(profile.sex, comp);

  const canLose = (t: LeanTarget) => comp.bmiClass !== 'under' && comp.bodyFatPct > LEAN_TARGET_BF[t][profile.sex] + 0.5;
  const firstLean = LEAN_TARGETS.find(canLose);

  const [type, setType] = useState<Goal['type']>(saved?.type ?? (firstLean ? 'leaner' : 'muscle'));
  const [target, setTarget] = useState<LeanTarget | undefined>(saved?.type === 'leaner' && canLose(saved.target) ? saved.target : firstLean);
  const [gainKg, setGainKg] = useState(saved?.type === 'muscle' ? saved.gainKg : 2);
  const [weeks, setWeeks] = useState<number>(saved && saved.type !== 'maintain' ? saved.deadlineWeeks : 13);

  const goal: Goal | undefined =
    type === 'maintain'
      ? { type }
      : type === 'muscle'
        ? { type, gainKg, deadlineWeeks: weeks }
        : target
          ? { type, target, deadlineWeeks: weeks }
          : undefined;

  return (
    <Screen
      footer={
        <Button
          title="Gerar meu plano"
          disabled={!goal}
          onPress={() => {
            if (!goal) return;
            setGoal(goal);
            router.push('/onboarding/result');
          }}
        />
      }>
      <StepHeader step={6} title="Qual é a sua meta?" subtitle="Escolha um objetivo e um prazo. O app ajusta se o prazo não for seguro." />

      <Card tone="soft" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <AppText variant="display">{score.value}</AppText>
        <View style={{ flex: 1 }}>
          <AppText variant="heading">Seu ponto de partida</AppText>
          <AppText variant="caption" muted>
            Faixa {CATEGORY_LABEL[score.category]} · cerca de {Math.round(comp.bodyFatPct)}% de gordura
          </AppText>
        </View>
      </Card>

      <View style={{ gap: 10 }}>
        <OptionCard
          title="Definir o corpo"
          description={firstLean ? 'Reduzir gordura preservando músculos' : 'Você já está numa faixa de gordura baixa'}
          selected={type === 'leaner'}
          disabled={!firstLean}
          onPress={() => setType('leaner')}
        />
        <OptionCard title="Ganhar massa muscular" description="Mais músculo, com o mínimo de gordura" selected={type === 'muscle'} onPress={() => setType('muscle')} />
        <OptionCard title="Manter e tonificar" description="Manter o peso e melhorar força e forma" selected={type === 'maintain'} onPress={() => setType('maintain')} />
      </View>

      {type === 'leaner' && (
        <>
          <SectionTitle>Aonde você quer chegar?</SectionTitle>
          <View style={{ gap: 10 }}>
            {LEAN_TARGETS.map((t) => (
              <OptionCard
                key={t}
                title={LEAN_TARGET_LABEL[t]}
                description={canLose(t) ? `Cerca de ${LEAN_TARGET_BF[t][profile.sex]}% de gordura corporal` : 'Você já está aqui ou abaixo'}
                selected={target === t}
                disabled={!canLose(t)}
                onPress={() => setTarget(t)}
              />
            ))}
          </View>
        </>
      )}

      {type === 'muscle' && (
        <>
          <SectionTitle>Quanto quer ganhar?</SectionTitle>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {GAIN_OPTIONS.map((g) => (
              <Chip key={g} label={`+${g} kg`} selected={gainKg === g} onPress={() => setGainKg(g)} />
            ))}
          </View>
        </>
      )}

      {type !== 'maintain' && (
        <>
          <SectionTitle>Em quanto tempo?</SectionTitle>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {DEADLINE_OPTIONS.map((d) => (
              <Chip key={d.weeks} label={d.label} selected={weeks === d.weeks} onPress={() => setWeeks(d.weeks)} />
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}
