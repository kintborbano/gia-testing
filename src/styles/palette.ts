/**
 * Brand color palette for JavaScript contexts — canvas painting, scroll-driven
 * color interpolation, and other places where a real hex value is needed and a
 * CSS custom property can't be read.
 *
 * These MIRROR the `--brand-*` / `--text` tokens in `src/styles/globals.css`.
 * That file is the source of truth for styling via `className`; this file exists
 * only because color math in JS can't reference CSS variables. Keep the two in
 * sync — a rebrand updates both.
 */
export const BRAND = {
  white: '#ffffff',
  primary: '#8c1f2e',
  primaryDark: '#751a26',
  secondary: '#eed03a',
  cream: '#fef7dd',
  gold: '#c2992e',
  goldShadow: '#8a6a1c',
  text: '#1a1208',
} as const;

/** Mirrors the `--color-verdict-*` tokens in globals.css — same sync rule. */
export const VERDICT = {
  strong: '#8c1f2e',
  strongDeep: '#751a26',
  strongSoft: '#f6dfe2',
  mixed: '#c2992e',
  mixedDeep: '#8a6a1c',
  mixedSoft: '#f6edd0',
  weak: '#c4a5a9',
  weakDeep: '#82595f',
  weakSoft: '#f1e9e7',
} as const;
