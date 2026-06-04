'use client';

import { useEffect, useRef, useState } from 'react';
import { setPageBackgroundColor } from '@/stores/pageBackgroundStore';
import {
  COLORS,
  STOPS,
  DEFAULT_ALIGN,
  DEFAULT_FADE,
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

export default function ScrollBackground(): React.ReactElement {
  const [color, setColor] = useState<string>(toRgb(RGB_STOPS[0]));
  const rafRef = useRef<number | null>(null);
  const positionsRef = useRef<number[]>([]);

  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      positionsRef.current = STOPS.map((stop) => {
        const el = document.getElementById(stop.anchorId);
        if (!el) return Number.NaN;
        const rect = el.getBoundingClientRect();
        const align = stop.align ?? DEFAULT_ALIGN;
        const offset = (stop.offsetVh ?? 0) * vh;
        // Scroll position at which this stop's trigger point reaches the
        // middle of the viewport.
        return (
          rect.top + window.scrollY + rect.height * align - vh / 2 + offset
        );
      });
    };

    const update = () => {
      rafRef.current = null;
      const positions = positionsRef.current;
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

      const publish = (rgb: string) => {
        setColor(rgb);
        setPageBackgroundColor(rgb);
      };

      if (segIndex === -1) {
        for (let i = positions.length - 1; i >= 0; i--) {
          if (Number.isFinite(positions[i])) {
            publish(toRgb(RGB_STOPS[i]));
            return;
          }
        }
        return;
      }

      const start = positions[segIndex];
      const end = positions[segIndex + 1];
      const gap = end - start;

      // `fade` (on the destination stop) sets what fraction of the gap the
      // transition occupies, ending exactly at the destination. fade = 1 fades
      // across the whole gap; smaller values hold, then fade fast at the end.
      const fade = clamp01(STOPS[segIndex + 1].fade ?? DEFAULT_FADE);
      const fadeStart = end - gap * fade;
      const fadeRange = end - fadeStart;
      const t =
        fadeRange > 0 ? clamp01((y - fadeStart) / fadeRange) : y >= end ? 1 : 0;

      const a = RGB_STOPS[segIndex];
      const b = RGB_STOPS[segIndex + 1];
      publish(
        toRgb([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)])
      );
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundColor: color,
      }}
    />
  );
}
