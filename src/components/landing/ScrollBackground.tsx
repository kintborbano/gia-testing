'use client';

import { useEffect, useRef } from 'react';
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

// Resolve the palette once — the config is static.
const RGB_STOPS: Rgb[] = STOPS.map((s) => resolveColor(s.color));
const RGB_FG_STOPS: Rgb[] = STOPS.map((s) =>
  resolveColor(s.foreground ?? DEFAULT_FOREGROUND)
);
// The real page background follows only the leading stops (hero → features);
// past them it holds the last painted color (cream) while the header keeps
// adopting later sections from the store. A segment `i` blends stops i and i+1,
// so the last real-bg segment is the one ending on the last real-bg stop.
const LAST_REAL_BG_SEG = REAL_BG_STOP_COUNT - 2;
const REAL_BG_HOLD = toRgb(RGB_STOPS[REAL_BG_STOP_COUNT - 1]);

export default function ScrollBackground(): React.ReactElement {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Compute every stop's trigger scroll position fresh on each frame. Doing
    // this per-frame (rather than caching on mount) keeps the seams accurate
    // even after late layout shifts — custom font swaps and image loads push
    // sections downward, and a cached position would fire the color snap at the
    // wrong scroll depth. Six getBoundingClientRect reads per frame is cheap.
    const measure = (): number[] => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      return STOPS.map((stop) => {
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
      // follows the leading hero→features transition and then holds cream.
      const publish = (headerBg: string, headerFg: string, realBg: string) => {
        // Paint the fixed div imperatively so the background color tween never
        // triggers a React render of this component each frame.
        if (bgRef.current) bgRef.current.style.backgroundColor = realBg;
        setPageColors({ background: headerBg, foreground: headerFg });
      };

      if (segIndex === -1) {
        for (let i = positions.length - 1; i >= 0; i--) {
          if (Number.isFinite(positions[i])) {
            publish(toRgb(RGB_STOPS[i]), toRgb(RGB_FG_STOPS[i]), REAL_BG_HOLD);
            return;
          }
        }
        return;
      }

      const start = positions[segIndex];
      const end = positions[segIndex + 1];
      const gap = end - start;
      const destStop = STOPS[segIndex + 1];

      // `fade` (on the destination stop) sets what fraction of the gap the
      // transition occupies, ending exactly at the destination. fade = 1 fades
      // across the whole gap; smaller values hold, then fade fast at the end.
      const fade = clamp01(destStop.fade ?? DEFAULT_FADE);
      const fadeStart = end - gap * fade;
      const fadeRange = end - fadeStart;
      const t =
        fadeRange > 0 ? clamp01((y - fadeStart) / fadeRange) : y >= end ? 1 : 0;

      const a = RGB_STOPS[segIndex];
      const b = RGB_STOPS[segIndex + 1];
      const fa = RGB_FG_STOPS[segIndex];
      const fb = RGB_FG_STOPS[segIndex + 1];
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

      // In the leading hero→features segment the real background tracks the
      // header (white→cream); past it, hold cream.
      const realBg = segIndex <= LAST_REAL_BG_SEG ? headerBg : REAL_BG_HOLD;

      publish(headerBg, headerFg, realBg);
    };

    // The shared ticker fires once immediately and then on every scroll/resize
    // frame, in sync with Lenis.
    return subscribeScroll(update);
  }, []);

  return (
    <div
      ref={bgRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundColor: toRgb(RGB_STOPS[0]),
      }}
    />
  );
}
