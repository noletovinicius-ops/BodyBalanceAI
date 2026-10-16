import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';

import { PhotoSlot } from '@/components/PhotoSlot';
import { AppText, Button, Card, NumberField, Screen, SectionTitle } from '@/components/ui';
import { WeightChart } from '@/components/WeightChart';
import { kg, num } from '@/lib/format';
import { daysBetween, today, useAppStore, type PhotoEntry, type PhotoPose } from '@/store/useAppStore';
import { usePlan } from '@/store/usePlan';
import { radius } from '@/theme';

const fmtDate = (d: string) => new Date(d + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function Progress() {
  const data = usePlan();
  const checkIns = useAppStore((s) => s.checkIns);
  const photos = useAppStore((s) => s.photos);
  const addCheckIn = useAppStore((s) => s.addCheckIn);
  const addPhotos = useAppStore((s) => s.addPhotos);
  const [weight, setWeight] = useState<number | undefined>();
  const [newPhotos, setNewPhotos] = useState<Partial<Record<PhotoPose, string>>>({});
  const [adding, setAdding] = useState(false);
  if (!data) return null;

  const last = checkIns[checkIns.length - 1];
  const checkedToday = last?.date === today();
  const fronts = photos.filter((p) => p.pose === 'front');
  const first = fronts[0];
  const latest = fronts[fronts.length - 1];
  const lastPhotoDate = photos.length ? photos[photos.length - 1].date : undefined;
  const daysSincePhoto = lastPhotoDate ? daysBetween(lastPhotoDate, today()) : 99;
  const validWeight = weight !== undefined && weight >= 35 && weight <= 250;

  // Agrupa fotos por data, da mais recente para a mais antiga.
  const byDate = Object.entries(
    photos.reduce<Record<string, PhotoEntry[]>>((acc, p) => ({ ...acc, [p.date]: [...(acc[p.date] ?? []), p] }), {}),
  ).sort(([a], [b]) => b.localeCompare(a));

  return (
    <Screen>
      <AppText variant="title">Seu progresso</AppText>

      <SectionTitle>Check-in de peso</SectionTitle>
      <Card>
        <NumberField
          label={checkedToday ? 'Atualizar peso de hoje' : 'Peso de hoje'}
          unit="kg"
          value={weight}
          onChange={setWeight}
          hint="Uma vez por semana, de manhã, em jejum. Seu plano é recalculado com o novo peso."
        />
        <Button
          title="Salvar check-in"
          disabled={!validWeight}
          onPress={() => {
            if (!validWeight) return;
            addCheckIn(weight);
            setWeight(undefined);
          }}
        />
        {checkIns.length > 0 && <WeightChart checkIns={checkIns} target={data.goal.targetWeightKg} />}
        {checkIns.length > 1 && (
          <AppText variant="caption" muted>
            {(() => {
              const diff = last.weightKg - checkIns[0].weightKg;
              return `${diff <= 0 ? '−' : '+'}${num(Math.abs(diff))} kg desde o início · faltam ${kg(Math.abs(data.goal.targetWeightKg - last.weightKg))}`;
            })()}
          </AppText>
        )}
      </Card>

      {first && latest && first !== latest && (
        <>
          <SectionTitle>Antes e agora</SectionTitle>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[first, latest].map((p) => (
              <View key={p.uri} style={{ flex: 1, gap: 6 }}>
                <Image source={{ uri: p.uri }} style={{ width: '100%', aspectRatio: 3 / 4, borderRadius: radius.md }} contentFit="cover" />
                <AppText variant="caption" muted style={{ textAlign: 'center' }}>
                  {fmtDate(p.date)}
                </AppText>
              </View>
            ))}
          </View>
        </>
      )}

      <SectionTitle>Fotos</SectionTitle>
      {adding ? (
        <Card>
          <AppText variant="caption" muted>
            Repita a mesma luz, roupa e distância das primeiras fotos.
          </AppText>
          <PhotoSlot label="Frente" uri={newPhotos.front} onChange={(u) => setNewPhotos({ ...newPhotos, front: u })} />
          <PhotoSlot label="Lado" uri={newPhotos.side} onChange={(u) => setNewPhotos({ ...newPhotos, side: u })} />
          <PhotoSlot label="Costas" uri={newPhotos.back} onChange={(u) => setNewPhotos({ ...newPhotos, back: u })} />
          <Button
            title="Salvar fotos"
            disabled={!(newPhotos.front || newPhotos.side || newPhotos.back)}
            onPress={() => {
              addPhotos(newPhotos);
              setNewPhotos({});
              setAdding(false);
            }}
          />
          <Button title="Cancelar" variant="ghost" onPress={() => setAdding(false)} />
        </Card>
      ) : (
        <Card tone={photos.length > 0 && daysSincePhoto >= 28 ? 'accent' : 'surface'}>
          <AppText variant="caption">
            {photos.length === 0
              ? 'Fotos são opcionais, mas ajudam a enxergar a mudança que a balança não mostra.'
              : daysSincePhoto >= 28
                ? 'Já se passaram 4 semanas: hora de novas fotos!'
                : `Próximas fotos em ${28 - daysSincePhoto} dias. Fotos a cada 4 semanas mostram melhor a mudança.`}
          </AppText>
          <Button title="Adicionar fotos de hoje" variant="secondary" onPress={() => setAdding(true)} />
        </Card>
      )}

      {byDate.map(([date, list]) => (
        <View key={date} style={{ gap: 8 }}>
          <AppText variant="caption" muted>
            {fmtDate(date)}
          </AppText>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {list.map((p) => (
              <Image key={p.uri} source={{ uri: p.uri }} style={{ width: 90, height: 120, borderRadius: radius.sm }} contentFit="cover" />
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}
