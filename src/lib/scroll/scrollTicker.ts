// One scroll loop for the whole page. Every scroll-driven effect (background,
// header, feature explode, canvas scrubs, card reveals) subscribes here instead
// of attaching its own `window` scroll listener + rAF. Benefits:
//   - a single rAF per frame (was ~13 independent ones)
//   - all subscribers run back-to-back in one pass, so layout reads batch
//     together (no read/write thrash between unrelated effects)
//
// WHY A POLLING rAF LOOP (not a `scroll`-event listener):
// On touch devices we let iOS scroll natively (Lenis's syncTouch is off — it
// fought the OS momentum engine and made scrolling itself lag). But native
// `scroll` events fire SPARSELY and irregularly during iOS momentum scrolling,
// so animations driven off them update in coarse bursts — visible hiccups in the
// canvas scrubs / color fade even though the page glides smoothly. `window.scrollY`,
// by contrast, stays continuously accurate every frame. So instead of emitting on
// `scroll` events, we run a rAF loop that SAMPLES `window.scrollY` each frame for
// the duration of a gesture/momentum, giving every subscriber a true per-frame
// update. The loop is woken by any scroll input and parks itself once the
// position goes still, so it doesn't burn battery while idle.
//
// On desktop Lenis writes `window.scrollY` every frame for its smooth wheel, so
// the same poll tracks the eased position with no special-casing.

type ScrollSubscriber = (scrollY: number) => void;

const subscribers = new Set<ScrollSubscriber>();

// Park the loop after this many consecutive frames with no scroll movement.
// ~8 frames (~130ms) outlives the tiny gaps between iOS momentum ticks without
// running rAF indefinitely while the page sits still.
const IDLE_LIMIT = 8;

let rafId: number | null = null;
let lastY = -1;
let idleFrames = 0;
let started = false;

function emit(y: number): void {
  // Copy first — a subscriber may unsubscribe (or subscribe) during the pass.
  for (const cb of [...subscribers]) cb(y);
}

function frame(): void {
  const y = window.scrollY;
  if (y !== lastY) {
    lastY = y;
    idleFrames = 0;
    emit(y);
  } else if (++idleFrames >= IDLE_LIMIT) {
    rafId = null; // park; a scroll input will wake() it again
    return;
  }
  rafId = requestAnimationFrame(frame);
}

// Ensure the poll loop is running. Cheap to call on every scroll event.
function wake(): void {
  idleFrames = 0;
  if (rafId === null) rafId = requestAnimationFrame(frame);
}

// Resize can move every section, so force the next frame to emit even if the
// scroll position itself hasn't changed.
function onResize(): void {
  lastY = -1;
  wake();
}

function start(): void {
  if (started || typeof window === 'undefined') return;
  started = true;
  // Any scroll input wakes the poll; the poll then samples scrollY per frame
  // through the whole gesture/momentum (passive — never blocks scrolling).
  window.addEventListener('scroll', wake, { passive: true });
  window.addEventListener('touchmove', wake, { passive: true });
  window.addEventListener('wheel', wake, { passive: true });
  window.addEventListener('resize', onResize);
}

function stop(): void {
  if (!started) return;
  started = false;
  window.removeEventListener('scroll', wake);
  window.removeEventListener('touchmove', wake);
  window.removeEventListener('wheel', wake);
  window.removeEventListener('resize', onResize);
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

/**
 * Subscribe to scroll. The callback fires once immediately with the current
 * scroll position, then on every animation frame while the page is scrolling.
 * Returns an unsubscribe.
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
