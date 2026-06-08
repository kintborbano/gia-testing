'use client';

import { useEffect, useRef, useState } from 'react';

export interface NavWrapDetection {
  /** Attach to the always-rendered, hidden full-width measurement probe. */
  probeRef: React.RefObject<HTMLDivElement | null>;
  /** True once the probe's children no longer fit on a single row. */
  isWrapped: boolean;
}

/**
 * Watches a hidden measurement probe (which mirrors the full header row at the
 * real available width) and reports whether its contents would wrap to a second
 * row at the current width — the signal to collapse the header into its
 * hamburger form.
 *
 * The probe is kept mounted and full-width independently of what the visible UI
 * shows, so it can always answer "would this fit?" even while the collapsed
 * header is on screen. That's what prevents flip-flop oscillation at the
 * threshold: the element being measured is never the one we hide.
 *
 * SSR-safe: `isWrapped` starts `false` (the server / first-paint value) and is
 * only measured after mount, so it never reads the DOM during render.
 */
export function useNavWrapDetection(): NavWrapDetection {
  const probeRef = useRef<HTMLDivElement>(null);
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;

    // requestAnimationFrame id, used to debounce bursts of resize/observer
    // callbacks into a single measurement per frame.
    let rafId = 0;

    // A child sitting lower than the first child means the row has wrapped.
    const measure = (): void => {
      rafId = 0;
      const el = probeRef.current;
      if (!el) return;
      const items = el.children;
      if (items.length < 2) {
        setIsWrapped(false);
        return;
      }
      const firstTop = (items[0] as HTMLElement).offsetTop;
      let wrapped = false;
      for (let i = 1; i < items.length; i += 1) {
        if ((items[i] as HTMLElement).offsetTop > firstTop) {
          wrapped = true;
          break;
        }
      }
      // Functional update: a same-value set is a no-op, so a steady width never
      // triggers a re-render even as callbacks keep firing.
      setIsWrapped((prev) => (prev === wrapped ? prev : wrapped));
    };

    const schedule = (): void => {
      if (rafId) return;
      rafId = requestAnimationFrame(measure);
    };

    // Initial measurement after mount.
    schedule();

    // Primary signal: the probe's own width changing. Guarded so a missing
    // ResizeObserver degrades to the window-resize fallback below.
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(schedule)
        : null;
    observer?.observe(probe);

    // Fallback for environments without ResizeObserver, and a cheap safety net.
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return { probeRef, isWrapped };
}
