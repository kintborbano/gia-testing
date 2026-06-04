'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { getFloatingObjectStyle } from '@/animations/laptopAnimations';
import type { FloatingObjectOrigin } from '@/animations/laptopAnimations';
import ChibiLaptopScene from './ChibiLaptopScene';

type Feature = {
  /** Maps to a named cell in the `.features-grid` template (see globals.css). */
  area: 'hook' | 'perf' | 'score' | 'comment' | 'roadmap' | 'story';
  /** Doubles as the label and the `/images/<label>.png` filename. */
  label: string;
  /** Horizontal nudge (px) for the label when the artwork isn't centered. */
  labelOffsetX?: number;
};

// Order controls the explode stagger (index → delay). Left column first, then
// right column, so the burst reads outward-symmetric on the desktop ring.
const FEATURES: Feature[] = [
  { area: 'perf', label: 'Performance Patterns' },
  { area: 'comment', label: 'Comment Intelligence' },
  { area: 'hook', label: 'Hook Scoring', labelOffsetX: -6 },
  { area: 'roadmap', label: 'Content Roadmap' },
  { area: 'score', label: 'GIA Score' },
  { area: 'story', label: 'Shareable Story Card' },
];

interface FeatureSceneProps {
  animationProgress: number;
  /** When true (md+), icons explode out from behind the laptop on scroll.
   *  When false (mobile), they sit statically in the 3x2 grid. */
  explode: boolean;
  onFramesReady?: () => void;
}

export default function FeatureScene({
  animationProgress,
  explode,
  onFramesReady,
}: FeatureSceneProps): React.ReactElement {
  const gridRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [origins, setOrigins] = useState<FloatingObjectOrigin[]>([]);

  // Measure each feature cell's offset back to the laptop centre so the explode
  // starts from behind the laptop. offsetLeft/Top are layout positions (they
  // ignore the explode transform), and the grid is the offset parent, so these
  // stay correct as the fluid columns resize. Re-measured on resize.
  useLayoutEffect(() => {
    // Origins are only read while exploding; when not, leave them stale (unused)
    // rather than synchronously resetting state inside the effect body.
    if (!explode) return;

    const measure = (): void => {
      const laptop = laptopRef.current;
      if (!laptop) return;
      const lcx = laptop.offsetLeft + laptop.offsetWidth / 2;
      const lcy = laptop.offsetTop + laptop.offsetHeight / 2;
      setOrigins(
        FEATURES.map((_, i) => {
          const el = featureRefs.current[i];
          if (!el) return { x: 0, y: 0 };
          return {
            x: lcx - (el.offsetLeft + el.offsetWidth / 2),
            y: lcy - (el.offsetTop + el.offsetHeight / 2),
          };
        })
      );
    };

    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, [explode]);

  return (
    <div className="mx-auto w-full max-w-[1040px]">
      <div ref={gridRef} className="features-grid">
        <div
          ref={laptopRef}
          className="relative z-10 w-full"
          style={{ gridArea: 'laptop' }}
        >
          <ChibiLaptopScene
            animationProgress={animationProgress}
            onReady={onFramesReady}
          />
        </div>

        {FEATURES.map((feature, index) => {
          const [first, ...rest] = feature.label.split(' ');
          const animStyle: CSSProperties = explode
            ? getFloatingObjectStyle(
                animationProgress,
                index,
                origins[index] ?? { x: 0, y: 0 }
              )
            : {};
          return (
            <div
              key={feature.area}
              ref={(el) => {
                featureRefs.current[index] = el;
              }}
              className="relative flex flex-col items-center"
              style={{ gridArea: feature.area, ...animStyle }}
            >
              <img
                alt={feature.label}
                className="pointer-events-none h-auto w-[78px] object-contain sm:w-[92px] md:w-[88px] lg:w-[100px] xl:w-[112px]"
                src={`/images/${encodeURIComponent(feature.label)}.png`}
              />
              <div
                className="font-pixelify pointer-events-none mt-2 text-center text-[10px] leading-tight sm:text-[11px] md:text-[12px]"
                style={{
                  transform: `translateX(${feature.labelOffsetX ?? 0}px)`,
                }}
              >
                <div>{first}</div>
                <div>{rest.join(' ')}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
