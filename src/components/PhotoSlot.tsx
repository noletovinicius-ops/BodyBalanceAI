import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { pickPhoto } from '@/lib/photos';
import { radius, usePalette } from '@/theme';

import { Icon } from './Icon';
import { AppText } from './ui';

export function PhotoSlot({
  label,
  required,
  uri,
  onChange,
}: {
  label: string;
  required?: boolean;
  uri?: string;
  onChange: (uri: string | undefined) => void;
}) {
  const c = usePalette();
  const [busy, setBusy] = useState(false);

  async function choose(source: 'camera' | 'library') {
    try {
      setBusy(true);
      const result = await pickPhoto(source);
      if (result) onChange(result);
    } catch {
      const msg = 'Não foi possível acessar a câmera. Verifique a permissão nas configurações ou escolha da galeria.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Câmera indisponível', msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[styles.slot, { backgroundColor: c.surface, borderColor: uri ? c.primary : c.border }]}>
      <View style={[styles.preview, { backgroundColor: c.surfaceAlt }]}>
        {busy ? (
          <ActivityIndicator color={c.primary} />
        ) : uri ? (
          <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityLabel={`Foto: ${label}`} />
        ) : (
          <Icon name="camera" color={c.textMuted} size={28} />
        )}
      </View>
      <View style={{ flex: 1, gap: 8 }}>
        <View>
          <AppText variant="heading">{label}</AppText>
          <AppText variant="caption" muted>
            {required ? 'Obrigatória' : 'Opcional'}
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <SmallButton icon="camera" label="Câmera" onPress={() => choose('camera')} />
          <SmallButton icon="image" label="Galeria" onPress={() => choose('library')} />
          {uri && !required ? <SmallButton label="Remover" onPress={() => onChange(undefined)} /> : null}
        </View>
      </View>
    </View>
  );
}

function SmallButton({ icon, label, onPress }: { icon?: 'camera' | 'image'; label: string; onPress: () => void }) {
  const c = usePalette();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.small, { backgroundColor: c.surfaceAlt }]}>
      {icon ? <Icon name={icon} color={c.text} size={16} /> : null}
      <AppText variant="caption" style={{ fontWeight: '600' }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: { flexDirection: 'row', gap: 14, padding: 12, borderRadius: radius.md, borderWidth: 1.5, alignItems: 'center' },
  preview: { width: 76, height: 100, borderRadius: radius.sm, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  small: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill },
});
