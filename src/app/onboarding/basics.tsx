import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { StepHeader } from '@/components/StepHeader';
import { Button, NumberField, OptionCard, Screen } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';

const RANGES = {
  age: [18, 90, 'Informe uma idade entre 18 e 90 anos.'],
  heightCm: [130, 220, 'Informe a altura em centímetros (ex.: 168).'],
  weightKg: [35, 250, 'Informe o peso em quilos (ex.: 72,5).'],
} as const;

export default function Basics() {
  const draft = useAppStore((s) => s.draft);
  const updateDraft = useAppStore((s) => s.updateDraft);
  const [touched, setTouched] = useState(false);

  const error = (key: keyof typeof RANGES) => {
    const v = draft[key];
    const [min, max, msg] = RANGES[key];
    return touched && (v === undefined || v < min || v > max) ? msg : undefined;
  };
  const valid =
    !!draft.sex && (Object.keys(RANGES) as (keyof typeof RANGES)[]).every((k) => {
      const v = draft[k];
      return v !== undefined && v >= RANGES[k][0] && v <= RANGES[k][1];
    });

  return (
    <Screen
      footer={
        <Button
          title="Continuar"
          onPress={() => {
            setTouched(true);
            if (valid) router.push('/onboarding/photos');
          }}
        />
      }>
      <StepHeader step={1} title="Sobre você" subtitle="Informações que você já sabe de cabeça." />
      <View style={{ gap: 10 }}>
        <OptionCard title="Feminino" selected={draft.sex === 'female'} onPress={() => updateDraft({ sex: 'female' })} />
        <OptionCard title="Masculino" selected={draft.sex === 'male'} onPress={() => updateDraft({ sex: 'male' })} />
      </View>
      <NumberField label="Idade" unit="anos" value={draft.age} onChange={(age) => updateDraft({ age })} error={error('age')} />
      <NumberField label="Altura" unit="cm" value={draft.heightCm} onChange={(heightCm) => updateDraft({ heightCm })} error={error('heightCm')} />
      <NumberField
        label="Peso"
        unit="kg"
        value={draft.weightKg}
        onChange={(weightKg) => updateDraft({ weightKg })}
        error={error('weightKg')}
        hint="De preferência pela manhã, em jejum."
      />
    </Screen>
  );
}
