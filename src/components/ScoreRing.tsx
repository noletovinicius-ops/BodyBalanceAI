import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import type { ScoreLevel } from '@/engine';
import { usePalette } from '@/theme';

import { AppText } from './ui';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ScoreRing({ value, level, size = 180, label = 'Score' }: { value: number; level: ScoreLevel; size?: number; label?: string }) {
  const c = usePalette();
  const stroke = size * 0.07;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = useSharedValue(0);
  const color = { excellent: c.primary, good: c.primary, attention: c.warning, priority: c.accent }[level];

  useEffect(() => {
    progress.value = withTiming(value / 100, { duration: 1100, easing: Easing.out(Easing.cubic) });
  }, [value, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel={`${label}: ${value} de 100`}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={c.surfaceAlt} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
        />
      </Svg>
      <AppText variant="display" style={{ fontSize: size * 0.28, lineHeight: size * 0.32 }}>
        {value}
      </AppText>
      <AppText variant="label" muted>
        {label.toUpperCase()}
      </AppText>
    </View>
  );
}
