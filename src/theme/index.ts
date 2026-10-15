import { useColorScheme } from 'react-native';

const light = {
  background: '#F7F3EE',
  surface: '#FFFFFF',
  surfaceAlt: '#EFE8DF',
  border: '#E4DCD1',
  text: '#2F3A34',
  textMuted: '#6E7A72',
  primary: '#5E8A6E',
  primarySoft: '#DCE8DF',
  onPrimary: '#FFFFFF',
  accent: '#C9836A',
  accentSoft: '#F4E1D8',
  warning: '#C08A3E',
  danger: '#B85C50',
  silhouette: '#CBBFB0',
};

export type Palette = typeof light;

const dark: Palette = {
  background: '#141815',
  surface: '#1C211D',
  surfaceAlt: '#252B26',
  border: '#323A34',
  text: '#ECEFEA',
  textMuted: '#A1ACA4',
  primary: '#8FB89C',
  primarySoft: '#2A3A2F',
  onPrimary: '#10170F',
  accent: '#E0A68E',
  accentSoft: '#3D2C25',
  warning: '#DDB06A',
  danger: '#E08A7E',
  silhouette: '#4A524C',
};

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}

export const fonts = {
  display: 'Fraunces_600SemiBold',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;
export const MAX_WIDTH = 560;
