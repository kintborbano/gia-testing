'use client';

import Image from 'next/image';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { getFrameImage, LAPTOP_FRAMES } from '@/lib/preloadAssets';

// Laptop animation frames (Kling export, background removed to transparent so
// the feature icons can peek out around the laptop as they explode outward).
// Files: public/images/laptop-frames/final2_prob3000.webp ... 3119, sampled
// down by LAPTOP_FRAMES in preloadAssets.
const FRAME_COUNT = LAPTOP_FRAMES.length;
const FRAME_W = 1200;
const FRAME_H = 800;

// Hold the poster frame for this slice of the section's progress before the
// laptop starts scrubbing, so the animation eases in rather than starting the
// instant the section appears.
const LAPTOP_DELAY = 0.15;

// GIA + desk are centred in the art and span ~79% of its height with even
// transparent margins, so the laptop is scaled up from the centre to crop those
// margins and fill the box. Capped (~1.25): any larger clips her head / the desk.
const FILL = 'scale-[1.24] object-contain';

// Imperative handle: the parent drives the scrub from the shared scroll ticker
// (no per-frame React render). `draw` maps 0→1 section progress to a frame.
export interface ChibiLaptopHandle {
  draw: (animationProgress: number) => void;
}

interface ChibiLaptopSceneProps {
  // Tablet/desktop scrub the frame sequence as the section scrolls; mobile (no
  // scroll animation) shows a single still instead.
  animated: boolean;
  // Called once every frame has loaded + decoded (animated variant only).
  onReady?: () => void;
}

const ChibiLaptopScene = forwardRef<ChibiLaptopHandle, ChibiLaptopSceneProps>(
  function ChibiLaptopScene({ animated, onReady }, ref) {
    return animated ? (
      <AnimatedLaptop ref={ref} onReady={onReady} />
    ) : (
      <StaticLaptop />
    );
  }
);

export default ChibiLaptopScene;

// Mobile: a single still (gia-on-laptop.png, 1536x1024 / 3:2).
function StaticLaptop(): React.ReactElement {
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden">
      <Image
        src="/images/gia-on-laptop.png"
        alt="GIA on Laptop"
        fill
        sizes="100vw"
        className={`pointer-events-none ${FILL}`}
      />
    </div>
  );
}

// Tablet/desktop: scrub the 120-frame sequence so the laptop animates in.
const AnimatedLaptop = forwardRef<ChibiLaptopHandle, { onReady?: () => void }>(
  function AnimatedLaptop({ onReady }, ref) {
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

    // Draw the frame matching the current scroll progress. The laptop holds its
    // first frame through LAPTOP_DELAY, then scrubs across the remaining progress.
    // Called imperatively from the scroll ticker — no React render per frame.
    useImperativeHandle(ref, () => ({
      draw: (animationProgress: number) => {
        const scrub = Math.min(
          1,
          Math.max(0, (animationProgress - LAPTOP_DELAY) / (1 - LAPTOP_DELAY))
        );
        const index = Math.round(scrub * (FRAME_COUNT - 1));
        if (index === currentFrameRef.current) return;
        currentFrameRef.current = index;
        drawFrame(index);
      },
    }));

    // Lazily preload + decode the frame sequence once the laptop nears the
    // viewport. Decoding up front means drawImage during scroll never blocks.
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let timeoutId: number | undefined;

      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();

          const images: HTMLImageElement[] = [];
          let settled = 0;
          let readyFired = false;

          const fireReady = () => {
            if (readyFired) return;
            readyFired = true;
            if (timeoutId !== undefined) clearTimeout(timeoutId);
            // Reveal + unlock the scrub even if a frame failed, so the section is
            // never left stuck on frame 0.
            setPosterReady(true);
            onReadyRef.current?.();
          };

          // Count every frame that settles — success OR failure — so a single
          // decode rejection can't leave `decoded` short of FRAME_COUNT and pin
          // the laptop on frame 0 forever.
          const onSettled = (i: number, ok: boolean) => {
            settled += 1;
            if (ok && i === 0) {
              setPosterReady(true);
              drawFrame(0);
            }
            if (ok && i === currentFrameRef.current) drawFrame(i);
            if (settled === FRAME_COUNT) fireReady();
          };

          for (let i = 0; i < FRAME_COUNT; i++) {
            // Shared with the loader's preload — same Image instance, decoded
            // and held once (not a second per-scrubber copy).
            const img = getFrameImage(LAPTOP_FRAMES[i]);
            images.push(img);
            // decode() resolves once the bitmap is ready off the main thread. If
            // it rejects, settle from the load state / events instead of hanging.
            img.decode().then(
              () => onSettled(i, true),
              () => {
                if (img.complete) onSettled(i, img.naturalWidth > 0);
                else {
                  img.onload = () => onSettled(i, true);
                  img.onerror = () => onSettled(i, false);
                }
              }
            );
          }
          imagesRef.current = images;

          // Safety net: never leave the scrub locked if some frame hangs.
          timeoutId = window.setTimeout(fireReady, 8000);
        },
        { rootMargin: '100% 0px' } // begin ~1 viewport early
      );
      io.observe(canvas);
      return () => {
        io.disconnect();
        if (timeoutId !== undefined) clearTimeout(timeoutId);
      };
    }, []);

    return (
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          width={FRAME_W}
          height={FRAME_H}
          aria-label="GIA on Laptop"
          className={`pointer-events-none absolute inset-0 h-full w-full ${FILL}`}
          style={{
            opacity: posterReady ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </div>
    );
  }
);
