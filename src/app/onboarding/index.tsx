import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Silhouette } from '@/components/Silhouette';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { radius, usePalette } from '@/theme';

const STEPS = [
  { title: 'Avaliação simples', text: 'Fotos, peso, altura e, se quiser, a medida da cintura. Nada de exames.' },
  { title: 'Score baseado em ciência', text: 'Equações validadas na literatura estimam sua composição corporal.' },
  { title: 'Plano no seu prazo', text: 'Dieta e treino calculados para chegar à meta com segurança.' },
];

export default function Welcome() {
  const c = usePalette();
  const [agreed, setAgreed] = useState(false);

  return (
    <Screen footer={<Button title="Começar avaliação" disabled={!agreed} onPress={() => router.push('/onboarding/basics')} />}>
      <View style={{ alignItems: 'center', gap: 8, paddingTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 12 }}>
          <Silhouette sex="female" level={3} color={c.primarySoft} height={90} />
          <Silhouette sex="male" level={4} color={c.primary} height={110} />
          <Silhouette sex="female" level={5} color={c.accentSoft} height={90} />
        </View>
        <AppText variant="display" style={{ textAlign: 'center' }}>
          BodyBalance
        </AppText>
        <AppText muted style={{ textAlign: 'center', maxWidth: 320 }}>
          Seu equilíbrio entre corpo, alimentação e movimento, com metas simples e reais.
        </AppText>
      </View>

      <View style={{ gap: 12 }}>
        {STEPS.map((s, i) => (
          <View key={s.title} style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <AppText variant="heading" color={c.primary}>
                {i + 1}
              </AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="heading">{s.title}</AppText>
              <AppText variant="caption" muted>
                {s.text}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <Card tone="accent">
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
          onPress={() => setAgreed(!agreed)}
          style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: radius.sm / 2,
              borderWidth: 1.5,
              borderColor: c.accent,
              backgroundColor: agreed ? c.accent : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {agreed ? <Icon name="check" color="#fff" size={16} strokeWidth={2.4} /> : null}
          </View>
          <AppText variant="caption" style={{ flex: 1 }}>
            Tenho 18 anos ou mais, não estou gestante e entendo que o BodyBalance traz estimativas educativas. Ele não substitui
            nutricionista, educador físico ou médico.
          </AppText>
        </Pressable>
      </Card>
      <AppText variant="caption" muted style={{ textAlign: 'center' }}>
        Suas fotos e dados ficam apenas neste aparelho.
      </AppText>
    </Screen>
  );
}
