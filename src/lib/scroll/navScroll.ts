import { getLenisSnapshot } from '@/stores/lenisStore';

/**
 * Extra distance past a hash target to land on, in viewport heights, keyed by
 * the target element's id. Shared by the header's same-page clicks and the
 * landing page's on-arrival scroll (cross-page clicks land here after the
 * intro), so the nudge stays defined in one place.
 *
 * features-section is a ~260vh sticky scroll-scrub; landing at its very top
 * shows the unflattering first frame, so nudge past it by part of a viewport.
 */
export const HASH_SCROLL_OFFSET_VH: Record<string, number> = {
  'features-section': 1.6,
};

/**
 * Eased scroll to the top of the page via Lenis (falls back to native smooth
 * scroll when Lenis isn't mounted). Used by the header logo when already on the
 * landing page, where a `<Link href="/">` click is a no-op.
 */
export function scrollToTop(): void {
  const lenis = getLenisSnapshot();
  if (lenis) {
    lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
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
