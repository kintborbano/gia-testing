'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';

// Layout: 260vh total.
// Phase 1: laptop slides in (0–160vh).
// Phase 2: feature icons animate (160–260vh). The scene is pinned with a plain
// CSS `position: sticky`; the browser releases it natively at the section's
// bottom and it scrolls away as the next sibling section comes up — no
// JS-driven hand-off, so there's nothing to snap or lag a frame.
const ANIM_FRACTION = 160 / 260;
const SWITCH_FRACTION = 1;

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

// Constant — the container is always sticky. The browser pins it at top:0
// while the section is in view and releases it natively at the section bottom,
// so this never needs to change (and the hook never re-renders on scroll).
const CONTAINER_STYLE: CSSProperties = {
  position: 'sticky',
  top: 0,
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  zIndex: 1,
};

export function useFeatureSectionAnimation(): FeatureSectionAnimation {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameCbs = useRef<Set<FrameCallback>>(new Set());

  const onFrame = useCallback((cb: FrameCallback) => {
    frameCbs.current.add(cb);
    return () => {
      frameCbs.current.delete(cb);
    };
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
    });
  }, []);

  return {
    sectionRef,
    containerStyle: CONTAINER_STYLE,
    onFrame,
  };
}
