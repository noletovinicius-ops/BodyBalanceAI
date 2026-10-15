import { Stack } from 'expo-router';

import { usePalette } from '@/theme';

export default function OnboardingLayout() {
  const c = usePalette();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.background }, animation: 'slide_from_right' }} />;
}
