import { router } from 'expo-router';
import { Alert, Platform, View } from 'react-native';

import { AppText, Button, Card, Screen, SectionTitle } from '@/components/ui';
import { REFERENCES } from '@/engine/references';
import { deleteAllPhotos } from '@/lib/photos';
import { kg } from '@/lib/format';
import { useAppStore } from '@/store/useAppStore';
import { usePlan } from '@/store/usePlan';

const ACTIVITY_LABEL = { sedentary: 'Pouco ativo', light: 'Levemente ativo', moderate: 'Ativo', high: 'Muito ativo' };
const LOCATION_LABEL = { home: 'Em casa', gym: 'Academia' };

function confirm(title: string, message: string, onYes: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onYes();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Confirmar', style: 'destructive', onPress: onYes },
  ]);
}

export default function Settings() {
  const data = usePlan();
  const restartAssessment = useAppStore((s) => s.restartAssessment);
  const reset = useAppStore((s) => s.reset);
  if (!data) return null;
  const { profile } = data;

  return (
    <Screen>
      <AppText variant="title">Ajustes</AppText>

      <Card>
        <AppText variant="heading">Seus dados</AppText>
        <View style={{ gap: 4 }}>
          <AppText variant="caption">
            {profile.sex === 'female' ? 'Feminino' : 'Masculino'} · {profile.age} anos · {profile.heightCm} cm · {kg(profile.weightKg)}
          </AppText>
          <AppText variant="caption">Cintura: {profile.waistCm ? `${profile.waistCm} cm` : 'não informada'}</AppText>
          <AppText variant="caption">
            {ACTIVITY_LABEL[profile.activity]} · treino {LOCATION_LABEL[profile.location].toLowerCase()}, {profile.daysPerWeek}x por semana
          </AppText>
        </View>
        <Button
          title="Refazer avaliação e meta"
          variant="secondary"
          onPress={() =>
            confirm('Refazer avaliação?', 'Você vai revisar seus dados, tirar novas fotos e escolher uma nova meta. Seu histórico é mantido.', () => {
              router.replace('/onboarding/basics');
              restartAssessment();
            })
          }
        />
      </Card>

      <SectionTitle>Por que esses números?</SectionTitle>
      {REFERENCES.map((r) => (
        <Card key={r.topic} style={{ gap: 4 }}>
          <AppText variant="heading">{r.topic}</AppText>
          <AppText variant="caption">{r.text}</AppText>
          <AppText variant="caption" muted style={{ fontStyle: 'italic' }}>
            {r.citation}
          </AppText>
        </Card>
      ))}

      <Card tone="accent">
        <AppText variant="caption">
          O BodyBalance oferece estimativas educativas baseadas em equações populacionais. Ele não substitui avaliação de nutricionista,
          educador físico ou médico. Procure um profissional se tiver doenças, usar medicamentos ou sentir qualquer desconforto.
        </AppText>
      </Card>

      <Button
        title="Apagar todos os meus dados"
        variant="danger"
        onPress={() =>
          confirm('Apagar tudo?', 'Fotos, medidas e planos serão removidos deste aparelho. Isso não pode ser desfeito.', () => {
            router.replace('/onboarding');
            deleteAllPhotos();
            reset();
          })
        }
      />
    </Screen>
  );
}
