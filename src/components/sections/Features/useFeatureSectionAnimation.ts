'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useSectionProgress } from '@/hooks/useSectionProgress';

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

export interface FeatureSectionAnimation {
  sectionRef: React.RefObject<HTMLElement | null>;
  animationProgress: number;
  containerStyle: CSSProperties;
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
  scrollProgress: number,
  dims: SectionDimensions
): CSSProperties {
  if (scrollProgress >= SWITCH_FRACTION) {
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollProgress = useSectionProgress(sectionRef);

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

  return {
    sectionRef,
    animationProgress: getAnimationProgress(scrollProgress),
    containerStyle: getContainerStyle(scrollProgress, dims),
  };
}
