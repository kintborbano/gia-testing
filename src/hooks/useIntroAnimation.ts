'use client';

import { useEffect, useState } from 'react';
import {
  EXIT_EASING,
  LOGO_ENTER_DURATION,
  LOGO_HOLD_DURATION,
  WRAPPER_EXIT_DURATION,
} from '@/animations/introTiming';
import { resizeLenis, startLenis } from '@/lib/scroll/lenisControls';
import { useIntroScrollLock } from './useIntroScrollLock';

type IntroPhase = 'animating' | 'done';

interface IntroAnimationRefs {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  logoRef: React.RefObject<HTMLImageElement | null>;
}

interface IntroAnimation {
  phase: IntroPhase;
}

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function isAnimationCancellation(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

async function decodeLogo(logo: HTMLImageElement): Promise<void> {
  await logo.decode().catch(() => {});
}

function animateLogoEnter(logo: HTMLImageElement): Animation {
  return logo.animate(
    [
      { opacity: '0', transform: 'scale(0.92)' },
      { opacity: '1', transform: 'scale(1)' },
    ],
    { duration: LOGO_ENTER_DURATION, easing: 'ease-out', fill: 'forwards' }
  );
}

function animateScrollReveal(wrapper: HTMLDivElement): Animation {
  return wrapper.animate(
    [{ transform: 'translateY(0vh)' }, { transform: 'translateY(-100vh)' }],
    {
      duration: WRAPPER_EXIT_DURATION,
      easing: EXIT_EASING,
      fill: 'forwards',
    }
  );
}

export function useIntroAnimation({
  wrapperRef,
  panelRef,
  logoRef,
}: IntroAnimationRefs): IntroAnimation {
  const [phase, setPhase] = useState<IntroPhase>('animating');
  const { releaseScrollLock } = useIntroScrollLock(phase === 'animating');

  useEffect(() => {
    if (phase !== 'animating') return;

    const wrapper = wrapperRef.current;
    const panel = panelRef.current;
    const logo = logoRef.current;
    if (!wrapper || !panel || !logo) return;

    let cancelled = false;
    let logoEnter: Animation | null = null;
    let scrollReveal: Animation | null = null;

    wrapper.style.willChange = 'transform';

    async function runIntro(
      introWrapper: HTMLDivElement,
      introPanel: HTMLDivElement,
      introLogo: HTMLImageElement
    ) {
      let shouldComplete = false;

      try {
        await decodeLogo(introLogo);
        if (cancelled) return;

        logoEnter = animateLogoEnter(introLogo);
        await logoEnter.finished;
        if (cancelled) return;

        await wait(LOGO_HOLD_DURATION);
        if (cancelled) return;

        scrollReveal = animateScrollReveal(introWrapper);
        await scrollReveal.finished;
        if (cancelled) return;

        shouldComplete = true;
      } catch (error) {
        if (!cancelled && !isAnimationCancellation(error)) {
          console.error('Intro animation failed', error);
        }

        shouldComplete = !cancelled;
      } finally {
        logoEnter?.cancel();
        scrollReveal?.cancel();
        introWrapper.style.transform = '';
        introWrapper.style.willChange = '';
        releaseScrollLock();

        if (shouldComplete && !cancelled) {
          introPanel.style.display = 'none';
          setPhase('done');
        }
      }
    }

    runIntro(wrapper, panel, logo);

    return () => {
      cancelled = true;
      wrapper.getAnimations().forEach((animation) => animation.cancel());
      logo.getAnimations().forEach((animation) => animation.cancel());
      releaseScrollLock();
    };
  }, [logoRef, panelRef, phase, releaseScrollLock, wrapperRef]);

  useEffect(() => {
    if (phase !== 'done') return;

    const frameId = requestAnimationFrame(() => {
      resizeLenis();
      startLenis();
    });

    return () => cancelAnimationFrame(frameId);
  }, [phase]);

  return { phase };
}
