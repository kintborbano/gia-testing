import { useEffect, useRef, useState } from 'react';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';

/**
 * Tracks scroll direction and returns whether the header should be hidden.
 * Hides when scrolling down (past `revealAt`), reveals when scrolling up.
 * Driven by the shared scroll ticker (one listener + rAF for the whole page).
 */
export function useScrollDirection(revealAt = 80): boolean {
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    return subscribeScroll((y) => {
      const last = lastYRef.current;
      // Ignore tiny jitters.
      if (Math.abs(y - last) < 4) return;
      // Always show near the very top.
      if (y < revealAt) {
        setHidden(false);
      } else {
        setHidden(y > last);
      }
      lastYRef.current = y;
    });
  }, [revealAt]);

  return hidden;
}
