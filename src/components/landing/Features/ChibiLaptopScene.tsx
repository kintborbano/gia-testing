'use client';

import { useEffect, useRef, useState } from 'react';

// Laptop animation frames (Kling export, background removed to transparent so
// the feature icons can peek out around the laptop as they explode outward).
// Files: public/images/laptop-frames/final2_prob3000.webp ... 3119.
const FRAME_COUNT = 120;
const FRAME_START = 3000;
const FRAME_W = 1764;
const FRAME_H = 1176;

function framePath(i: number): string {
  return `/images/laptop-frames/final2_prob${FRAME_START + i}.webp`;
}

export const GIA_SLOT = {
  gridColumn: 1,
  gridRow: 1,
  width: 613,
  height: 394,
  marginLeft: 317,
  marginTop: 0,
} as const;

interface ChibiLaptopSceneProps {
  // 0 → 1 progress through the Features section.
  animationProgress: number;
}

export default function ChibiLaptopScene({
  animationProgress,
}: ChibiLaptopSceneProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(-1);
  const [ready, setReady] = useState(false);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, FRAME_W, FRAME_H);
    ctx.drawImage(img, 0, 0, FRAME_W, FRAME_H);
  };

  // Lazily preload the frame sequence once the laptop nears the viewport.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();

        const images: HTMLImageElement[] = [];
        for (let i = 0; i < FRAME_COUNT; i++) {
          const img = new Image();
          img.onload = () => {
            if (i === 0) setReady(true);
            if (i === currentFrameRef.current) drawFrame(i);
          };
          img.src = framePath(i);
          images.push(img);
        }
        imagesRef.current = images;
      },
      { rootMargin: '100% 0px' } // begin ~1 viewport early
    );
    io.observe(canvas);
    return () => io.disconnect();
  }, []);

  // Draw the frame matching the current scroll progress.
  useEffect(() => {
    const index = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(animationProgress * (FRAME_COUNT - 1)))
    );
    if (index === currentFrameRef.current) return;
    currentFrameRef.current = index;
    drawFrame(index);
  }, [animationProgress]);

  return (
    // zIndex keeps the laptop above the feature icons so they stay hidden
    // behind it until they explode outward.
    <div className="relative" style={{ ...GIA_SLOT, zIndex: 10 }}>
      <canvas
        ref={canvasRef}
        width={FRAME_W}
        height={FRAME_H}
        aria-label="GIA on Laptop"
        className="pointer-events-none h-full w-full object-contain"
        style={{
          transform: 'scale(1.4)',
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
}
