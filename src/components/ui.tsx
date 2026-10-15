import { useState, type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fonts, MAX_WIDTH, radius, space, usePalette } from '@/theme';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'caption' | 'label';

const VARIANTS: Record<Variant, TextStyle> = {
  display: { fontFamily: fonts.display, fontSize: 34, lineHeight: 40 },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 32 },
  heading: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
};

export function AppText({
  variant = 'body',
  muted,
  color,
  style,
  ...rest
}: TextProps & { variant?: Variant; muted?: boolean; color?: string }) {
  const c = usePalette();
  return <Text {...rest} style={[VARIANTS[variant], { color: color ?? (muted ? c.textMuted : c.text) }, style]} />;
}

export function Screen({
  children,
  footer,
  scroll = true,
}: {
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
}) {
  const c = usePalette();
  const body = <View style={styles.inner}>{children}</View>;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {body}
        </ScrollView>
      ) : (
        body
      )}
      {footer && (
        <SafeAreaView edges={['bottom']} style={[styles.footer, { borderTopColor: c.border, backgroundColor: c.background }]}>
          <View style={styles.footerInner}>{footer}</View>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}

export function Card({ children, style, tone = 'surface' }: { children: ReactNode; style?: StyleProp<ViewStyle>; tone?: 'surface' | 'soft' | 'accent' }) {
  const c = usePalette();
  const bg = tone === 'soft' ? c.primarySoft : tone === 'accent' ? c.accentSoft : c.surface;
  return <View style={[styles.card, { backgroundColor: bg, borderColor: tone === 'surface' ? c.border : 'transparent' }, style]}>{children}</View>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const c = usePalette();
  const bg = { primary: c.primary, secondary: c.surfaceAlt, ghost: 'transparent', danger: 'transparent' }[variant];
  const fg = { primary: c.onPrimary, secondary: c.text, ghost: c.primary, danger: c.danger }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.45 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        variant === 'danger' && { borderWidth: 1, borderColor: c.danger },
        style,
      ]}>
      <AppText variant="heading" color={fg} style={{ fontSize: 16 }}>
        {title}
      </AppText>
    </Pressable>
  );
}

export function OptionCard({
  title,
  description,
  selected,
  onPress,
  left,
  right,
  disabled,
}: {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  left?: ReactNode;
  right?: ReactNode;
  disabled?: boolean;
}) {
  const c = usePalette();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: selected ? c.primarySoft : c.surface,
          borderColor: selected ? c.primary : c.border,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
      ]}>
      {left}
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="heading">{title}</AppText>
        {description ? <AppText variant="caption" muted>{description}</AppText> : null}
      </View>
      {right}
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const c = usePalette();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.chip, { backgroundColor: selected ? c.primary : c.surface, borderColor: selected ? c.primary : c.border }]}>
      <AppText variant="body" color={selected ? c.onPrimary : c.text} style={{ fontFamily: fonts.medium }}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function NumberField({
  label,
  unit,
  value,
  onChange,
  hint,
  error,
}: {
  label: string;
  unit: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  hint?: string;
  error?: string;
}) {
  const c = usePalette();
  // Texto local para permitir digitar vírgula decimal ("70,").
  const [text, setText] = useState(value === undefined ? '' : String(value).replace('.', ','));
  return (
    <View style={{ gap: 6 }}>
      <AppText variant="label" muted>
        {label.toUpperCase()}
      </AppText>
      <View style={[styles.field, { backgroundColor: c.surface, borderColor: error ? c.danger : c.border }]}>
        <TextInput
          accessibilityLabel={label}
          keyboardType="decimal-pad"
          inputMode="decimal"
          value={text}
          onChangeText={(t) => {
            setText(t);
            const clean = t.replace(',', '.').replace(/[^0-9.]/g, '');
            const n = parseFloat(clean);
            onChange(clean === '' || Number.isNaN(n) ? undefined : n);
          }}
          placeholderTextColor={c.textMuted}
          placeholder="0"
          style={[styles.input, { color: c.text }]}
        />
        <AppText muted>{unit}</AppText>
      </View>
      {error ? (
        <AppText variant="caption" color={c.danger}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" muted>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <AppText variant="label" muted>
        {label.toUpperCase()}
      </AppText>
      <AppText variant="title" style={{ fontSize: 22, lineHeight: 28 }}>
        {value}
      </AppText>
      {sub ? <AppText variant="caption" muted>{sub}</AppText> : null}
    </View>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <AppText variant="label" muted style={{ marginTop: space.md }}>
      {typeof children === 'string' ? children.toUpperCase() : children}
    </AppText>
  );
}

export function ProgressBar({ value, color, height = 8 }: { value: number; color?: string; height?: number }) {
  const c = usePalette();
  return (
    <View style={{ height, borderRadius: height, backgroundColor: c.surfaceAlt, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: '100%', backgroundColor: color ?? c.primary, borderRadius: height }} />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, alignItems: 'center' },
  inner: { width: '100%', maxWidth: MAX_WIDTH, padding: space.xl, paddingBottom: space.xxl, gap: space.lg, flexGrow: 1 },
  footer: { borderTopWidth: StyleSheet.hairlineWidth, alignItems: 'center' },
  footerInner: { width: '100%', maxWidth: MAX_WIDTH, paddingHorizontal: space.xl, paddingVertical: space.md, gap: space.sm },
  card: { borderRadius: radius.lg, borderWidth: 1, padding: space.lg, gap: space.md },
  button: { minHeight: 52, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl },
  option: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.md, borderWidth: 1.5 },
  chip: { paddingHorizontal: space.lg, paddingVertical: 10, borderRadius: radius.pill, borderWidth: 1 },
  field: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius.md, paddingHorizontal: space.lg, minHeight: 52, gap: space.sm },
  input: { flex: 1, fontFamily: fonts.medium, fontSize: 18, paddingVertical: 12 },
});
