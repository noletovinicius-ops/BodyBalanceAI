import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import { SilhouettePicker } from '@/components/Silhouette';
import { StepHeader } from '@/components/StepHeader';
import { AppText, Button, Screen } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { radius } from '@/theme';

export default function SilhouetteStep() {
  const draft = useAppStore((s) => s.draft);
  const front = useAppStore((s) => s.draftPhotos.front ?? s.draftPhotos.side ?? s.draftPhotos.back);
  const updateDraft = useAppStore((s) => s.updateDraft);

  return (
    <Screen footer={<Button title="Continuar" disabled={!draft.silhouette} onPress={() => router.push('/onboarding/waist')} />}>
      <StepHeader
        step={3}
        title="Qual silhueta mais se parece com você?"
        subtitle={`${front ? 'Compare com a sua foto' : 'Pense em como você está hoje'} e escolha com honestidade. Não existe resposta certa.`}
      />
      {front ? (
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <Image source={{ uri: front }} style={{ width: 90, height: 120, borderRadius: radius.md }} contentFit="cover" accessibilityLabel="Sua foto de frente" />
          <AppText variant="caption" muted style={{ flex: 1 }}>
            Repare no formato da cintura, do quadril e dos braços, não no rosto ou na altura.
          </AppText>
        </View>
      ) : null}
      <SilhouettePicker sex={draft.sex ?? 'female'} value={draft.silhouette} onChange={(silhouette) => updateDraft({ silhouette })} />
    </Screen>
  );
}
