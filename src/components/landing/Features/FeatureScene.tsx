'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  getDescriptionCardStyle,
  getFloatingObjectStyle,
} from '@/animations/laptopAnimations';
import type { FloatingObjectOrigin } from '@/animations/laptopAnimations';
import ChibiLaptopScene from './ChibiLaptopScene';

export type FeatureLayout = 'mobile' | 'tablet' | 'desktop';

type ScatterPos = { left: number; top: number };

type Feature = {
  /** Maps to a named cell in the mobile grid template (see globals.css). */
  area: 'hook' | 'perf' | 'score' | 'comment' | 'roadmap' | 'story';
  /** Doubles as the label and the `/images/<label>.png` filename. */
  label: string;
  /** Shown in the description card when this feature is selected. */
  description: string;
  /** Intrinsic px size of /images/<label>.png — passed to next/image. */
  width: number;
  height: number;
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
    width: 116,
    height: 105,
    description:
      'GIA rates the first three seconds of every video on its power to stop the scroll — showing you which hooks earned the watch and which lost it.',
    labelOffsetX: -6,
    tablet: { left: 0, top: 55 },
    desktop: { left: 0, top: 11.5 },
  },
  {
    area: 'perf',
    label: 'Performance Patterns',
    width: 125,
    height: 99,
    description:
      'She maps what your best posts have in common — formats, lengths, topics, posting times — so you can repeat what already works instead of guessing.',
    tablet: { left: 28.3, top: 1.3 },
    desktop: { left: 22.7, top: 9.3 },
  },
  {
    area: 'comment',
    label: 'Comment Intelligence',
    width: 140,
    height: 105,
    description:
      'GIA reads your comments the way a strategist would, surfacing the questions, objections, and cravings your audience keeps repeating.',
    tablet: { left: 6.4, top: 21.7 },
    desktop: { left: 10.2, top: 40.9 },
  },
  {
    area: 'roadmap',
    label: 'Content Roadmap',
    width: 108,
    height: 107,
    description:
      'A week-by-week plan of what to post next, built from your own data — no blank-page guessing, just the next best move.',
    tablet: { left: 54.4, top: 0 },
    desktop: { left: 69.3, top: 9.3 },
  },
  {
    area: 'story',
    label: 'Shareable Story Card',
    width: 118,
    height: 107,
    description:
      'A polished, screenshot-ready summary of your growth wins, designed to drop straight into your Stories.',
    tablet: { left: 82.8, top: 53.9 },
    desktop: { left: 89.4, top: 8.6 },
  },
  {
    area: 'score',
    label: 'GIA Score',
    width: 117,
    height: 98,
    description:
      'One honest number that captures your account’s overall health — plus the specific levers that will move it up the fastest.',
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
  tablet: { aspect: 681 / 553, laptop: { left: 5.3, top: 26.2, width: 82 } },
  // Gia enlarged on desktop: width drives her size; aspect stays 150/width so
  // she keeps filling the box vertically, and left re-centres as (100-width)/2.
  desktop: { aspect: 150 / 56, laptop: { left: 22, top: 0, width: 56 } },
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
  // First feature (Hook Scoring) is shown by default so the card is never empty.
  const [selectedArea, setSelectedArea] = useState<Feature['area']>('hook');
  const selected = FEATURES.find((f) => f.area === selectedArea) ?? FEATURES[0];

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
    <div className="mx-auto w-full max-w-[1040px] lg:max-w-[1210px]">
      <div className={sceneClass} style={sceneStyle}>
        <div
          ref={laptopRef}
          className="pointer-events-none relative z-10 w-full"
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
            animated={explode}
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
          const isSelected = feature.area === selectedArea;
          return (
            <div
              key={feature.area}
              ref={(el) => {
                featureRefs.current[index] = el;
              }}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={feature.label}
              onClick={() => setSelectedArea(feature.area)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedArea(feature.area);
                }
              }}
              className="group focus-visible:ring-brand-primary relative flex cursor-pointer flex-col items-center rounded-xl outline-none focus-visible:ring-2"
              style={{ ...placement, ...animStyle }}
            >
              <Image
                alt={feature.label}
                width={feature.width}
                height={feature.height}
                className={`pointer-events-none h-auto w-[78px] object-contain transition-transform duration-200 group-hover:scale-105 sm:w-[92px] md:w-[104px] lg:w-[120px] xl:w-[136px] ${
                  isSelected ? 'scale-110' : ''
                }`}
                src={`/images/${encodeURIComponent(feature.label)}.png`}
              />
              <div
                className={`font-pixelify pointer-events-none mt-2 text-center text-[10px] leading-tight transition-colors duration-200 sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] ${
                  isSelected ? 'text-brand-primary' : ''
                }`}
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

      {/* Description for the selected feature, anchored below the Gia laptop.
          On desktop/tablet it slides up + fades in with the same scroll
          progress that drives the Gia character (reverses on scroll-up). */}
      <div
        aria-live="polite"
        className="border-brand-gold mx-auto mt-7 w-full max-w-[680px] rounded-[15px] border-[3px] bg-white px-12 py-7 text-center shadow-[inset_0_0_0_2px_var(--color-text),inset_0_3px_5px_rgba(255,240,190,0.45),0_5px_0_var(--color-brand-gold-shadow)] md:mt-9"
        style={explode ? getDescriptionCardStyle(animationProgress) : undefined}
      >
        <p className="font-pixelify text-brand-primary text-[22px] tracking-[0.3px] md:text-[26px]">
          {selected.label}
        </p>
        <p className="text-text mt-2 font-sans text-[14px] leading-[1.45] tracking-[-0.2px] md:text-[15px]">
          {selected.description}
        </p>
      </div>
    </div>
  );
}
