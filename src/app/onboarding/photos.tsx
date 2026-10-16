import { router } from 'expo-router';
import { View } from 'react-native';

import { PhotoSlot } from '@/components/PhotoSlot';
import { StepHeader } from '@/components/StepHeader';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';

const TIPS = [
  'Luz natural, de frente para a janela',
  'Roupa justa (top/short ou roupa de banho)',
  'Corpo inteiro, da cabeça aos pés',
  'Celular na altura do umbigo, a 2–3 passos',
];

export default function Photos() {
  const photos = useAppStore((s) => s.draftPhotos);
  const setDraftPhoto = useAppStore((s) => s.setDraftPhoto);
  const hasPhoto = !!(photos.front || photos.side || photos.back);

  return (
    <Screen
      footer={
        <>
          <Button title="Continuar" disabled={!hasPhoto} onPress={() => router.push('/onboarding/silhouette')} />
          <Button
            title="Pular, prefiro não enviar fotos"
            variant="ghost"
            onPress={() => {
              (['front', 'side', 'back'] as const).forEach((pose) => setDraftPhoto(pose, undefined));
              router.push('/onboarding/silhouette');
            }}
          />
        </>
      }>
      <StepHeader
        step={2}
        title="Suas fotos de ponto de partida"
        subtitle="Opcional, mas ajudam a escolher a silhueta mais parecida e a comparar sua evolução. Ficam só no seu aparelho."
      />
      <Card tone="soft">
        <AppText variant="heading">Para fotos comparáveis</AppText>
        <View style={{ gap: 4 }}>
          {TIPS.map((t) => (
            <AppText key={t} variant="caption">
              •  {t}
            </AppText>
          ))}
        </View>
      </Card>
      <PhotoSlot label="Frente" uri={photos.front} onChange={(u) => setDraftPhoto('front', u)} />
      <PhotoSlot label="Lado" uri={photos.side} onChange={(u) => setDraftPhoto('side', u)} />
      <PhotoSlot label="Costas" uri={photos.back} onChange={(u) => setDraftPhoto('back', u)} />
    </Screen>
  );
}
