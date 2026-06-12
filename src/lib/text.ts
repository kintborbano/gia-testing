// Gemini occasionally drifts from the prompted schema and returns arrays or
// objects where a string was asked for (the backend hardens its PDF the same
// way — see bbd2048). Flatten anything text-like into a plain string.
export function toText(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(' ');
  if (typeof v === 'object')
    return Object.values(v as Record<string, unknown>)
      .map(toText)
      .filter(Boolean)
      .join(' — ');
  return String(v);
}

// Gemini bullet copy arrives as '• point one\n• point two' (or as an array of
// such strings) — split into list items. **emphasis** markers stay in for
// <Emphasis> to render.
export function splitBullets(s: unknown): string[] {
  if (Array.isArray(s)) return s.flatMap(splitBullets);
  return toText(s)
    .split('•')
    .map((b) => b.trim())
    .filter(Boolean);
}
