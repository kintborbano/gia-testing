'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

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

function StepCard({
  step,
  index,
}: {
  step: Step;
  index: number;
}): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  // Respect reduced-motion: reveal immediately (no slide) by seeding the
  // initial state, so the effect never has to setState synchronously.
  const [revealed, setRevealed] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Cards 1 & 3 (even index) enter from the left, card 2 (odd) from the right.
  const fromLeft = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect(); // one-shot: never slides back out
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <div
      ref={ref}
      className="flex min-h-[214px] w-full flex-col items-center justify-center gap-[14px] rounded-[15px] border-[3px] border-[#c2992e] bg-[#fef7dd] px-6 py-8 shadow-[inset_0_0_0_2px_#1a1208,inset_0_3px_5px_rgba(255,240,190,0.45),0_5px_0_#8a6a1c] transition-all duration-700 ease-out will-change-transform md:px-[30px] md:pt-[31px] md:pb-[33px]"
      style={{
        transform: revealed
          ? 'translateX(0)'
          : `translateX(${fromLeft ? '-160px' : '160px'})`,
      }}
    >
      <Image
        src={`/images/emblems/${step.number}.png`}
        alt={`Step ${step.number}`}
        width={421}
        height={420}
        className="size-[65px] shrink-0"
      />
      <p className="font-young-serif text-[31px] tracking-[-1.5px] text-[#1a1208]">
        {step.title}
      </p>
      <p
        className="w-full text-center font-sans text-[15px] tracking-[-0.3px] text-[#1a1208]"
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
        <div className="flex w-full flex-col items-center gap-8 text-center text-[#fef7dd] sm:gap-11 md:gap-14">
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
