import { useEffect, useRef, useState } from 'react';

/**
 * Returns t from 0 to 1 based on scrollY mapped to [startY, startY + range].
 * Throttled with requestAnimationFrame; listener is cleaned up on unmount.
 */
export function useScrollProgress(startY: number, range: number): number {
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const raw = (window.scrollY - startY) / range;
        setT(Math.max(0, Math.min(1, raw)));
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [startY, range]);

  return t;
}
