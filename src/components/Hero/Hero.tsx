'use client';

import HeroBubbles from '@/components/ui/HeroBubbles';
import type { CSSProperties } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import {
  SCROLL_RANGE,
  getLeftChibiStyle,
  getRightChibiStyle,
  getSpeechBubbleOpacity,
} from '@/animations/chibiAnimations';
import { HEADER_HEIGHT_LARGE } from '@/animations/headerAnimations';

const FLOAT_BASE: CSSProperties = {
  animationName: 'chibi-float',
  animationDuration: '2s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  animationDirection: 'alternate',
  willChange: 'transform',
};

type HeroProps = {
  showBubbles?: boolean;
};

export default function Hero({
  showBubbles = true,
}: HeroProps = {}): React.ReactElement {
  const t = useScrollProgress(0, SCROLL_RANGE);
  const bubbleOpacity = getSpeechBubbleOpacity(t);

  return (
    <section
      id="bg-stop-hero"
      className="relative flex items-center justify-center overflow-hidden px-16"
      style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT_LARGE}px)` }}
    >
      {/* Left chibi */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          width: 280,
          marginTop: -210,
          zIndex: 20,
        }}
      >
        <div style={getLeftChibiStyle(t)}>
          <div style={{ ...FLOAT_BASE, animationDelay: '0s' }}>
            <div
              style={{
                width: 280,
                height: 420,
                background: '#8c1f2e',
                borderRadius: 16,
              }}
            />
          </div>
        </div>
      </div>

      {/* Right chibi */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          width: 280,
          marginTop: -210,
          zIndex: 20,
        }}
      >
        <div style={getRightChibiStyle(t)}>
          <div style={{ ...FLOAT_BASE, animationDelay: '0.3s' }}>
            <div
              style={{
                width: 280,
                height: 420,
                background: '#fef7dd',
                borderRadius: 16,
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex w-[1152px] max-w-full flex-col items-center justify-center py-10">
        <div className="text-brand-primary flex w-full flex-col items-center justify-center gap-6 text-center">
          <h1 className="font-young-serif text-[56px] leading-[1.1] tracking-[-1.12px]">
            A bold headline
          </h1>
          {/* Design calls for Instrument Sans Medium (500); only 400/600 are loaded — falls back to 400 */}
          <p className="w-[360px] font-sans text-[24px] leading-[1.25] font-medium tracking-[-0.12px]">
            Go ahead and say just a little more about what you do.
          </p>
        </div>
      </div>

      {false && showBubbles && <HeroBubbles opacity={bubbleOpacity} />}
    </section>
  );
}
