import { router } from 'expo-router';
import { View } from 'react-native';

import { StepHeader } from '@/components/StepHeader';
import { Button, Chip, OptionCard, Screen, SectionTitle } from '@/components/ui';
import type { ActivityLevel, Experience, Restriction, TrainingLocation } from '@/engine';
import { useAppStore } from '@/store/useAppStore';

const ACTIVITY: { id: ActivityLevel; title: string; description: string }[] = [
  { id: 'sedentary', title: 'Pouco ativo', description: 'Trabalho sentado e quase nenhum exercício' },
  { id: 'light', title: 'Levemente ativo', description: 'Caminho no dia a dia ou me exercito 1–3x por semana' },
  { id: 'moderate', title: 'Ativo', description: 'Exercício 3–5x por semana ou trabalho em pé' },
  { id: 'high', title: 'Muito ativo', description: 'Exercício intenso quase todo dia ou trabalho físico' },
];

const LOCATIONS: { id: TrainingLocation; title: string; description: string }[] = [
  { id: 'gym', title: 'Academia', description: 'Máquinas, halteres e polias' },
  { id: 'home', title: 'Em casa', description: 'Peso do corpo e objetos simples' },
];

const EXPERIENCE: { id: Experience; title: string; description: string }[] = [
  { id: 'beginner', title: 'Iniciante', description: 'Nunca treinei ou parei há muito tempo' },
  { id: 'intermediate', title: 'Intermediário', description: 'Treino com regularidade há 6 meses a 2 anos' },
  { id: 'advanced', title: 'Avançado', description: 'Treino com consistência há mais de 2 anos' },
];

const RESTRICTIONS: { id: Restriction; label: string }[] = [
  { id: 'vegetarian', label: 'Vegetariano' },
  { id: 'lactoseFree', label: 'Sem lactose' },
  { id: 'glutenFree', label: 'Sem glúten' },
];

export default function Lifestyle() {
  const draft = useAppStore((s) => s.draft);
  const updateDraft = useAppStore((s) => s.updateDraft);
  const restrictions = draft.restrictions ?? [];
  const valid = !!draft.activity && !!draft.daysPerWeek && !!draft.location && !!draft.experience;

  return (
    <Screen footer={<Button title="Continuar" disabled={!valid} onPress={() => router.push('/onboarding/goal')} />}>
      <StepHeader step={5} title="Sua rotina" subtitle="Para montar um plano que caiba na sua semana." />

      <SectionTitle>No dia a dia, você é</SectionTitle>
      <View style={{ gap: 10 }}>
        {ACTIVITY.map((a) => (
          <OptionCard key={a.id} title={a.title} description={a.description} selected={draft.activity === a.id} onPress={() => updateDraft({ activity: a.id })} />
        ))}
      </View>

      <SectionTitle>Quantos dias por semana pode treinar?</SectionTitle>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {[2, 3, 4, 5, 6].map((d) => (
          <Chip key={d} label={`${d} dias`} selected={draft.daysPerWeek === d} onPress={() => updateDraft({ daysPerWeek: d })} />
        ))}
      </View>

      <SectionTitle>Onde vai treinar?</SectionTitle>
      <View style={{ gap: 10 }}>
        {LOCATIONS.map((l) => (
          <OptionCard key={l.id} title={l.title} description={l.description} selected={draft.location === l.id} onPress={() => updateDraft({ location: l.id })} />
        ))}
      </View>

      <SectionTitle>Experiência com musculação</SectionTitle>
      <View style={{ gap: 10 }}>
        {EXPERIENCE.map((e) => (
          <OptionCard key={e.id} title={e.title} description={e.description} selected={draft.experience === e.id} onPress={() => updateDraft({ experience: e.id })} />
        ))}
      </View>

      <SectionTitle>Restrições alimentares (opcional)</SectionTitle>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {RESTRICTIONS.map((r) => (
          <Chip
            key={r.id}
            label={r.label}
            selected={restrictions.includes(r.id)}
            onPress={() =>
              updateDraft({
                restrictions: restrictions.includes(r.id) ? restrictions.filter((x) => x !== r.id) : [...restrictions, r.id],
              })
            }
          />
        ))}
      </View>
    </Screen>
  );
}
