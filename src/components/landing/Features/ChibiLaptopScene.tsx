'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  getFrameImage,
  releaseFrames,
  pickFrames,
  prefersFrameEviction,
  LAPTOP_FRAMES_FULL,
  LAPTOP_FRAMES_SM,
} from '@/lib/preloadAssets';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';
import { observeFrameLifecycle } from '@/lib/scroll/frameLifecycle';

// Laptop animation frames (Kling export, background removed to transparent so
// the feature icons can peek out around the laptop as they explode outward).
// Files: public/images/laptop-frames/final2_prob3000.webp ... 3119, sampled
// down by LAPTOP_FRAMES_* in preloadAssets (phones get the lighter `-sm` set).
// The canvas backing store stays at the full-res dimensions on every device — a
// single ~3.8 MB buffer, negligible — and drawImage scales the (smaller on
// phones) source frame into it, so there's no hydration-sensitive size swap.
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

// Mobile self-scrub: map the laptop's travel through the viewport to 0→1
// progress. Progress 0 when its top sits at the viewport bottom (just entering),
// reaching 1 by the time its top climbs to this fraction down the viewport — so
// the sequence finishes as the laptop settles fully into view.
const MOBILE_SCRUB_END = 0.25;

// Imperative handle: the parent drives the scrub from the shared scroll ticker
// (no per-frame React render). `draw` maps 0→1 section progress to a frame.
export interface ChibiLaptopHandle {
  draw: (animationProgress: number) => void;
}

interface ChibiLaptopSceneProps {
  // Tablet/desktop scrub the frame sequence imperatively, driven by the parent's
  // sticky-section progress (selfScrub off). Mobile has no sticky section, so it
  // scrubs itself from the laptop's own position in the viewport.
  selfScrub?: boolean;
  // Called once every frame has loaded + decoded.
  onReady?: () => void;
}

const ChibiLaptopScene = forwardRef<ChibiLaptopHandle, ChibiLaptopSceneProps>(
  function ChibiLaptopScene({ selfScrub = false, onReady }, ref) {
    return <AnimatedLaptop ref={ref} selfScrub={selfScrub} onReady={onReady} />;
  }
);

export default ChibiLaptopScene;

// Renders the laptop frame sequence onto a canvas. Desktop/tablet scrub it from
// the parent's sticky-section progress; mobile scrubs itself from the laptop's
// position as it scrolls through the viewport.
const AnimatedLaptop = forwardRef<
  ChibiLaptopHandle,
  { selfScrub: boolean; onReady?: () => void }
>(function AnimatedLaptop({ selfScrub, onReady }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(-1);
  const [posterReady, setPosterReady] = useState(false);
  // Device-appropriate frame list, resolved once (full on desktop/tablet, the
  // lighter `-sm` set on phones). Only drives the URL list + count, never markup,
  // so picking the phone set on the client's first render is hydration-safe.
  const [frames] = useState(() =>
    pickFrames(LAPTOP_FRAMES_FULL, LAPTOP_FRAMES_SM)
  );
  const frameCount = frames.length;
  // Hold the scrub on frame 0 until the frames have decoded, then replay the
  // last progress seen so the laptop snaps to the right frame instead of parking.
  const framesReadyRef = useRef(false);
  const lastProgressRef = useRef(0);

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

  // Draw the frame matching 0→1 progress. Holds the first frame through
  // LAPTOP_DELAY, then scrubs across the remaining progress. Pinned to frame 0
  // until the frames decode (lastProgress is replayed once they do). No React
  // render per frame — called from the scroll ticker on both paths.
  const scrub = (progress: number): void => {
    lastProgressRef.current = progress;
    const p = framesReadyRef.current ? progress : 0;
    const scrubbed = Math.min(
      1,
      Math.max(0, (p - LAPTOP_DELAY) / (1 - LAPTOP_DELAY))
    );
    const index = Math.round(scrubbed * (frameCount - 1));
    if (index === currentFrameRef.current) return;
    currentFrameRef.current = index;
    drawFrame(index);
  };

  // Desktop/tablet: the parent drives the scrub from the sticky-section progress.
  useImperativeHandle(ref, () => ({ draw: scrub }));

  // Lazily decode the frame sequence when the laptop nears the viewport (so
  // drawImage during scroll never blocks), and on touch devices RELEASE it once
  // the laptop scrolls far away — re-acquiring on approach — so the landing's
  // scrubbers don't all pin their decoded bitmaps at once. Desktop loads once and
  // keeps the frames warm. `onReady`/`framesReady` fire only on the first load.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let loaded = false;
    let readyFired = false;
    let timeoutId: number | undefined;

    const fireReady = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      // Reveal + unlock the scrub even if a frame failed, so the section is
      // never left stuck on frame 0. onReady is a one-time hand-off to the
      // parent; later re-acquires only need to redraw the current frame.
      setPosterReady(true);
      if (!readyFired) {
        readyFired = true;
        framesReadyRef.current = true;
        onReadyRef.current?.();
      }
      // Snap to the frame for the progress seen while frames were (re)decoding.
      scrub(lastProgressRef.current);
    };

    const acquire = () => {
      if (loaded) return;
      loaded = true;
      const images: HTMLImageElement[] = [];
      let settled = 0;

      // Count every frame that settles — success OR failure — so a single
      // decode rejection can't leave `settled` short of frameCount and pin
      // the laptop on frame 0 forever.
      const onSettled = (i: number, ok: boolean) => {
        settled += 1;
        if (ok && i === 0) {
          setPosterReady(true);
          drawFrame(0);
        }
        if (ok && i === currentFrameRef.current) drawFrame(i);
        if (settled === frameCount) fireReady();
      };

      for (let i = 0; i < frameCount; i++) {
        const img = getFrameImage(frames[i]);
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
    };

    const release = () => {
      if (!loaded) return;
      loaded = false;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      imagesRef.current = [];
      currentFrameRef.current = -1; // force a redraw when re-acquired
      releaseFrames(frames);
    };

    return observeFrameLifecycle(canvas, {
      onApproach: acquire,
      onRecede: release,
      evict: prefersFrameEviction(),
    });
    // `scrub` closes over stable refs; `frames`/`frameCount` come from useState.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames, frameCount]);

  // Mobile self-scrub: with no sticky section to drive `draw`, map the laptop's
  // own viewport position to progress on every scroll frame (shared ticker, so
  // Lenis-smoothed and batched with the other scroll effects).
  useEffect(() => {
    if (!selfScrub) return;
    return subscribeScroll(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { top } = canvas.getBoundingClientRect();
      const vh = window.innerHeight;
      // top === vh → 0 (entering from the bottom); top === vh*END → 1.
      const span = vh * (1 - MOBILE_SCRUB_END);
      scrub(Math.min(1, Math.max(0, (vh - top) / span)));
    });
    // `scrub` closes over stable refs; re-subscribe only when the mode flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfScrub]);

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
});
