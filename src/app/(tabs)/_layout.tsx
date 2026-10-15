import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/tabs';

import { Icon, type IconName } from '@/components/Icon';
import { useAppStore } from '@/store/useAppStore';
import { fonts, usePalette } from '@/theme';

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Início', icon: 'home' },
  { name: 'diet', title: 'Dieta', icon: 'leaf' },
  { name: 'training', title: 'Treino', icon: 'dumbbell' },
  { name: 'progress', title: 'Progresso', icon: 'chart' },
  { name: 'settings', title: 'Ajustes', icon: 'settings' },
];

export default function TabsLayout() {
  const c = usePalette();
  const onboarded = useAppStore((s) => !!s.profile && !!s.plan);
  if (!onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.border },
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        sceneStyle: { backgroundColor: c.background },
      }}>
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{ title: t.title, tabBarIcon: ({ color, size }) => <Icon name={t.icon} color={String(color)} size={size} /> }}
        />
      ))}
    </Tabs>
  );
}
