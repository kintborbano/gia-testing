import { startLenis, stopLenis } from './lenisControls';

interface ScrollLockRelease {
  release: () => void;
}

export function lockIntroScroll(): ScrollLockRelease {
  const previousScrollRestoration = history.scrollRestoration;

  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  stopLenis();
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  return {
    release: () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
      history.scrollRestoration = previousScrollRestoration;
      startLenis();
    },
  };
}
