import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { usePalette } from '@/theme';

import { Icon } from './Icon';
import { AppText, ProgressBar } from './ui';

export const ONBOARDING_STEPS = 7;

export function StepHeader({ step, title, subtitle }: { step: number; title: string; subtitle?: string }) {
  const c = usePalette();
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => router.back()} hitSlop={12}>
          <Icon name="back" color={c.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressBar value={step / ONBOARDING_STEPS} height={6} />
        </View>
        <AppText variant="label" muted>
          {step}/{ONBOARDING_STEPS}
        </AppText>
      </View>
      <View style={{ gap: 6 }}>
        <AppText variant="title">{title}</AppText>
        {subtitle ? <AppText muted>{subtitle}</AppText> : null}
      </View>
    </View>
  );
}
