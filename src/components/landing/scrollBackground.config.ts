/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SCROLL BACKGROUND CONFIG
 * ─────────────────────────────────────────────────────────────────────────
 *  This is the single place to control the page's scroll-driven background.
 *  Edit the values here — you should never need to touch ScrollBackground.tsx.
 *
 *  HOW IT WORKS, IN ONE SENTENCE:
 *  As you scroll, the background fills the screen with one color and smoothly
 *  fades to the next color as you pass between two "stops" below.
 *
 *  Each STOP ties a section on the page (by its `anchorId`) to a `color`.
 *  Tweak the three optional knobs — `align`, `offsetVh`, `fade` — to control
 *  WHERE a color triggers and HOW FAST it fades in.
 * ─────────────────────────────────────────────────────────────────────────
 */

/**
 * Named color palette. Add or rename colors here, then reference the key in a
 * stop's `color` field. A stop's `color` can also be a raw hex string directly
 * (e.g. '#ffcc00') if you don't want to name it.
 */
export const COLORS = {
  white: '#ffffff',
  cream: '#fef7dd',
  maroon: '#8c1f2e',
} as const;

export type ColorName = keyof typeof COLORS;

export type ScrollStop = {
  /**
   * The `id` of the DOM element that triggers this color. The color is fully
   * "arrived" when this element lines up with the screen (see `align`).
   * Must match an `id="..."` on a section in the page.
   */
  anchorId: string;

  /** Palette key (e.g. 'cream') or a raw hex string (e.g. '#ffcc00'). */
  color: ColorName | (string & {});

  /**
   * FOREGROUND color the header adopts over this stop — its nav text, menu
   * icon, and the GIA logo all tint to this. Like `color`, it lerps between
   * stops, so the header's contents fade in step with the background instead
   * of snapping. Palette key or raw hex. Defaults to maroon (`DEFAULT_FOREGROUND`).
   *
   * Pick a color with enough CONTRAST against this stop's `color` to stay
   * legible — foreground should oppose the background, not match it. On a dark
   * section, set this to a light color (e.g. 'white' or 'cream').
   */
  foreground?: ColorName | (string & {});

  /**
   * WHERE on the anchor element the trigger point sits, 0–1:
   *   0   = top of the element
   *   0.5 = middle of the element   (default)
   *   1   = bottom of the element
   * The color is "fully arrived" when this point reaches the middle of the
   * screen. Lower = the color arrives earlier as you scroll down.
   */
  align?: number;

  /**
   * Extra nudge to the trigger point, measured in screen-heights (vh).
   *   negative = color arrives EARLIER (higher up the page)
   *   positive = color arrives LATER  (further down the page)
   * e.g. -0.25 triggers a quarter-screen sooner.
   */
  offsetVh?: number;

  /**
   * SPEED of the fade INTO this color, as a fraction (0–1) of the gap from the
   * previous stop:
   *   1   = fade gradually across the whole gap (default, slowest/smoothest)
   *   0.3 = hold the previous color, then fade quickly over the last 30%
   *   0   = instant snap, no fade
   * Smaller = snappier/faster transition that happens later.
   */
  fade?: number;
};

/**
 * The stops, IN PAGE ORDER (top to bottom). Reorder, add, or remove freely.
 *
 *  - To change a section's color: edit its `color`.
 *  - To move where a color kicks in: add `align` and/or `offsetVh`.
 *  - To change fade speed: add `fade`.
 *
 * NOTE: every `anchorId` must exist on the page. A stop whose element isn't
 * rendered is skipped, which can cause the surrounding fade to snap — so only
 * list sections that are actually mounted.
 */
export const STOPS: ScrollStop[] = [
  { anchorId: 'bg-stop-hero', color: 'white' },
  { anchorId: 'features-section', color: 'cream' },
  // The Action and How sections paint their OWN dark backgrounds, so the header
  // matches them here. `align: 0` + `offsetVh: 0.5` ties "fully arrived" to the
  // moment the section's top reaches the header (top of viewport); the small
  // `fade` makes the header flip crisply at that seam instead of bleeding the
  // dark color up over the lighter section above it.
  {
    anchorId: 'bg-stop-action',
    color: 'maroon',
    foreground: 'white',
    align: 0,
    offsetVh: 0.5,
    fade: 0,
  },
  {
    anchorId: 'bg-stop-how',
    color: '#000000',
    foreground: 'cream',
    align: 0,
    offsetVh: 0.5,
    fade: 0,
  },
  // Back to the light page background — flip from black to white as the CTA's
  // top reaches the header, using the same crisp-seam tuning.
  {
    anchorId: 'bg-stop-cta',
    color: 'white',
    align: 0,
    offsetVh: 0.5,
    fade: 0,
  },
  { anchorId: 'bg-stop-footer', color: 'white' },
];

/** Default trigger alignment when a stop doesn't set its own `align`. */
export const DEFAULT_ALIGN = 0.5;

/**
 * Default fade fraction when a stop doesn't set its own `fade`.
 * `0` = instant snap (no blend) — the background and header flip to the new
 * color at the seam instead of fading gradually. Raise toward `1` to bring back
 * a smooth cross-fade.
 */
export const DEFAULT_FADE = 0;

/**
 * Default header foreground (brand maroon) when a stop doesn't set its own
 * `foreground`. Every current stop is a light background, so this keeps the
 * header's text and logo in maroon throughout — change a stop's `foreground`
 * the moment you introduce a darker section.
 */
export const DEFAULT_FOREGROUND = 'maroon';
