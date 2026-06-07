'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { clamp, lerp } from '@/animations/interpolate';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';

const steps = [
  {
    number: 1,
    title: 'tell gia who to watch',
    description:
      "Enter your TikTok username and tell GIA what you're trying to achieve.",
    descriptionWidth: 290,
  },
  {
    number: 2,
    title: 'unlock your report',
    description: 'Complete checkout through our secure Payrex payment portal.',
    descriptionWidth: 224,
  },
  {
    number: 3,
    title: 'report arrives in 24 hours',
    description:
      'Receive your personalized report with recommendations, content roadmap, and audience insights.',
    descriptionWidth: 468,
  },
];

type Step = (typeof steps)[number];

/** Decelerating ease — quick slide in, gentle settle. */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

// The card scrubs in as its top rises through the lower part of the viewport:
// 0 when its top is at the viewport bottom, 1 once it has risen to ENTER_END.
const ENTER_END = 0.6;
const CARD_SLIDE = 160;

function StepCard({
  step,
  index,
}: {
  step: Step;
  index: number;
}): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  // Respect reduced-motion: pin the card in place (no slide). Seeded once so the
  // value is stable across renders, matching the rest of the landing page.
  const [reduceMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Cards 1 & 3 (even index) enter from the left, card 2 (odd) from the right.
  const fromLeft = index % 2 === 0;
  const restX = fromLeft ? -CARD_SLIDE : CARD_SLIDE;

  // Slide the card in as it scrolls into view (reverses on scroll-up). Set the
  // transform imperatively from the shared scroll ticker so there's no React
  // render per frame.
  useEffect(() => {
    if (reduceMotion) return;
    return subscribeScroll(() => {
      const el = ref.current;
      if (!el) return;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const progress = clamp((vh - top) / (vh - vh * ENTER_END), 0, 1);
      const x = lerp(restX, 0, easeOutCubic(progress));
      el.style.transform = `translateX(${x}px)`;
    });
  }, [reduceMotion, restX]);

  return (
    <div
      ref={ref}
      className="border-brand-gold bg-brand-cream flex min-h-[214px] w-full flex-col items-center justify-center gap-[14px] rounded-[15px] border-[3px] px-6 py-8 shadow-[inset_0_0_0_2px_var(--color-text),inset_0_3px_5px_rgba(255,240,190,0.45),0_5px_0_var(--color-brand-gold-shadow)] will-change-transform md:px-[30px] md:pt-[31px] md:pb-[33px]"
      style={reduceMotion ? undefined : { transform: `translateX(${restX}px)` }}
    >
      <Image
        src={`/images/emblems/${step.number}.png`}
        alt={`Step ${step.number}`}
        width={421}
        height={420}
        className="size-[65px] shrink-0"
      />
      <p className="font-young-serif text-text text-center text-[31px] tracking-[-1.5px]">
        {step.title}
      </p>
      <p
        className="text-text w-full text-center font-sans text-[15px] tracking-[-0.3px]"
        style={{ maxWidth: step.descriptionWidth }}
      >
        {step.description}
      </p>
    </div>
  );
}

export default function How(): React.ReactElement {
  return (
    <section
      id="bg-stop-how"
      className="flex w-full flex-col items-center gap-16 overflow-x-clip bg-black px-5 py-16 sm:px-8 md:gap-24 md:px-16 md:py-24"
    >
      <div className="flex w-[1152px] max-w-full flex-col items-center pb-5">
        <div className="text-brand-cream flex w-full flex-col items-center gap-8 text-center sm:gap-11 md:gap-14">
          <p className="font-sans text-[15px] leading-[1.45] font-bold tracking-[-0.075px]">
            HOW GIA WORKS
          </p>
          <h2 className="font-itc-garamond w-full text-[50px] leading-[1.1] tracking-[-1.12px] sm:text-[68px] md:text-[86px]">
            three{' '}
            <span className="font-itc-garamond-narrow-italic text-brand-secondary italic">
              simple
            </span>{' '}
            steps.
            <br />
            one brutally{' '}
            <span className="font-itc-garamond-narrow-italic text-brand-secondary italic">
              honest
            </span>{' '}
            report.
          </h2>
        </div>
      </div>

      <div className="flex w-full max-w-[773px] flex-col items-center gap-[30px]">
        {steps.map((step, index) => (
          <StepCard key={step.number} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}
