/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SCROLL BACKGROUND CONFIG
 * ─────────────────────────────────────────────────────────────────────────
 *  This drives TWO things as you scroll, from one list of stops:
 *
 *   1. THE STICKY HEADER's palette — its background + text/logo color adopt
 *      each section's `color` / `foreground` so it melts into the section it
 *      sits over. This uses EVERY stop below.
 *
 *   2. THE REAL PAGE BACKGROUND — the fixed fill behind the whole page. This
 *      only paints the FIRST transition (hero → features); past the features
 *      section it simply holds cream. Every later section paints its own
 *      background, so the page background never needs to go maroon/black/etc.
 *
 *  In short: `color` is the HEADER's background per section; only the hero and
 *  features stops also paint the real page background. See ScrollBackground.tsx
 *  (`PAINTS_REAL_BG`) for where that split is applied.
 *
 *  Each STOP ties a section on the page (by its `anchorId`) to a `color`.
 *  Tweak the optional knobs — `align`, `offsetVh`, `fade` — to control WHERE a
 *  color triggers and HOW FAST it fades in.
 * ─────────────────────────────────────────────────────────────────────────
 */

/**
 * Named color palette. Add or rename colors here, then reference the key in a
 * stop's `color` field. A stop's `color` can also be a raw hex string directly
 * (e.g. '#ffcc00') if you don't want to name it.
 */
import { BRAND } from '@/styles/palette';

export const COLORS = {
  white: BRAND.white,
  cream: BRAND.cream,
  maroon: BRAND.primary,
} as const;

export type ColorName = keyof typeof COLORS;

export type ScrollStop = {
  /**
   * The `id` of the DOM element that triggers this color. The color is fully
   * "arrived" when this element lines up with the screen (see `align`).
   * Must match an `id="..."` on a section in the page.
   */
  anchorId: string;

  /**
   * The HEADER background over this section (palette key or raw hex). The hero
   * and features stops additionally paint this as the real page background; for
   * every later stop this only tints the sticky header.
   */
  color: ColorName | (string & {});

  /**
   * FOREGROUND color the header adopts over this stop — its nav text, menu
   * icon, and the GIA logo all tint to this. Palette key or raw hex. Defaults
   * to maroon (`DEFAULT_FOREGROUND`). Pick a color with enough CONTRAST against
   * this stop's `color` to stay legible — on a dark section, set this to a
   * light color (e.g. 'white' or 'cream').
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
   * The dark-section stops use `0` so the header flips crisply at the seam; the
   * features stop fades gradually so the real white→cream page background eases
   * in instead of snapping.
   */
  fade?: number;
};

/**
 * The stops, IN PAGE ORDER (top to bottom).
 *
 * NOTE: every `anchorId` must exist on the page. A stop whose element isn't
 * rendered is skipped, which can cause the surrounding fade to snap — so only
 * list sections that are actually mounted.
 */
export const STOPS: ScrollStop[] = [
  // ─ Painted as the REAL page background ─────────────────────────────────
  { anchorId: 'bg-stop-hero', color: 'white' },
  // White → cream as you cross from the hero into the features section. The
  // features section is min-h-[260vh] (a sticky scroll-scrub), so the default
  // `align: 0.5` would put "fully cream" deep in its MIDDLE and smear the blend
  // across the whole hero. Anchor the trigger to the section TOP and use a
  // gradual `fade` so the cream holds white through most of the hero, then
  // eases in over the ~half-screen approach to the seam.
  {
    anchorId: 'features-section',
    color: 'cream',
    align: 0,
    offsetVh: 0.5,
    fade: 0.55,
  },

  // ─ Header palette only (real page background holds cream below here) ────
  // The Action and How sections paint their OWN dark backgrounds; the header
  // matches them by flipping its palette crisply at each seam (`fade: 0`).
  // `align: 0` + `offsetVh: 0.5` ties the flip to the moment the section's top
  // reaches the header (top of viewport).
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
  // Back to a light header — flips from black to white as the CTA's top reaches
  // the header.
  {
    anchorId: 'bg-stop-cta',
    color: 'white',
    align: 0,
    offsetVh: 0.5,
    fade: 0,
  },
  { anchorId: 'bg-stop-footer', color: 'white' },
];

/**
 * How many leading stops paint the REAL page background. Stops beyond this only
 * retint the sticky header — the page background holds the last painted color
 * (cream). Currently the hero (white) and features (cream) stops.
 */
export const REAL_BG_STOP_COUNT = 2;

/** Default trigger alignment when a stop doesn't set its own `align`. */
export const DEFAULT_ALIGN = 0.5;

/**
 * Default fade fraction when a stop doesn't set its own `fade`.
 * `1` = a smooth cross-fade across the whole gap between stops. Lower toward
 * `0` to snap instead.
 */
export const DEFAULT_FADE = 1;

/**
 * Default header foreground (brand maroon) when a stop doesn't set its own
 * `foreground`. Keeps the header's text and logo maroon over light sections.
 */
export const DEFAULT_FOREGROUND = 'maroon';
