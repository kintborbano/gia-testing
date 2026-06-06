'use client';

import { useEffect, useRef, useState } from 'react';

// Peace-sign / wink animation for the CTA, scrubbed by scroll.
// Files: public/images/peace/gia-peace00.webp ... gia-peace69.webp
// Downscaled from 1764px; the white background matches the white CTA section,
// so no cut-out is needed.
const FRAME_COUNT = 70;
const FRAME_W = 1000;
const FRAME_H = 667;

function framePath(i: number): string {
  return `/images/peace/gia-peace${String(i).padStart(2, '0')}.webp`;
}

export default function PeaceScrubber(): React.ReactElement {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(-1);
  const [posterReady, setPosterReady] = useState(false);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, FRAME_W, FRAME_H);
    ctx.drawImage(img, 0, 0, FRAME_W, FRAME_H);
  };

  // Lazily preload + decode the frames once the CTA nears the viewport, so the
  // scroll scrub never blocks the main thread on a synchronous decode.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();

        const onDecoded = (i: number) => {
          if (i === 0) {
            setPosterReady(true);
            drawFrame(0);
          }
          if (i === currentFrameRef.current) drawFrame(i);
        };

        const images: HTMLImageElement[] = [];
        for (let i = 0; i < FRAME_COUNT; i++) {
          const img = new Image();
          img.src = framePath(i);
          images.push(img);
          img.decode().then(
            () => onDecoded(i),
            () => {
              if (img.complete) onDecoded(i);
              else img.onload = () => onDecoded(i);
            }
          );
        }
        imagesRef.current = images;
      },
      { rootMargin: '100% 0px' } // begin ~1 viewport early
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  // Scrub by the wrapper's travel through the viewport (no pinning, so the page
  // keeps scrolling): 0 = top at viewport bottom, 1 = bottom at viewport top.
  useEffect(() => {
    let raf: number | null = null;
    const update = () => {
      raf = null;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      const index = Math.round(p * (FRAME_COUNT - 1));
      if (index === currentFrameRef.current) return;
      currentFrameRef.current = index;
      drawFrame(index);
    };
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        width={FRAME_W}
        height={FRAME_H}
        aria-label="GIA holding a phone on a ringlight"
        className="h-auto w-full"
        style={{
          opacity: posterReady ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
}
