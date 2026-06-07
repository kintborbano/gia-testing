import { useEffect, useState } from 'react';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';

/**
 * Tracks whether the top edge of the viewport currently sits within the element
 * with the given id. Used to suppress the sticky header while a section "owns"
 * the top of the screen (e.g. the Features scroll-scene). Driven by the shared
 * scroll ticker; only re-renders when the boolean flips.
 */
export function useInSection(id: string): boolean {
  const [inside, setInside] = useState(false);

  useEffect(() => {
    return subscribeScroll(() => {
      const el = document.getElementById(id);
      if (!el) {
        setInside(false);
        return;
      }
      const rect = el.getBoundingClientRect();
      // The viewport's top edge (y = 0) falls between the section's top and
      // bottom — i.e. the section is covering the top of the screen.
      setInside(rect.top <= 0 && rect.bottom > 0);
    });
  }, [id]);

  return inside;
}
