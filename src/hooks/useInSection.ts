import { useEffect, useState } from 'react';

/**
 * Tracks whether the top edge of the viewport currently sits within the element
 * with the given id. Used to suppress the sticky header while a section "owns"
 * the top of the screen (e.g. the Features scroll-scene). rAF-throttled.
 */
export function useInSection(id: string): boolean {
  const [inside, setInside] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;

    const measure = () => {
      rafId = null;
      const el = document.getElementById(id);
      if (!el) {
        setInside(false);
        return;
      }
      const rect = el.getBoundingClientRect();
      // The viewport's top edge (y = 0) falls between the section's top and
      // bottom — i.e. the section is covering the top of the screen.
      setInside(rect.top <= 0 && rect.bottom > 0);
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [id]);

  return inside;
}
