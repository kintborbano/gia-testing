'use client';

import { useEffect, useRef, useState } from 'react';

// Laptop-opening frames for the "GIA in action" section, scrubbed by scroll.
// Files: public/images/action-frames/laptop00.webp ... laptop38.webp
// Downscaled from 4K to display resolution; the red background is baked in and
// matches the section, so no transparency/cut-out is needed here.
const FRAME_COUNT = 39;
const FRAME_W = 1280;
const FRAME_H = 720;

function framePath(i: number): string {
  return `/images/action-frames/laptop${String(i).padStart(2, '0')}.webp`;
}

interface ActionLaptopProps {
  // 0 → 1 progress through the Action section.
  animationProgress: number;
}

export default function ActionLaptop({
  animationProgress,
}: ActionLaptopProps): React.ReactElement {
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

  // Lazily preload + decode the frames once the section nears the viewport.
  // Decoding up front keeps drawImage instant during the scroll scrub.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
    <canvas
      ref={canvasRef}
      width={FRAME_W}
      height={FRAME_H}
      aria-label="GIA in action"
      className="h-auto max-h-[50vh] w-full max-w-[1000px] object-contain"
      style={{ opacity: posterReady ? 1 : 0, transition: 'opacity 0.3s ease' }}
    />
  );
}
