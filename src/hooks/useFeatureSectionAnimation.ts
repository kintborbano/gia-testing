'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';

// Layout: 260vh total.
// Phase 1: laptop slides in (0–160vh).
// Phase 2: feature icons animate (160–260vh). Sticky scene exits with the
// section as the next sibling section scrolls in.
const ANIM_FRACTION = 160 / 260;
const SWITCH_FRACTION = 1;

interface SectionDimensions {
  sectionH: number;
  viewportH: number;
}

type ContainerMode = 'sticky' | 'absolute';

/** Per-frame callback receiving the eased 0→1 animation progress. */
export type FrameCallback = (animationProgress: number) => void;

export interface FeatureSectionAnimation {
  sectionRef: React.RefObject<HTMLElement | null>;
  containerStyle: CSSProperties;
  // Register a per-frame callback. Invoked imperatively from the scroll ticker,
  // so the scrub/explode runs WITHOUT a React render each frame. Returns an
  // unsubscribe.
  onFrame: (cb: FrameCallback) => () => void;
}

function getAnimationProgress(scrollProgress: number): number {
  if (scrollProgress < ANIM_FRACTION) {
    return (scrollProgress / ANIM_FRACTION) * 0.55;
  }

  if (scrollProgress < SWITCH_FRACTION) {
    return (
      0.55 +
      ((scrollProgress - ANIM_FRACTION) / (SWITCH_FRACTION - ANIM_FRACTION)) *
        0.45
    );
  }

  return 1.0;
}

function getContainerStyle(
  mode: ContainerMode,
  dims: SectionDimensions
): CSSProperties {
  if (mode === 'absolute') {
    return {
      position: 'absolute',
      top: SWITCH_FRACTION * dims.sectionH - dims.viewportH,
      left: 0,
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      zIndex: 1,
    };
  }

  return {
    position: 'sticky',
    top: 0,
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    zIndex: 1,
  };
}

export function useFeatureSectionAnimation(): FeatureSectionAnimation {
  const [dims, setDims] = useState<SectionDimensions>({
    sectionH: 0,
    viewportH: 0,
  });
  // The sticky→absolute hand-off is the only scroll-driven value that needs a
  // React render, and it flips exactly once — so we track it as discrete state
  // instead of re-rendering every frame.
  const [mode, setMode] = useState<ContainerMode>('sticky');
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameCbs = useRef<Set<FrameCallback>>(new Set());

  const onFrame = useCallback((cb: FrameCallback) => {
    frameCbs.current.add(cb);
    return () => {
      frameCbs.current.delete(cb);
    };
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!sectionRef.current) return;
      setDims({
        sectionH: sectionRef.current.offsetHeight,
        viewportH: window.innerHeight,
      });
    };

    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    return subscribeScroll((scrollY) => {
      const el = sectionRef.current;
      if (!el) return;
      const start = el.offsetTop - window.innerHeight;
      const range = el.offsetHeight;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (scrollY - start) / range)
      );

      const ap = getAnimationProgress(scrollProgress);
      // Per-frame, imperative — drives the canvas scrub + icon explode with no
      // React render.
      for (const cb of frameCbs.current) cb(ap);

      // Discrete — setState with the same value is a no-op in React, so this
      // only re-renders at the single hand-off point.
      setMode(scrollProgress >= SWITCH_FRACTION ? 'absolute' : 'sticky');
    });
  }, []);

  return {
    sectionRef,
    containerStyle: getContainerStyle(mode, dims),
    onFrame,
  };
}
