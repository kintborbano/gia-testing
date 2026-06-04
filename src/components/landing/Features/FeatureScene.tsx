'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { getFloatingObjectStyle } from '@/animations/laptopAnimations';
import type { FloatingObjectOrigin } from '@/animations/laptopAnimations';
import ChibiLaptopScene from './ChibiLaptopScene';

export type FeatureLayout = 'stack' | 'ring' | 'scatter';

type Feature = {
  /** Maps to a named cell in the grid templates (see globals.css). */
  area: 'hook' | 'perf' | 'score' | 'comment' | 'roadmap' | 'story';
  /** Doubles as the label and the `/images/<label>.png` filename. */
  label: string;
  /** Horizontal nudge (px) for the label when the artwork isn't centered. */
  labelOffsetX?: number;
  /** Desktop "scatter" position — top-left corner as a % of the scene box,
   *  taken from Figma 61:1563 (illustration 962x357, laptop centred). */
  scatter: { left: number; top: number };
};

// Order controls the explode stagger (index -> delay): left side first, then
// right, so the burst reads outward-symmetric.
const FEATURES: Feature[] = [
  {
    area: 'hook',
    label: 'Hook Scoring',
    labelOffsetX: -6,
    scatter: { left: 0, top: 11.5 },
  },
  {
    area: 'perf',
    label: 'Performance Patterns',
    scatter: { left: 22.7, top: 9.3 },
  },
  {
    area: 'comment',
    label: 'Comment Intelligence',
    scatter: { left: 10.2, top: 40.9 },
  },
  {
    area: 'roadmap',
    label: 'Content Roadmap',
    scatter: { left: 69.3, top: 9.3 },
  },
  {
    area: 'story',
    label: 'Shareable Story Card',
    scatter: { left: 89.4, top: 8.6 },
  },
  { area: 'score', label: 'GIA Score', scatter: { left: 79, top: 43.9 } },
];

// Desktop scene proportions + laptop placement (from the same Figma frame).
const SCENE_ASPECT = 962 / 357;
const SCATTER_LAPTOP = { left: 22.2, width: 55.5 };

interface FeatureSceneProps {
  animationProgress: number;
  layout: FeatureLayout;
  onFramesReady?: () => void;
}

export default function FeatureScene({
  animationProgress,
  layout,
  onFramesReady,
}: FeatureSceneProps): React.ReactElement {
  const laptopRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [origins, setOrigins] = useState<FloatingObjectOrigin[]>([]);

  const explode = layout !== 'stack';
  const scatter = layout === 'scatter';

  // Measure each feature's offset back to the laptop centre so the explode
  // starts from behind the laptop. offsetLeft/Top are layout positions (they
  // ignore the explode transform), and the scene is the offset parent, so these
  // stay correct across the fluid grid and the absolute scatter. Re-measured on
  // resize and whenever the layout mode changes.
  useLayoutEffect(() => {
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
  }, [explode, layout]);

  const sceneClass = scatter
    ? 'relative w-full'
    : `features-grid features-grid--${layout}`;
  const sceneStyle: CSSProperties = scatter
    ? { aspectRatio: SCENE_ASPECT }
    : {};

  return (
    <div className="mx-auto w-full max-w-[1040px]">
      <div className={sceneClass} style={sceneStyle}>
        <div
          ref={laptopRef}
          className="relative z-10 w-full"
          style={
            scatter
              ? {
                  position: 'absolute',
                  left: `${SCATTER_LAPTOP.left}%`,
                  top: 0,
                  width: `${SCATTER_LAPTOP.width}%`,
                }
              : { gridArea: 'laptop' }
          }
        >
          <ChibiLaptopScene
            animationProgress={animationProgress}
            onReady={onFramesReady}
          />
        </div>

        {FEATURES.map((feature, index) => {
          const [first, ...rest] = feature.label.split(' ');
          const animStyle = explode
            ? getFloatingObjectStyle(
                animationProgress,
                index,
                origins[index] ?? { x: 0, y: 0 }
              )
            : {};
          const placement: CSSProperties = scatter
            ? {
                position: 'absolute',
                left: `${feature.scatter.left}%`,
                top: `${feature.scatter.top}%`,
              }
            : { gridArea: feature.area };
          return (
            <div
              key={feature.area}
              ref={(el) => {
                featureRefs.current[index] = el;
              }}
              className="relative flex flex-col items-center"
              style={{ ...placement, ...animStyle }}
            >
              <img
                alt={feature.label}
                className="pointer-events-none h-auto w-[78px] object-contain sm:w-[92px] md:w-[88px] lg:w-[96px] xl:w-[108px]"
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
