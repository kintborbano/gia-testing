'use client';

import { useState } from 'react';
import { useFeatureSectionAnimation } from '@/hooks/useFeatureSectionAnimation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FeatureScene from './FeatureScene';
import Action from './Action';

function Headline(): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-6 text-center text-black">
      <p className="font-sans text-[16px] font-semibold tracking-[-0.09px] md:text-[18px]">
        MEET GIA
      </p>
      <h2
        id="features-headline"
        className="font-young-serif w-full text-[36px] leading-tight sm:text-[48px] md:text-[64px]"
      >
        part strategist. part analyst.
        <br />
        part brutally honest friend.
      </h2>
      <p className="w-full max-w-[700px] font-sans text-[16px] leading-normal md:text-[20px]">
        GIA reviews your TikTok account video by video, comment by comment, then
        turns everything into a personalized growth report. No generic AI
        prompts. No recycled creator advice. Just insights pulled directly from
        your audience.
      </p>
    </div>
  );
}

export default function Features(): React.ReactElement {
  // Desktop-first so the server HTML and the common case skip the re-render.
  // md+ gets the sticky scroll-explode; lg+ swaps the tablet "ring" for the
  // wider desktop "scatter" arc (Figma 61:1563).
  const isDesktop = useMediaQuery('(min-width: 768px)', true);
  const isWide = useMediaQuery('(min-width: 1024px)', true);
  const { sectionRef, animationProgress, containerStyle } =
    useFeatureSectionAnimation();

  // Hold the scene on its poster frame until every laptop frame is decoded, so
  // the scroll-driven scrub never stutters on a synchronous image decode.
  const [framesReady, setFramesReady] = useState(false);

  // Mobile (Figma 61:1789): a static 3x2 feature grid above a full-width
  // laptop, with the headline below it. No sticky scroll-scrub.
  if (!isDesktop) {
    return (
      <>
        <section
          id="features-section"
          className="flex w-full flex-col items-center gap-12 px-5 py-12 sm:px-8"
        >
          <FeatureScene animationProgress={1} layout="mobile" />
          <Headline />
        </section>
        <Action />
      </>
    );
  }

  // Desktop / tablet (Figma 61:1676): the headline, then a sticky scene where
  // the laptop scrubs in and the six features explode out into the ring.
  return (
    <>
      <section
        id="features-section"
        ref={sectionRef}
        className="relative flex min-h-[260vh] w-full flex-col items-center"
      >
        <div className="flex w-[1152px] max-w-full flex-col items-center justify-center px-8 py-10 md:px-16">
          <Headline />
        </div>

        <div style={containerStyle}>
          <div className="flex h-full w-full items-center justify-center px-8">
            <FeatureScene
              animationProgress={framesReady ? animationProgress : 0}
              layout={isWide ? 'desktop' : 'tablet'}
              onFramesReady={() => setFramesReady(true)}
            />
          </div>
        </div>
      </section>

      <Action />
    </>
  );
}
