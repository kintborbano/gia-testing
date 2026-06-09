import { getLenisSnapshot } from '@/stores/lenisStore';

/**
 * Extra distance past a hash target to land on, in viewport heights, keyed by
 * the target element's id. Shared by the header's same-page clicks and the
 * landing page's on-arrival scroll (cross-page clicks land here after the
 * intro), so the nudge stays defined in one place.
 *
 * The Action/How header palettes snap (fade: 0) exactly at each section's top.
 * A click that eases to rest right on that seam can settle a hair short, leaving
 * the sticky header on the previous (upward) section's color — it reads as the
 * header not matching the section. Land a sliver past the seam so the flip has
 * committed by the time the scroll stops.
 */
export const HASH_SCROLL_OFFSET_VH: Record<string, number> = {
  'bg-stop-action': 0.05,
  'bg-stop-how': 0.05,
};

// features-section only renders as the ~260vh sticky scroll-scrub at >= 768px;
// below that, Features.tsx (via `useMediaQuery('(min-width: 768px)')`) swaps to
// a short, static feature grid. The nudge exists to skip the scrub's unflattering
// first frame and land on the exploded scene — meaningful ONLY for the sticky
// version. Applied to the short mobile section it overshoots: on smaller phones
// it lands deep at the bottom headline, and on taller ones it sails clear past
// the whole section into the next one. So gate it on the same breakpoint the
// layout uses, collapsing to 0 (land at the section top, showing the grid).
const FEATURES_STICKY_MIN_WIDTH = 768;
const FEATURES_STICKY_OFFSET_VH = 1.6;

/**
 * Resolve the land-past offset (in viewport heights) for a hash target id,
 * accounting for layouts that only exist above a breakpoint. Static table
 * lookups go through the same path so callers never read the map directly.
 */
function getHashScrollOffsetVh(id: string): number {
  if (id === 'features-section') {
    const sticky =
      typeof window !== 'undefined' &&
      window.matchMedia(`(min-width: ${FEATURES_STICKY_MIN_WIDTH}px)`).matches;
    return sticky ? FEATURES_STICKY_OFFSET_VH : 0;
  }
  return HASH_SCROLL_OFFSET_VH[id] ?? 0;
}

/**
 * Eased scroll to a same-page hash target via Lenis (falls back to native
 * smooth scroll when Lenis isn't mounted, e.g. on the sub-pages). Returns
 * false when the target isn't in the current document.
 */
export function scrollToHashTarget(hash: string): boolean {
  const id = hash.replace(/^#/, '');
  if (!id) return false;

  const target = document.getElementById(id);
  if (!target) return false;

  const offset = getHashScrollOffsetVh(id) * window.innerHeight;
  const lenis = getLenisSnapshot();
  if (lenis) {
    lenis.scrollTo(target, { offset });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
  return true;
}
