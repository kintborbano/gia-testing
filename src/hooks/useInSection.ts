import { useEffect, useState } from 'react';

/**
 * Tracks whether the top edge of the viewport currently sits within the element
 * with the given id. Used to suppress the sticky header while a section "owns"
 * the top of the screen (e.g. the Features scroll-scene).
 *
 * Backed by an IntersectionObserver rather than a per-frame scroll handler: the
 * `bottom: -99%` root margin collapses the detection root to a thin band at the
 * very top of the viewport, so the observer fires (and we re-render) only when
 * the section crosses that band — never every scroll frame, and with no
 * getBoundingClientRect of our own.
 */
export function useInSection(id: string): boolean {
  const [inside, setInside] = useState(false);

  useEffect(() => {
    const el = document.getElementById(id);
    // Sections are server-rendered, so the element is present; if it somehow
    // isn't, leave `inside` at its default (false) rather than re-rendering.
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInside(entry.isIntersecting),
      // Thin band at the top edge (1% of viewport height keeps the intersection
      // area non-zero so the toggle is reliable across browsers).
      { rootMargin: '0px 0px -99% 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  return inside;
}
