import { lerp, clamp } from './interpolate';
import { BRAND } from '@/styles/palette';

const SCROLL_RANGE = 120;
export const HEADER_HEIGHT_LARGE = 112;
const HEIGHT_SMALL = 80;

const COLOR_HERO = BRAND.white;
const COLOR_FEATURES = BRAND.cream;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const FROM_RGB = hexToRgb(COLOR_HERO);
const TO_RGB = hexToRgb(COLOR_FEATURES);

export { SCROLL_RANGE };

export function getHeaderHeight(t: number): number {
  return lerp(HEADER_HEIGHT_LARGE, HEIGHT_SMALL, clamp(t, 0, 1));
}

export function getHeaderBackground(t: number): string {
  const tc = clamp(t * 2.5, 0, 1);
  const r = Math.round(lerp(FROM_RGB[0], TO_RGB[0], tc));
  const g = Math.round(lerp(FROM_RGB[1], TO_RGB[1], tc));
  const b = Math.round(lerp(FROM_RGB[2], TO_RGB[2], tc));
  return `rgb(${r},${g},${b})`;
}

export function getHeaderBorderOpacity(t: number): number {
  return clamp(t, 0, 1);
}
