import { useEffect, useRef, useState } from 'react';

/**
 * Tracks scroll direction and returns whether the header should be hidden.
 * Hides when scrolling down (past `revealAt`), reveals when scrolling up.
 * Throttled with requestAnimationFrame; listener cleaned up on unmount.
 */
export function useScrollDirection(revealAt = 80): boolean {
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const y = window.scrollY;
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
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [revealAt]);

  return hidden;
}
