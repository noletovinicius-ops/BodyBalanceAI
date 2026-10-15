import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import type { Sex } from '@/engine';
import { radius, usePalette } from '@/theme';

import { AppText } from './ui';

type Pt = [number, number];

/** Curva suave (Catmull-Rom → Bézier) passando pelos pontos. */
function smooth(points: Pt[]) {
  let d = '';
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const [p1, p2] = [points[i], points[i + 1]];
    const p3 = points[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/**
 * Silhueta frontal paramétrica (níveis 1–9), inspirada na escala de figuras de
 * Stunkard, desenhada do zero para o app.
 */
export function silhouetteShape(sex: Sex, level: number) {
  const l = level - 1;
  const f = sex === 'female';
  const w = {
    neck: 4.5 + l * 0.4,
    shoulder: (f ? 15 : 18) + l * 1.2,
    chest: (f ? 13 : 16) + l * 2,
    waist: (f ? 9.5 : 13) + l * 2.9,
    hip: (f ? 15 : 14) + l * 2.5,
    knee: 8.5 + l * 1.3,
    ankle: 5.5 + l * 0.5,
    gap: 1.2 + l * 0.15,
  };
  const cx = 50;
  // Contorno externo do lado direito, do pescoço ao tornozelo.
  const outer: Pt[] = [
    [w.neck, 31],
    [w.neck + 1, 37],
    [w.shoulder, 44],
    [w.chest, 62],
    [w.waist, 88],
    [w.hip, 108],
    [w.hip - 1, 126],
    [w.knee, 166],
    [w.ankle, 206],
  ];
  const right = outer.map(([x, y]): Pt => [cx + x, y]);
  const left = outer.map(([x, y]): Pt => [cx - x, y]).reverse();
  const crotchY = 124 - l * 0.6;
  const body =
    `M${left[0][0]},${left[0][1]}` +
    smooth(left) +
    ` L${cx - w.gap},208 L${cx - w.gap},${crotchY + 4} Q${cx},${crotchY - 2} ${cx + w.gap},${crotchY + 4} L${cx + w.gap},208 L${right[right.length - 1][0]},${right[right.length - 1][1]}` +
    smooth([...right].reverse()) +
    ' Z';
  const torso = Math.max(w.chest, w.waist, w.hip - 2);
  const armW = 5.5 + l * 1;
  const arms = [-1, 1].map((s) => ({
    x1: cx + s * (w.shoulder - armW / 3),
    y1: 47,
    x2: cx + s * (torso + armW / 2 + 1.5),
    y2: 116,
    width: armW,
  }));
  return { body, arms, head: { cx, cy: 18, r: 10.5 + l * 0.3 } };
}

export function Silhouette({ sex, level, color, height = 110 }: { sex: Sex; level: number; color: string; height?: number }) {
  const s = silhouetteShape(sex, level);
  return (
    <Svg width={height * (100 / 215)} height={height} viewBox="0 0 100 215">
      {s.arms.map((a, i) => (
        <Line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke={color} strokeWidth={a.width} strokeLinecap="round" />
      ))}
      <Path d={s.body} fill={color} />
      <Circle cx={s.head.cx} cy={s.head.cy} r={s.head.r} fill={color} />
    </Svg>
  );
}

export function SilhouettePicker({ sex, value, onChange }: { sex: Sex; value?: number; onChange: (v: number) => void }) {
  const c = usePalette();
  return (
    <View style={styles.grid}>
      {Array.from({ length: 9 }, (_, i) => i + 1).map((level) => {
        const selected = value === level;
        return (
          <Pressable
            key={level}
            accessibilityRole="radio"
            accessibilityLabel={`Silhueta ${level}`}
            accessibilityState={{ selected }}
            onPress={() => onChange(level)}
            style={[styles.cell, { backgroundColor: selected ? c.primarySoft : c.surface, borderColor: selected ? c.primary : c.border }]}>
            <Silhouette sex={sex} level={level} color={selected ? c.primary : c.silhouette} height={112} />
            <AppText variant="label" color={selected ? c.primary : c.textMuted}>
              {level}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  cell: { width: '31%', alignItems: 'center', paddingVertical: 12, borderRadius: radius.md, borderWidth: 1.5, gap: 6 },
});
