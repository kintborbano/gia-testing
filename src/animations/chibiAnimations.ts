import type { CSSProperties } from 'react';
import { lerp, clamp, phaseProgress } from './interpolate';

export const SCROLL_RANGE = 600;

const PEEK_START = 0.3;
const PEEK_END = 0.7;
const STRAIGHTEN_END = 1.0;
const TUCK_END = 1.0;
const BUBBLE_FADE_END = 0.5;

// Phase 1 (0 → PEEK_START):  visible at ±5%, upright
// Phase 2 (PEEK_START → PEEK_END): slide to ±40%, tilt ±25deg — peek posture
// Phase 3 (PEEK_END → TUCK_END / STRAIGHTEN_END): slide fully off-screen (±100%), tilt back to 0

export function getLeftChibiStyle(t: number): CSSProperties {
  let tx, rot;

  if (t <= PEEK_START) {
    tx = -5;
    rot = 0;
  } else if (t <= PEEK_END) {
    const p = phaseProgress(t, PEEK_START, PEEK_END);
    tx = lerp(5, 40, p) * -1;
    rot = lerp(0, 25, p);
  } else {
    const p = phaseProgress(t, PEEK_END, STRAIGHTEN_END);
    tx = lerp(40, 100, p) * -1;
    rot = lerp(25, 0, p);
  }

  return {
    transform: `translateX(${tx}%) rotate(${rot}deg)`,
    willChange: 'transform',
    position: 'relative',
  };
}

export function getRightChibiStyle(t: number): CSSProperties {
  let tx, rot;

  if (t <= PEEK_START) {
    tx = 5;
    rot = 0;
  } else if (t <= PEEK_END) {
    const p = phaseProgress(t, PEEK_START, PEEK_END);
    tx = lerp(5, 40, p);
    rot = lerp(0, 25, p) * -1;
  } else {
    const p = phaseProgress(t, PEEK_END, TUCK_END);
    tx = lerp(40, 100, p);
    rot = lerp(25, 0, p) * -1;
  }

  return {
    transform: `translateX(${tx}%) rotate(${rot}deg)`,
    willChange: 'transform',
    position: 'relative',
  };
}

export function getSpeechBubbleOpacity(t: number): number {
  return clamp(
    t <= PEEK_START
      ? 1
      : lerp(1, 0, phaseProgress(t, PEEK_START, BUBBLE_FADE_END)),
    0,
    1
  );
}
