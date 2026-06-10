import { startLenis, stopLenis } from './lenisControls';

interface ScrollLockRelease {
  release: () => void;
}

export function lockIntroScroll(): ScrollLockRelease {
  const previousScrollRestoration = history.scrollRestoration;

  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  stopLenis();
  // Lock the body only — NOT the documentElement. During the intro the page
  // lives inside a `position: fixed` .intro-wrapper, so it's already out of
  // flow and the viewport has nothing to scroll; stopping Lenis + hiding body
  // overflow is enough to freeze it. Leaving html's overflow at its stylesheet
  // value (`overflow-y: scroll`) keeps the inert scrollbar track visible during
  // the intro, so the gutter looks identical before, during, and after — no
  // flash of an empty gutter or sideways shift on reveal.
  document.body.style.overflow = 'hidden';

  return {
    release: () => {
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
      history.scrollRestoration = previousScrollRestoration;
      startLenis();
    },
  };
}
