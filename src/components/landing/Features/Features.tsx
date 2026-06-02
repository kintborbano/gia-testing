'use client';

import { useState } from 'react';
import { useFeatureSectionAnimation } from '@/hooks/useFeatureSectionAnimation';
import FeatureScene from './FeatureScene';
import Action from './Action';

export default function Features(): React.ReactElement {
  const { sectionRef, animationProgress, containerStyle } =
    useFeatureSectionAnimation();

  // Hold the scene on its poster frame until every laptop frame is decoded, so
  // the scroll-driven scrub never stutters on a synchronous image decode.
  const [framesReady, setFramesReady] = useState(false);

  return (
    <>
      <section
        id="features-section"
        ref={sectionRef}
        className="relative flex min-h-[260vh] w-full flex-col items-center"
      >
        <div className="flex w-[1152px] max-w-full flex-col items-center justify-center px-16 py-10">
          <div className="flex flex-col items-center gap-6 text-center text-black">
            <p className="font-sans text-[18px] font-semibold tracking-[-0.09px]">
              MEET GIA
            </p>
            <h2
              id="features-headline"
              className="font-young-serif w-full text-[64px] leading-tight"
            >
              part strategist. part analyst.
              <br />
              part brutally honest friend.
            </h2>
            <p className="w-[700px] font-sans text-[20px] leading-normal">
              GIA reviews your TikTok account video by video, comment by
              comment, then turns everything into a personalized growth report.
              No generic AI prompts. No recycled creator advice. Just insights
              pulled directly from your audience.
            </p>
          </div>
        </div>

        <div style={containerStyle}>
          <FeatureScene
            animationProgress={framesReady ? animationProgress : 0}
            onFramesReady={() => setFramesReady(true)}
          />
        </div>
      </section>

      <Action />
    </>
  );
}
