import { router } from 'expo-router';
import { View } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';

import { Silhouette } from '@/components/Silhouette';
import { StepHeader } from '@/components/StepHeader';
import { AppText, Button, Card, NumberField, Screen } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { usePalette } from '@/theme';

export default function Waist() {
  const c = usePalette();
  const draft = useAppStore((s) => s.draft);
  const updateDraft = useAppStore((s) => s.updateDraft);
  const invalid = draft.waistCm !== undefined && (draft.waistCm < 45 || draft.waistCm > 200);

  return (
    <Screen
      footer={
        <>
          <Button title="Continuar" disabled={!draft.waistCm || invalid} onPress={() => router.push('/onboarding/lifestyle')} />
          <Button
            title="Pular, não tenho fita métrica"
            variant="ghost"
            onPress={() => {
              updateDraft({ waistCm: undefined });
              router.push('/onboarding/lifestyle');
            }}
          />
        </>
      }>
      <StepHeader step={4} title="Medida da cintura" subtitle="Opcional, mas deixa seu score bem mais preciso. Leva 30 segundos." />
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ width: 70, height: 150 }}>
          <Silhouette sex={draft.sex ?? 'female'} level={draft.silhouette ?? 4} color={c.silhouette} height={150} />
          <Svg width={70} height={150} viewBox="0 0 100 215" style={{ position: 'absolute' }}>
            <Ellipse cx={50} cy={92} rx={34} ry={5} stroke={c.accent} strokeWidth={3} fill="none" />
          </Svg>
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <AppText variant="caption">1. Fique em pé, relaxado, sem encolher a barriga.</AppText>
          <AppText variant="caption">2. Passe a fita na altura do umbigo, paralela ao chão.</AppText>
          <AppText variant="caption">3. Solte o ar normalmente e leia a medida.</AppText>
        </View>
      </Card>
      <NumberField
        label="Cintura"
        unit="cm"
        value={draft.waistCm}
        onChange={(waistCm) => updateDraft({ waistCm })}
        error={invalid ? 'Confira a medida: esperamos algo entre 45 e 200 cm.' : undefined}
      />
    </Screen>
  );
}
