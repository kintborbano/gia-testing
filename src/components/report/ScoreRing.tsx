'use client';

import { useInView } from '@/hooks/useInView';
import SlotNumber from '@/components/report/SlotNumber';

const R = 62;
const CIRC = 2 * Math.PI * R;

export default function ScoreRing({
  score,
  max = 10,
}: {
  score: number;
  max?: number;
}): React.ReactElement {
  const [ref, inView] = useInView<HTMLDivElement>();
  const fraction = Math.min(Math.max(score / max, 0), 1);

  return (
    <div ref={ref} className="relative h-40 w-40">
      <svg
        viewBox="0 0 144 144"
        className={`h-full w-full ${inView ? 'report-ring-glow' : ''}`}
        role="img"
        aria-label={`GIA score ${score.toFixed(1)} out of ${max}`}
      >
        <defs>
          <linearGradient id="gia-ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-primary)" />
            <stop offset="100%" stopColor="var(--color-brand-gold)" />
          </linearGradient>
        </defs>
        <circle
          cx="72"
          cy="72"
          r={R}
          fill="none"
          className="stroke-brand-cream"
          strokeWidth="11"
        />
        <circle
          cx="72"
          cy="72"
          r={R}
          fill="none"
          stroke="url(#gia-ring-gradient)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={inView ? CIRC * (1 - fraction) : CIRC}
          transform="rotate(-90 72 72)"
          style={{
            transition: 'stroke-dashoffset 1.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <SlotNumber
          value={score.toFixed(1)}
          start={inView}
          className="font-young-serif text-text text-[40px]"
        />
        <span className="text-brand-primary mt-1 text-[11px] font-semibold tracking-widest uppercase">
          GIA score
        </span>
      </div>
    </div>
  );
}
