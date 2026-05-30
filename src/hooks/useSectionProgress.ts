import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Takes a ref to the outer wrapper div.
 * Returns t from 0 to 1 based on how far the section has been scrolled through,
 * starting when the section top enters the viewport.
 * Throttled with requestAnimationFrame; listener is cleaned up on unmount.
 */
export function useSectionProgress(
  sectionRef: RefObject<HTMLElement | null>
): number {
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const el = sectionRef.current;
        if (!el) return;
        const start = el.offsetTop - window.innerHeight;
        const range = el.offsetHeight;
        const raw = (window.scrollY - start) / range;
        setT(Math.max(0, Math.min(1, raw)));
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [sectionRef]);

  return t;
}
