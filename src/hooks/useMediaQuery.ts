'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe media-query hook. `defaultValue` is what the server and the first
 * client render use (before `matchMedia` is available) — pass `true` for a
 * desktop-first component so the server HTML matches the common case and only
 * narrow viewports re-render after mount.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}
