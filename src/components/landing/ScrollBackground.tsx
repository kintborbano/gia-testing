'use client';

import { useEffect, useMemo, useRef } from 'react';
import { setPageColors } from '@/stores/pageBackgroundStore';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';
import {
  COLORS,
  STOPS,
  REAL_BG_STOP_COUNT,
  DEFAULT_ALIGN,
  DEFAULT_FADE,
  DEFAULT_FOREGROUND,
  type ScrollStop,
} from './scrollBackground.config';

type Rgb = [number, number, number];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function toRgb([r, g, b]: Rgb): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

/** Resolve a stop's `color` (palette name or raw hex) to an [r, g, b] tuple. */
function resolveColor(color: ScrollStop['color']): Rgb {
  const hex = (
    color in COLORS ? COLORS[color as keyof typeof COLORS] : color
  ).replace('#', '');
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

interface Props {
  /**
   * Color stops in page order. Defaults to the landing-page config. Pass a
   * custom list to reuse the exact same scroll-driven transition elsewhere
   * (e.g. the form's white→cream, which mirrors the landing's first segment).
   */
  stops?: ScrollStop[];
  /**
   * How many leading stops paint the REAL page background (the rest only retint
   * the header). Defaults to the landing config — also correct for a 2-stop
   * white→cream list, where both stops paint the background.
   */
  realBgStopCount?: number;
}

export default function ScrollBackground({
  stops = STOPS,
  realBgStopCount = REAL_BG_STOP_COUNT,
}: Props = {}): React.ReactElement {
  const bgRef = useRef<HTMLDivElement>(null);

  // Resolve the palette from the stops. A segment `i` blends stops i and i+1, so
  // the last real-bg segment is the one ending on the last real-bg stop; past it
  // the real background holds the last painted color while the header keeps
  // adopting later sections from the store.
  const { rgbStops, rgbFgStops, lastRealBgSeg, realBgHold } = useMemo(() => {
    const resolved = stops.map((s) => resolveColor(s.color));
    return {
      rgbStops: resolved,
      rgbFgStops: stops.map((s) =>
        resolveColor(s.foreground ?? DEFAULT_FOREGROUND)
      ),
      lastRealBgSeg: realBgStopCount - 2,
      realBgHold: toRgb(resolved[realBgStopCount - 1]),
    };
  }, [stops, realBgStopCount]);

  useEffect(() => {
    // Compute every stop's trigger scroll position fresh on each frame. Doing
    // this per-frame (rather than caching on mount) keeps the seams accurate
    // even after late layout shifts — custom font swaps and image loads push
    // sections downward, and a cached position would fire the color snap at the
    // wrong scroll depth. Six getBoundingClientRect reads per frame is cheap.
    const measure = (): number[] => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      return stops.map((stop) => {
        const el = document.getElementById(stop.anchorId);
        if (!el) return Number.NaN;
        const rect = el.getBoundingClientRect();
        const align = stop.align ?? DEFAULT_ALIGN;
        const offset = (stop.offsetVh ?? 0) * vh;
        // Scroll position at which this stop's trigger point reaches the
        // middle of the viewport.
        return rect.top + y + rect.height * align - vh / 2 + offset;
      });
    };

    const update = () => {
      const positions = measure();
      if (positions.length === 0) return;

      const y = window.scrollY;
      let segIndex = -1;
      for (let i = 0; i < positions.length - 1; i++) {
        const a = positions[i];
        const b = positions[i + 1];
        if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
        if (y < b) {
          segIndex = i;
          break;
        }
      }

      // The store drives the HEADER palette (background + foreground) and uses
      // every stop. The fixed div paints the REAL page background, which only
      // follows the leading stops and then holds the last painted color.
      const publish = (headerBg: string, headerFg: string, realBg: string) => {
        // Paint the fixed div imperatively so the background color tween never
        // triggers a React render of this component each frame.
        if (bgRef.current) bgRef.current.style.backgroundColor = realBg;
        setPageColors({ background: headerBg, foreground: headerFg });
      };

      if (segIndex === -1) {
        for (let i = positions.length - 1; i >= 0; i--) {
          if (Number.isFinite(positions[i])) {
            publish(toRgb(rgbStops[i]), toRgb(rgbFgStops[i]), realBgHold);
            return;
          }
        }
        return;
      }

      const start = positions[segIndex];
      const end = positions[segIndex + 1];
      const gap = end - start;
      const destStop = stops[segIndex + 1];

      // `fade` (on the destination stop) sets what fraction of the gap the
      // transition occupies, ending exactly at the destination. fade = 1 fades
      // across the whole gap; smaller values hold, then fade fast at the end.
      const fade = clamp01(destStop.fade ?? DEFAULT_FADE);
      const fadeStart = end - gap * fade;
      const fadeRange = end - fadeStart;
      const t =
        fadeRange > 0 ? clamp01((y - fadeStart) / fadeRange) : y >= end ? 1 : 0;

      const a = rgbStops[segIndex];
      const b = rgbStops[segIndex + 1];
      const fa = rgbFgStops[segIndex];
      const fb = rgbFgStops[segIndex + 1];
      const headerBg = toRgb([
        lerp(a[0], b[0], t),
        lerp(a[1], b[1], t),
        lerp(a[2], b[2], t),
      ]);
      const headerFg = toRgb([
        lerp(fa[0], fb[0], t),
        lerp(fa[1], fb[1], t),
        lerp(fa[2], fb[2], t),
      ]);

      // In a leading segment the real background tracks the header; past the
      // last real-bg segment, hold the last painted color.
      const realBg = segIndex <= lastRealBgSeg ? headerBg : realBgHold;

      publish(headerBg, headerFg, realBg);
    };

    // The shared ticker fires once immediately and then on every scroll/resize
    // frame, in sync with Lenis (or native scroll where Lenis isn't mounted).
    return subscribeScroll(update);
  }, [stops, rgbStops, rgbFgStops, lastRealBgSeg, realBgHold]);

  return (
    <div
      ref={bgRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundColor: toRgb(rgbStops[0]),
        // Force this onto its own compositor layer. A `z-index: -1` fixed fill
        // behind the transparent hero/features is a known Chrome scroll-repaint
        // trigger — most visible while dragging the scrollbar (compositor-driven
        // scroll), where re-rasterising it each frame can flash. Promoting it
        // keeps the color tween a pure compositor recolor with no repaint.
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    />
  );
}
