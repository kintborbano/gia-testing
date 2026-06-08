'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { EXIT_EASING, WRAPPER_EXIT_DURATION } from '@/animations/introTiming';
import { resizeLenis, startLenis } from '@/lib/scroll/lenisControls';
import { scrollToHashTarget } from '@/lib/scroll/navScroll';
import { preloadCriticalAssets } from '@/lib/preloadAssets';
import { useIntroScrollLock } from './useIntroScrollLock';

type IntroPhase = 'animating' | 'done';

interface IntroAnimationRefs {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
}

interface IntroAnimation {
  phase: IntroPhase;
  // True once the site is prepared (fonts + window load). Drives the loader loop.
  ready: boolean;
  // Passed to the loader; runs the reveal once the loader animation completes.
  onLoaderFinished: () => void;
}

// Safety cap so the loader can never hang forever if a resource stalls.
const MAX_LOADING_MS = 15000;

// The intro plays once per visit. We persist a flag for the browsing session so
// that returning to the home page via page-to-page navigation (or a reload)
// skips the overlay — it only runs on the genuine first load of the site.
const INTRO_PLAYED_KEY = 'gia:intro-played';

function introAlreadyPlayed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(INTRO_PLAYED_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroPlayed(): void {
  try {
    window.sessionStorage.setItem(INTRO_PLAYED_KEY, '1');
  } catch {
    // sessionStorage unavailable (private mode / quota) — the intro will simply
    // replay next time, which is an acceptable degradation.
  }
}

export function useIntroAnimation({
  wrapperRef,
  panelRef,
}: IntroAnimationRefs): IntroAnimation {
  const [phase, setPhase] = useState<IntroPhase>('animating');
  const [ready, setReady] = useState(false);
  const finishedRef = useRef(false);
  const { releaseScrollLock } = useIntroScrollLock(phase === 'animating');

  // Skip the intro on page-to-page navigation back to the home page (or any
  // reload within the session): it has already played, so reveal the page
  // immediately. Runs before paint so there's no flash of the overlay.
  useLayoutEffect(() => {
    if (!introAlreadyPlayed()) return;
    finishedRef.current = true;
    releaseScrollLock();
    if (panelRef.current) panelRef.current.style.display = 'none';
    // Intentional: a lazy useState initializer would diverge from SSR ('animating')
    // and trip a hydration mismatch. We must skip the intro after hydration but
    // before paint, so the synchronous setState in a layout effect is correct here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase('done');
  }, [panelRef, releaseScrollLock]);

  // Readiness: real loading signal — fonts decoded + all initial resources
  // loaded. The loader keeps looping until this resolves.
  useEffect(() => {
    let settled = false;
    const mark = () => {
      if (settled) return;
      settled = true;
      setReady(true);
    };

    const onLoad =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener('load', () => resolve(), { once: true })
          );
    const onFonts = document.fonts
      ? document.fonts.ready.then(() => undefined)
      : Promise.resolve();
    // Download the lazy scroll-animation frames now so they don't pop in /
    // fail to animate the moment the page is revealed.
    const onAssets = preloadCriticalAssets();

    const timer = window.setTimeout(mark, MAX_LOADING_MS);
    Promise.all([onLoad, onFonts, onAssets]).then(mark);

    return () => window.clearTimeout(timer);
  }, []);

  // Reveal the page once the loader (intro + loading loop) has finished.
  const onLoaderFinished = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const wrapper = wrapperRef.current;
    const panel = panelRef.current;

    const complete = () => {
      markIntroPlayed();
      releaseScrollLock();
      if (panel) panel.style.display = 'none';
      setPhase('done');
    };

    if (!wrapper) {
      complete();
      return;
    }

    wrapper.style.willChange = 'transform';
    const reveal = wrapper.animate(
      [{ transform: 'translateY(0vh)' }, { transform: 'translateY(-100vh)' }],
      { duration: WRAPPER_EXIT_DURATION, easing: EXIT_EASING, fill: 'forwards' }
    );
    reveal.finished
      .catch(() => {})
      .finally(() => {
        reveal.cancel();
        wrapper.style.transform = '';
        wrapper.style.willChange = '';
        complete();
      });
  }, [panelRef, releaseScrollLock, wrapperRef]);

  // Hand control back to Lenis once the page is revealed.
  useEffect(() => {
    if (phase !== 'done') return;
    const id = requestAnimationFrame(() => {
      resizeLenis();
      startLenis();
      // Arriving from another page's "PRODUCT" nav (or any /#section link):
      // the intro reset us to the top, so now ease down to the requested
      // section. No-op when there's no hash or the target isn't on the page.
      if (window.location.hash) {
        scrollToHashTarget(window.location.hash);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [phase]);

  return { phase, ready, onLoaderFinished };
}
