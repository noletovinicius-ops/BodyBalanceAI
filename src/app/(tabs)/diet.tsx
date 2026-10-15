import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { AppText, Card, Chip, ProgressBar, Screen, SectionTitle } from '@/components/ui';
import type { Portion } from '@/engine';
import { num } from '@/lib/format';
import { usePlan } from '@/store/usePlan';
import { usePalette } from '@/theme';

export default function Diet() {
  const c = usePalette();
  const data = usePlan();
  const [variant, setVariant] = useState(0);
  if (!data) return null;
  const { nutrition, menus } = data;
  const menu = menus[variant];

  const macros = [
    { label: 'Proteína', value: nutrition.proteinG, kcal: nutrition.proteinG * 4, color: c.primary },
    { label: 'Carboidrato', value: nutrition.carbsG, kcal: nutrition.carbsG * 4, color: c.warning },
    { label: 'Gordura', value: nutrition.fatG, kcal: nutrition.fatG * 9, color: c.accent },
  ];

  return (
    <Screen>
      <AppText variant="title">Sua alimentação</AppText>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
          <AppText variant="display">{nutrition.kcal}</AppText>
          <AppText muted>kcal por dia</AppText>
        </View>
        <AppText variant="caption" muted>
          {nutrition.deltaKcal < 0
            ? `${Math.abs(nutrition.deltaKcal)} kcal abaixo do seu gasto estimado (${nutrition.tdee} kcal).`
            : nutrition.deltaKcal > 0
              ? `${nutrition.deltaKcal} kcal acima do seu gasto estimado (${nutrition.tdee} kcal).`
              : `Igual ao seu gasto estimado (${nutrition.tdee} kcal).`}
          {nutrition.floorApplied ? ' Limitamos ao mínimo seguro de calorias.' : ''}
        </AppText>
        <View style={{ gap: 10 }}>
          {macros.map((m) => (
            <View key={m.label} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <AppText variant="caption">{m.label}</AppText>
                <AppText variant="caption" muted>
                  {m.value} g
                </AppText>
              </View>
              <ProgressBar value={m.kcal / nutrition.kcal} color={m.color} height={6} />
            </View>
          ))}
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Card style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Icon name="water" color={c.primary} />
          <View>
            <AppText variant="heading">{num(nutrition.waterMl / 1000)} L</AppText>
            <AppText variant="caption" muted>de água</AppText>
          </View>
        </Card>
        <Card style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Icon name="steps" color={c.primary} />
          <View>
            <AppText variant="heading">{nutrition.steps.toLocaleString('pt-BR')}</AppText>
            <AppText variant="caption" muted>passos</AppText>
          </View>
        </Card>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <SectionTitle>Cardápio sugerido</SectionTitle>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Chip label="Dia A" selected={variant === 0} onPress={() => setVariant(0)} />
          <Chip label="Dia B" selected={variant === 1} onPress={() => setVariant(1)} />
        </View>
      </View>

      {menu.meals.map((meal) => (
        <Card key={meal.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <AppText variant="heading">{meal.name}</AppText>
            <AppText variant="caption" muted>
              {meal.time} · {Math.round(meal.totals.kcal)} kcal
            </AppText>
          </View>
          <View style={{ gap: 10 }}>
            {meal.items.map((item) => (
              <FoodRow key={item.food.id} item={item} />
            ))}
          </View>
        </Card>
      ))}
      <AppText variant="caption" muted style={{ textAlign: 'center' }}>
        Toque em um alimento para ver trocas equivalentes. Temperos naturais, café e chá sem açúcar estão liberados.
      </AppText>
    </Screen>
  );
}

function FoodRow({ item }: { item: Portion }) {
  const c = usePalette();
  const [open, setOpen] = useState(false);
  const canSwap = item.swaps.length > 0;
  return (
    <View>
      <Pressable
        disabled={!canSwap}
        onPress={() => setOpen(!open)}
        accessibilityRole={canSwap ? 'button' : undefined}
        accessibilityHint={canSwap ? 'Mostra trocas equivalentes' : undefined}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: canSwap ? c.primary : c.border }} />
        <AppText style={{ flex: 1 }}>{item.food.name}</AppText>
        <AppText variant="caption" muted>
          {item.household} · {item.grams} g
        </AppText>
        {canSwap ? <Icon name="chevron" size={16} color={c.textMuted} /> : null}
      </Pressable>
      {open && (
        <View style={{ marginLeft: 14, marginTop: 6, padding: 10, borderRadius: 12, backgroundColor: c.surfaceAlt, gap: 4 }}>
          <AppText variant="label" muted>
            OU TROQUE POR
          </AppText>
          {item.swaps.map((s) => (
            <AppText key={s.food.id} variant="caption">
              {s.food.name}: {s.household} ({s.grams} g)
            </AppText>
          ))}
        </View>
      )}
    </View>
  );
}
