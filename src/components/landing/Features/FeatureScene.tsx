'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { getFloatingObjectStyle } from '@/animations/laptopAnimations';
import type { FloatingObjectOrigin } from '@/animations/laptopAnimations';
import ChibiLaptopScene from './ChibiLaptopScene';

export type FeatureLayout = 'mobile' | 'tablet' | 'desktop';

type ScatterPos = { left: number; top: number };

type Feature = {
  /** Maps to a named cell in the mobile grid template (see globals.css). */
  area: 'hook' | 'perf' | 'score' | 'comment' | 'roadmap' | 'story';
  /** Doubles as the label and the `/images/<label>.png` filename. */
  label: string;
  /** Horizontal nudge (px) for the label when the artwork isn't centered. */
  labelOffsetX?: number;
  /** Absolute "scatter" positions — top-left corner as a % of the scene box.
   *  tablet from Figma 61:1676 (arc), desktop from 61:1563 (flat). */
  tablet: ScatterPos;
  desktop: ScatterPos;
};

// Order controls the explode stagger (index -> delay): left side first, then
// right, so the burst reads outward-symmetric.
const FEATURES: Feature[] = [
  {
    area: 'hook',
    label: 'Hook Scoring',
    labelOffsetX: -6,
    tablet: { left: 0, top: 55 },
    desktop: { left: 0, top: 11.5 },
  },
  {
    area: 'perf',
    label: 'Performance Patterns',
    tablet: { left: 28.3, top: 1.3 },
    desktop: { left: 22.7, top: 9.3 },
  },
  {
    area: 'comment',
    label: 'Comment Intelligence',
    tablet: { left: 6.4, top: 21.7 },
    desktop: { left: 10.2, top: 40.9 },
  },
  {
    area: 'roadmap',
    label: 'Content Roadmap',
    tablet: { left: 54.4, top: 0 },
    desktop: { left: 69.3, top: 9.3 },
  },
  {
    area: 'story',
    label: 'Shareable Story Card',
    tablet: { left: 82.8, top: 53.9 },
    desktop: { left: 89.4, top: 8.6 },
  },
  {
    area: 'score',
    label: 'GIA Score',
    tablet: { left: 76.6, top: 23.3 },
    desktop: { left: 79, top: 43.9 },
  },
];

// Per-breakpoint scene proportions + laptop placement (% of the scene box),
// each taken from its Figma frame. height comes from the laptop's 3:2 aspect.
const SCENES: Record<
  'tablet' | 'desktop',
  { aspect: number; laptop: { left: number; top: number; width: number } }
> = {
  tablet: { aspect: 681 / 553, laptop: { left: 1.4, top: 26.2, width: 89.7 } },
  desktop: { aspect: 962 / 357, laptop: { left: 22.2, top: 0, width: 55.5 } },
};

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

  const explode = layout !== 'mobile';
  const scene = layout === 'mobile' ? null : SCENES[layout];

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

  const sceneClass = scene
    ? 'relative w-full'
    : 'features-grid features-grid--stack';
  const sceneStyle: CSSProperties = scene ? { aspectRatio: scene.aspect } : {};

  return (
    <div className="mx-auto w-full max-w-[1040px]">
      <div className={sceneClass} style={sceneStyle}>
        <div
          ref={laptopRef}
          className="relative z-10 w-full"
          style={
            scene
              ? {
                  position: 'absolute',
                  left: `${scene.laptop.left}%`,
                  top: `${scene.laptop.top}%`,
                  width: `${scene.laptop.width}%`,
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
          const pos = layout === 'mobile' ? null : feature[layout];
          const placement: CSSProperties = pos
            ? { position: 'absolute', left: `${pos.left}%`, top: `${pos.top}%` }
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
