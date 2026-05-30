'use client';

import { useEffect, useRef, useState } from 'react';
import { setPageBackgroundColor } from '@/hooks/pageBackgroundStore';

type Stop = {
  anchorId: string;
  color: [number, number, number];
};

const STOPS: Stop[] = [
  { anchorId: 'bg-stop-hero', color: [255, 255, 255] },
  { anchorId: 'features-section', color: [254, 247, 221] },
  { anchorId: 'bg-stop-action', color: [255, 255, 255] },
  { anchorId: 'bg-stop-how', color: [255, 255, 255] },
  { anchorId: 'bg-stop-story', color: [254, 247, 221] },
  { anchorId: 'bg-stop-pricing', color: [254, 247, 221] },
  { anchorId: 'bg-stop-faq', color: [255, 255, 255] },
  { anchorId: 'bg-stop-comparison', color: [254, 247, 221] },
  { anchorId: 'bg-stop-footer', color: [254, 247, 221] },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function toRgb([r, g, b]: [number, number, number]): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export function ScrollBackground(): React.ReactElement {
  const [color, setColor] = useState<string>(toRgb(STOPS[0].color));
  const rafRef = useRef<number | null>(null);
  const positionsRef = useRef<number[]>([]);

  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      positionsRef.current = STOPS.map((stop) => {
        const el = document.getElementById(stop.anchorId);
        if (!el) return Number.NaN;
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height / 2 - vh / 2;
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
            publish(toRgb(STOPS[i].color));
            return;
          }
        }
        return;
      }

      const start = positions[segIndex];
      const end = positions[segIndex + 1];
      const range = end - start;
      const t = range > 0 ? clamp01((y - start) / range) : 0;
      const a = STOPS[segIndex].color;
      const b = STOPS[segIndex + 1].color;
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
