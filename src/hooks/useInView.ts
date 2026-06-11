import { useEffect, useRef, useState } from 'react';

/**
 * One-shot in-view trigger for scroll-reveal motion. Unlike useInSection (which
 * tracks a band at the top of the viewport, both directions), this fires once
 * when the element first enters view and then disconnects — reveals never
 * replay on scroll-up. Reduced-motion users are treated as always in view so
 * gated animations resolve to their final state immediately.
 */
export function useInView<T extends HTMLElement>(
  rootMargin = '0px 0px -10% 0px'
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, inView];
}
