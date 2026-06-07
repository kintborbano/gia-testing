import type Lenis from 'lenis';
import { getLenisSnapshot, subscribeToLenis } from '@/stores/lenisStore';

// One scroll loop for the whole page. Every scroll-driven effect (background,
// header, feature explode, canvas scrubs, card reveals) subscribes here instead
// of attaching its own `window` scroll listener + rAF. Benefits:
//   - a single listener + single rAF per frame (was ~13 independent ones)
//   - all subscribers run back-to-back in one pass, so layout reads batch
//     together (no read/write thrash between unrelated effects)
//   - when Lenis is driving, we run on its 'scroll' event so canvases/colors
//     update on the SAME frame as the smooth-scrolled position (no 1-frame lag)
//
// Subscribers receive the current `window.scrollY`. Lenis runs in native mode,
// so `window.scrollY` already reflects the smoothed position.

type ScrollSubscriber = (scrollY: number) => void;

const subscribers = new Set<ScrollSubscriber>();

let rafId: number | null = null;
let started = false;
let currentLenis: Lenis | null = null;
let unsubLenisStore: (() => void) | null = null;

function emit(): void {
  rafId = null;
  const y = window.scrollY;
  // Copy first — a subscriber may unsubscribe (or subscribe) during the pass.
  for (const cb of [...subscribers]) cb(y);
}

// Native scroll / resize: coalesce bursts onto one rAF so we emit at most once
// per frame.
function scheduleEmit(): void {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(emit);
}

// Lenis already fires this inside its own rAF, so run synchronously to stay on
// the same frame as the scroll position. Cancel any pending native-scroll rAF
// so we don't double-emit.
function onLenisScroll(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  emit();
}

function attachLenis(lenis: Lenis | null): void {
  if (lenis === currentLenis) return;
  currentLenis?.off('scroll', onLenisScroll);
  currentLenis = lenis;
  currentLenis?.on('scroll', onLenisScroll);
}

function start(): void {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.addEventListener('scroll', scheduleEmit, { passive: true });
  window.addEventListener('resize', scheduleEmit);
  attachLenis(getLenisSnapshot());
  // Lenis may mount after the first subscriber — re-attach when it changes.
  unsubLenisStore = subscribeToLenis(() => attachLenis(getLenisSnapshot()));
}

function stop(): void {
  if (!started) return;
  started = false;
  window.removeEventListener('scroll', scheduleEmit);
  window.removeEventListener('resize', scheduleEmit);
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  attachLenis(null);
  unsubLenisStore?.();
  unsubLenisStore = null;
}

/**
 * Subscribe to scroll. The callback fires once immediately with the current
 * scroll position, then on every scroll/resize frame. Returns an unsubscribe.
 */
export function subscribeScroll(cb: ScrollSubscriber): () => void {
  subscribers.add(cb);
  if (typeof window !== 'undefined') {
    start();
    cb(window.scrollY);
  }
  return () => {
    subscribers.delete(cb);
    if (subscribers.size === 0) stop();
  };
}
