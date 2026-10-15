import Svg, { Circle, Path } from 'react-native-svg';

export type IconName = 'home' | 'leaf' | 'dumbbell' | 'chart' | 'settings' | 'camera' | 'image' | 'check' | 'back' | 'chevron' | 'info' | 'water' | 'steps';

/** Ícones de traço simples (24×24), desenhados para combinar com a tipografia. */
const PATHS: Record<IconName, string[]> = {
  home: ['M4 11l8-7 8 7', 'M6 10v9h12v-9', 'M10 19v-5h4v5'],
  leaf: ['M5 19c0-8 5-13 14-14 0 9-5 14-13 14', 'M5 19l7-7'],
  dumbbell: ['M3 9v6', 'M6 6v12', 'M18 6v12', 'M21 9v6', 'M6 12h12'],
  chart: ['M4 20h16', 'M6 16l4-5 3 3 5-7'],
  settings: ['M4 7h10', 'M18 7h2', 'M4 17h4', 'M12 17h8'],
  camera: ['M4 8h3l2-3h6l2 3h3v11H4z'],
  image: ['M4 5h16v14H4z', 'M4 16l5-5 4 4 3-3 4 4'],
  check: ['M5 12l5 5 9-10'],
  back: ['M15 5l-7 7 7 7'],
  chevron: ['M9 5l7 7-7 7'],
  info: ['M12 11v6', 'M12 7.5v.5'],
  water: ['M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z'],
  steps: ['M8 4c2 0 3 2 3 5s-1 5-3 5-3-2-3-5 1-5 3-5z', 'M16 10c2 0 3 2 3 5s-1 5-3 5-3-2-3-5 1-5 3-5z'],
};

const CIRCLES: Partial<Record<IconName, [number, number, number][]>> = {
  settings: [[16, 7, 2], [10, 17, 2]],
  camera: [[12, 13, 3.5]],
  image: [[9, 9, 1.5]],
  info: [[12, 12, 9]],
};

export function Icon({ name, size = 24, color, strokeWidth = 1.8 }: { name: IconName; size?: number; color: string; strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {PATHS[name].map((d) => (
        <Path key={d} d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {CIRCLES[name]?.map(([cx, cy, r]) => (
        <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} stroke={color} strokeWidth={strokeWidth} />
      ))}
    </Svg>
  );
}
