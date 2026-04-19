import { Color } from './types';

export function colorFromString(str: string): Color {
  const colors = Object.values(Color);
  const hash = [...str].reduce(
    (acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0,
    0,
  );
  return colors[Math.abs(hash) % colors.length];
}
