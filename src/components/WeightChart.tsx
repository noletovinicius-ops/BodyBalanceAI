import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import type { CheckIn } from '@/store/useAppStore';
import { usePalette } from '@/theme';

import { AppText } from './ui';
import { kg } from '@/lib/format';

export function WeightChart({ checkIns, target }: { checkIns: CheckIn[]; target: number }) {
  const c = usePalette();
  const [width, setWidth] = useState(300);
  const height = 140;
  const pad = 10;
  const values = checkIns.map((x) => x.weightKg);
  const min = Math.min(...values, target) - 1;
  const max = Math.max(...values, target) + 1;
  const x = (i: number) => pad + (checkIns.length === 1 ? (width - 2 * pad) / 2 : (i * (width - 2 * pad)) / (checkIns.length - 1));
  const y = (v: number) => pad + ((max - v) * (height - 2 * pad)) / (max - min);

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessibilityLabel={`Gráfico de peso: ${checkIns.length} registros`}>
      <Svg width={width} height={height}>
        <Line x1={pad} x2={width - pad} y1={y(target)} y2={y(target)} stroke={c.accent} strokeDasharray="4 6" strokeWidth={1.5} />
        <Polyline points={checkIns.map((p, i) => `${x(i)},${y(p.weightKg)}`).join(' ')} stroke={c.primary} strokeWidth={2.5} fill="none" strokeLinejoin="round" />
        {checkIns.map((p, i) => (
          <Circle key={p.date} cx={x(i)} cy={y(p.weightKg)} r={4} fill={c.surface} stroke={c.primary} strokeWidth={2} />
        ))}
      </Svg>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText variant="caption" muted>
          {new Date(checkIns[0].date + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </AppText>
        <AppText variant="caption" color={c.accent}>
          - - meta {kg(target)}
        </AppText>
      </View>
    </View>
  );
}
