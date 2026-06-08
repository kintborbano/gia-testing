import { getLenisSnapshot } from '@/stores/lenisStore';

/**
 * Extra distance past a hash target to land on, in viewport heights, keyed by
 * the target element's id. Shared by the header's same-page clicks and the
 * landing page's on-arrival scroll (cross-page clicks land here after the
 * intro), so the nudge stays defined in one place.
 *
 * features-section is a ~260vh sticky scroll-scrub; landing at its very top
 * shows the unflattering first frame, so nudge past it by part of a viewport.
 *
 * The Action/How header palettes snap (fade: 0) exactly at each section's top.
 * A click that eases to rest right on that seam can settle a hair short, leaving
 * the sticky header on the previous (upward) section's color — it reads as the
 * header not matching the section. Land a sliver past the seam so the flip has
 * committed by the time the scroll stops.
 */
export const HASH_SCROLL_OFFSET_VH: Record<string, number> = {
  'features-section': 1.6,
  'bg-stop-action': 0.05,
  'bg-stop-how': 0.05,
};

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

  const offset = (HASH_SCROLL_OFFSET_VH[id] ?? 0) * window.innerHeight;
  const lenis = getLenisSnapshot();
  if (lenis) {
    lenis.scrollTo(target, { offset });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
  return true;
}
