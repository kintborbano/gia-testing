'use client';

import { useRef } from 'react';
import { useSectionProgress } from '@/hooks/useSectionProgress';
import ActionLaptop from './ActionLaptop';

export default function Action(): React.ReactElement {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(sectionRef);

  return (
    // Tall section so there is scroll distance to scrub through; the inner
    // content pins while the laptop opens, then releases as the section exits.
    <section
      ref={sectionRef}
      id="bg-stop-action"
      className="relative h-[250vh] w-full bg-[#8c1f2e]"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center gap-6 px-5 text-center text-white sm:px-8 md:px-16">
        <p className="font-sans text-[15px] font-bold tracking-[-0.075px]">
          GIA IN ACTION
        </p>
        <h2 className="font-young-serif w-[728px] max-w-full text-[32px] leading-[1.1] tracking-[-1.12px] sm:text-[44px] md:text-[56px]">
          she doesn&apos;t just look
          <br />
          at the numbers.
        </h2>
        <p className="w-[412px] max-w-full font-sans text-[16px] leading-[1.25] font-medium tracking-[-0.1px] md:text-[20px]">
          Most analytics tools tell you what happened.
          <br />
          GIA tells you why it happened.
        </p>
        <div className="mt-4 flex w-full items-center justify-center">
          <ActionLaptop animationProgress={progress} />
        </div>
      </div>
    </section>
  );
}
