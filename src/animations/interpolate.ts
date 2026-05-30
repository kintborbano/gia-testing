export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/** Map t within [t0, t1] to [v0, v1], clamped. */
export function mapRange(
  t: number,
  t0: number,
  t1: number,
  v0: number,
  v1: number
): number {
  const p = clamp((t - t0) / (t1 - t0), 0, 1);
  return v0 + p * (v1 - v0);
}

/** Returns 0→1 progress within [phaseStart, phaseEnd], 0 outside it. */
export function phaseProgress(
  t: number,
  phaseStart: number,
  phaseEnd: number
): number {
  return clamp((t - phaseStart) / (phaseEnd - phaseStart), 0, 1);
}
