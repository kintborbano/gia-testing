'use client';

import { useEffect, useRef, useState } from 'react';

// Laptop animation frames (Kling export, background removed to transparent so
// the feature icons can peek out around the laptop as they explode outward).
// Files: public/images/laptop-frames/final2_prob3000.webp ... 3119.
// Exported at display resolution (not the original 1764px) to keep per-frame
// decode + draw cheap during the scroll scrub.
const FRAME_COUNT = 120;
const FRAME_START = 3000;
const FRAME_W = 1200;
const FRAME_H = 800;

// Hold the poster frame for this slice of the section's progress before the
// laptop starts scrubbing, so the animation eases in rather than starting the
// instant the section appears.
const LAPTOP_DELAY = 0.15;

function framePath(i: number): string {
  return `/images/laptop-frames/final2_prob${FRAME_START + i}.webp`;
}

interface ChibiLaptopSceneProps {
  // 0 → 1 progress through the Features section.
  animationProgress: number;
  // Called once every frame has been loaded AND decoded, so scrubbing through
  // them never blocks the main thread on a synchronous decode.
  onReady?: () => void;
}

export default function ChibiLaptopScene({
  animationProgress,
  onReady,
}: ChibiLaptopSceneProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(-1);
  const [posterReady, setPosterReady] = useState(false);

  // Keep the latest onReady without re-running the loader effect.
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, FRAME_W, FRAME_H);
    ctx.drawImage(img, 0, 0, FRAME_W, FRAME_H);
  };

  // Lazily preload + decode the frame sequence once the laptop nears the
  // viewport. Decoding up front means drawImage during scroll never blocks.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();

        const images: HTMLImageElement[] = [];
        let decoded = 0;

        const onDecoded = (i: number) => {
          decoded += 1;
          if (i === 0) {
            setPosterReady(true);
            drawFrame(0);
          }
          if (i === currentFrameRef.current) drawFrame(i);
          if (decoded === FRAME_COUNT) onReadyRef.current?.();
        };

        for (let i = 0; i < FRAME_COUNT; i++) {
          const img = new Image();
          img.src = framePath(i);
          images.push(img);
          // decode() resolves once the bitmap is ready off the main thread.
          // Fall back to load events if a browser rejects decode().
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

  // Draw the frame matching the current scroll progress. The laptop holds its
  // first frame through LAPTOP_DELAY, then scrubs across the remaining progress.
  useEffect(() => {
    const scrub = Math.min(
      1,
      Math.max(0, (animationProgress - LAPTOP_DELAY) / (1 - LAPTOP_DELAY))
    );
    const index = Math.round(scrub * (FRAME_COUNT - 1));
    if (index === currentFrameRef.current) return;
    currentFrameRef.current = index;
    drawFrame(index);
  }, [animationProgress]);

  return (
    // Fluid box that fills its grid cell; aspect ratio matches the frame art.
    // The canvas is scaled up so the laptop reads large while its transparent
    // margins let the surrounding feature icons sit close to it. overflow is
    // clipped so the scaled art never pushes past the cell (no page overflow).
    <div className="relative aspect-[3/2] w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={FRAME_W}
        height={FRAME_H}
        aria-label="GIA on Laptop"
        className="pointer-events-none absolute inset-0 h-full w-full scale-[1.15] object-contain md:scale-[1.3]"
        style={{
          opacity: posterReady ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
}
