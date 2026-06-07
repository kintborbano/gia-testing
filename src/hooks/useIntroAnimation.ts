'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EXIT_EASING, WRAPPER_EXIT_DURATION } from '@/animations/introTiming';
import { resizeLenis, startLenis } from '@/lib/scroll/lenisControls';
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

export function useIntroAnimation({
  wrapperRef,
  panelRef,
}: IntroAnimationRefs): IntroAnimation {
  const [phase, setPhase] = useState<IntroPhase>('animating');
  const [ready, setReady] = useState(false);
  const finishedRef = useRef(false);
  const { releaseScrollLock } = useIntroScrollLock(phase === 'animating');

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
    });
    return () => cancelAnimationFrame(id);
  }, [phase]);

  return { phase, ready, onLoaderFinished };
}
