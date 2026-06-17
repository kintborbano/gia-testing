// Decoded scroll-frame sequences are heavy — each frame is a raw RGBA bitmap held
// in memory. On touch devices we cap how many sequences are resident at once by
// RELEASING a sequence's frames when its section scrolls far away and
// re-acquiring them on approach, so the three landing scrubbers never all pin
// their bitmaps simultaneously. Desktop keeps everything warm (it has the RAM,
// and the loader preloads to avoid pop-in) by passing `evict: false`.
//
// Hysteresis avoids thrashing at the boundary: LOAD when the section is within
// ~1 viewport, but RELEASE only once it's ~2 viewports away. Acquire/release must
// be idempotent — the observers can fire their edge more than once.

interface FrameLifecycle {
  /** (Re)load + decode the sequence. Called when the section nears the viewport. */
  onApproach: () => void;
  /** Drop the sequence's decoded frames. Called when it's well off-screen. */
  onRecede: () => void;
  /** False on desktop: load once and never release. */
  evict: boolean;
}

/**
 * Observe `el` and drive a frame sequence's load/release lifecycle. Returns a
 * cleanup that disconnects the observers.
 */
export function observeFrameLifecycle(
  el: Element,
  { onApproach, onRecede, evict }: FrameLifecycle
): () => void {
  const loader = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) onApproach();
    },
    { rootMargin: '100% 0px' } // begin ~1 viewport early
  );
  loader.observe(el);

  // Desktop: load once, keep warm. No release observer.
  if (!evict) return () => loader.disconnect();

  const releaser = new IntersectionObserver(
    (entries) => {
      // Not intersecting the (larger) box → the section is ~2 viewports away.
      if (!entries.some((e) => e.isIntersecting)) onRecede();
    },
    { rootMargin: '200% 0px' } // release once ~2 viewports away
  );
  releaser.observe(el);

  return () => {
    loader.disconnect();
    releaser.disconnect();
  };
}
