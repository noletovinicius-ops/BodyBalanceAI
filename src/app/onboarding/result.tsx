import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { ScoreRing } from '@/components/ScoreRing';
import { StepHeader } from '@/components/StepHeader';
import { AppText, Button, Card, OptionCard, Screen, SectionTitle, Stat } from '@/components/ui';
import { bodyScore, CATEGORY_LABEL, estimateComposition, resolveGoal, SCORE_LABEL, type GoalPlan, type Profile } from '@/engine';
import { duration, kg, num, weeklyKg } from '@/lib/format';
import { useAppStore } from '@/store/useAppStore';

export default function Result() {
  const draft = useAppStore((s) => s.draft);
  const goal = useAppStore((s) => s.goal);
  const startPlan = useAppStore((s) => s.startPlan);
  const profile = draft as Profile;

  const { comp, score, resolution } = useMemo(() => {
    const comp = estimateComposition(profile);
    return { comp, score: bodyScore(profile.sex, comp), resolution: goal ? resolveGoal(profile, comp, goal) : undefined };
  }, [profile, goal]);

  const [choice, setChoice] = useState<'extend' | 'keep'>('extend');

  const chosen: GoalPlan | undefined =
    resolution?.status === 'feasible'
      ? resolution.plan
      : resolution?.status === 'adjusted'
        ? choice === 'extend'
          ? resolution.extendDeadline
          : resolution.keepDeadline
        : undefined;

  return (
    <Screen
      footer={
        chosen ? (
          <Button
            title="Começar meu plano"
            onPress={() => {
              startPlan(chosen);
              router.replace('/');
            }}
          />
        ) : (
          <Button title="Escolher outra meta" variant="secondary" onPress={() => router.back()} />
        )
      }>
      <StepHeader step={7} title="Sua avaliação" />

      <View style={{ alignItems: 'center', gap: 10 }}>
        <ScoreRing value={score.value} level={score.level} label={SCORE_LABEL[score.level]} />
        <AppText style={{ textAlign: 'center' }}>{score.summary}</AppText>
      </View>

      <Card>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Stat label="Gordura" value={`${Math.round(comp.bodyFatPct)}%`} sub={CATEGORY_LABEL[score.category]} />
          <Stat label="IMC" value={num(comp.bmi)} />
          {comp.whtr ? <Stat label="Cintura/altura" value={num(comp.whtr, 2)} sub={comp.whtr < 0.5 ? 'Saudável' : 'Acima de 0,5'} /> : null}
        </View>
        <AppText variant="caption" muted>
          {score.confidence === 'high'
            ? 'Estimativa pela Relative Fat Mass (altura + cintura).'
            : 'Estimativa por IMC, idade e silhueta. Informe a cintura depois para mais precisão.'}
        </AppText>
      </Card>

      <SectionTitle>Sua meta</SectionTitle>
      {resolution?.status === 'feasible' && <PlanSummary plan={resolution.plan} intro="Meta viável no prazo escolhido" />}

      {resolution?.status === 'adjusted' && (
        <>
          <Card tone="accent">
            <AppText variant="heading">Esse prazo é curto demais para ser seguro</AppText>
            <AppText variant="caption">
              Em {duration(resolution.requestedWeeks)}, chegar lá exigiria um ritmo acima do recomendado
              {resolution.extendDeadline.type === 'leaner'
                ? ' (até 1% do peso por semana), o que custa massa muscular e energia.'
                : ' para ganho de massa magra no seu nível de experiência.'}{' '}
              Escolha a opção viável mais próxima:
            </AppText>
          </Card>
          <OptionCard
            title={`Manter a meta em ${duration(resolution.extendDeadline.weeks)}`}
            description={`${kg(resolution.extendDeadline.startWeightKg)} → ${kg(resolution.extendDeadline.targetWeightKg)}`}
            selected={choice === 'extend'}
            onPress={() => setChoice('extend')}
          />
          <OptionCard
            title={`Ir o mais longe possível em ${duration(resolution.keepDeadline.weeks)}`}
            description={`${kg(resolution.keepDeadline.startWeightKg)} → ${kg(resolution.keepDeadline.targetWeightKg)}${
              resolution.keepDeadline.targetBodyFatPct ? ` · ~${Math.round(resolution.keepDeadline.targetBodyFatPct)}% de gordura` : ''
            }`}
            selected={choice === 'keep'}
            onPress={() => setChoice('keep')}
          />
          {chosen && <PlanSummary plan={chosen} />}
        </>
      )}

      {resolution?.status === 'blocked' && (
        <Card tone="accent">
          <AppText variant="heading">{resolution.issue === 'underweight' ? 'Perder peso não é recomendado agora' : 'Você já atingiu essa meta'}</AppText>
          <AppText variant="caption">
            {resolution.issue === 'underweight'
              ? 'Seu IMC está abaixo de 18,5. Sugerimos a meta de ganhar massa muscular e conversar com um profissional de saúde.'
              : 'Sua gordura estimada já está na faixa escolhida. Que tal ganhar massa ou manter e tonificar?'}
          </AppText>
        </Card>
      )}
    </Screen>
  );
}

function PlanSummary({ plan, intro }: { plan: GoalPlan; intro?: string }) {
  return (
    <Card tone="soft">
      {intro ? <AppText variant="heading">{intro}</AppText> : null}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Stat label="Hoje" value={kg(plan.startWeightKg)} />
        <Stat label="Meta" value={kg(plan.targetWeightKg)} />
      </View>
      <AppText variant="caption" muted>
        {plan.type === 'maintain'
          ? 'Calorias de manutenção, proteína alta e treino de força para melhorar a composição corporal.'
          : `${duration(plan.weeks)} · ritmo de ${weeklyKg(plan.weeklyRate, plan.startWeightKg)}`}
      </AppText>
    </Card>
  );
}
