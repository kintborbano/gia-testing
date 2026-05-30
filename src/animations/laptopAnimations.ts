import type { CSSProperties } from 'react';
import { lerp, clamp, phaseProgress } from './interpolate';

/** Offset (px) pointing from an object's resting position back to the
 *  center of the gia-on-laptop image, where it starts hidden. */
export interface FloatingObjectOrigin {
  x: number;
  y: number;
}

// Phase 1 (0 → SLIDE_END):             gia image slides in from -25vw to center
// Phase 2 (FLOATING_OBJECT_BASE → 1):  feature icons explode out from behind the
//                                      image to their resting positions, staggered

const SLIDE_END = 0.55;
const FLOATING_OBJECT_BASE = 0.5;
const FLOATING_OBJECT_STEP = 0.05;
const FLOATING_OBJECT_DURATION = 0.25;
const FLOATING_OBJECT_START_SCALE = 0.35;

/** Decelerating ease — fast burst out of the image, gentle settle into place. */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/** Sitting chibi: slides in from +25vw to its final resting position. */
export function getSittingChibiStyle(t2: number): CSSProperties {
  const slideT = phaseProgress(t2, 0, SLIDE_END);
  const tx = lerp(25, 0, slideT);
  return { transform: `translateX(${tx}vw)`, willChange: 'transform' };
}

/** Peek chibi: placeholder for a chibi that peeks from behind the laptop. */
export function getPeekChibiStyle(t2: number): CSSProperties {
  const p = phaseProgress(t2, 0, SLIDE_END);
  return { transform: `translateY(${lerp(20, 0, p)}px)`, opacity: p };
}

/** Laptop / center illustration: slides in from -25vw to its final resting position. */
export function getLaptopStyle(t2: number): CSSProperties {
  const slideT = phaseProgress(t2, 0, SLIDE_END);
  const tx = lerp(-25, 0, slideT);
  return { transform: `translateX(${tx}vw)`, willChange: 'transform' };
}

/**
 * Staggered floating object: starts collapsed at the center of the gia image
 * (translated by `origin`, scaled down, hidden) and explodes out to its resting
 * position (transform 0, full scale) as scroll progresses. Fully reversible.
 */
export function getFloatingObjectStyle(
  t2: number,
  index: number,
  origin: FloatingObjectOrigin
): CSSProperties {
  const objectStart = FLOATING_OBJECT_BASE + index * FLOATING_OBJECT_STEP;
  const progress = clamp((t2 - objectStart) / FLOATING_OBJECT_DURATION, 0, 1);
  const eased = easeOutCubic(progress);

  const tx = lerp(origin.x, 0, eased);
  const ty = lerp(origin.y, 0, eased);
  const scale = lerp(FLOATING_OBJECT_START_SCALE, 1, eased);

  return {
    // Fade in quickly so icons appear as they clear the image edges.
    opacity: clamp(progress / 0.35, 0, 1),
    transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
    willChange: 'transform, opacity',
  };
}
