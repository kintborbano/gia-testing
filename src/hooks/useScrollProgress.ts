import { useEffect, useState } from 'react';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';

/**
 * Returns t from 0 to 1 based on scrollY mapped to [startY, startY + range].
 * Driven by the shared scroll ticker (one listener + rAF for the whole page).
 */
export function useScrollProgress(startY: number, range: number): number {
  const [t, setT] = useState(0);

  useEffect(() => {
    return subscribeScroll((scrollY) => {
      const raw = (scrollY - startY) / range;
      setT(Math.max(0, Math.min(1, raw)));
    });
  }, [startY, range]);

  return t;
}
