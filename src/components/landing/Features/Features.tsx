'use client';

import { useFeatureSectionAnimation } from '@/hooks/useFeatureSectionAnimation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FeatureScene from './FeatureScene';
import Action from './Action';

function Headline(): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-8 py-12 text-center text-black sm:gap-11 md:gap-14 md:py-0">
      <p className="font-sans text-[16px] font-semibold tracking-[-0.09px] md:text-[18px]">
        MEET GIA
      </p>
      <h2
        id="features-headline"
        className="font-itc-garamond w-full text-[50px] leading-[1.1] tracking-[-1.12px] text-[#151515] sm:text-[68px] md:text-[86px]"
      >
        part{' '}
        <span className="font-itc-garamond-narrow-italic text-brand-primary italic">
          strategist
        </span>
        . <br className="md:hidden" />
        part{' '}
        <span className="font-itc-garamond-narrow-italic text-brand-primary italic">
          analyst
        </span>
        .
        <br />
        part brutally <br className="md:hidden" />
        <span className="font-itc-garamond-narrow-italic text-brand-primary italic">
          honest
        </span>{' '}
        friend.
      </h2>
      {/* Phone view splits this into two stacked paragraphs; md+ reflows the
          two spans back into one continuous paragraph (the layout also swaps to
          the desktop scene at md). */}
      <p className="w-full max-w-[700px] font-sans text-[16px] leading-[1.3] font-normal tracking-[-0.12px] text-[#151515] md:text-[20px] md:leading-[1.25]">
        <span className="block md:inline">
          GIA reviews your TikTok account video by video, comment by comment,
          then turns everything into a personalized growth report.
        </span>{' '}
        <span className="mt-4 block md:mt-0 md:inline">
          No generic AI prompts. No recycled creator advice. Just insights
          pulled directly from your audience.
        </span>
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
  const { sectionRef, containerStyle, onFrame } = useFeatureSectionAnimation();

  // Mobile (Figma 61:1789): a static 3x2 feature grid above a full-width
  // laptop, with the headline below it. No sticky scroll-scrub.
  if (!isDesktop) {
    return (
      <>
        <section
          id="features-section"
          className="flex w-full flex-col items-center gap-12 px-5 py-12 sm:px-8"
        >
          <FeatureScene layout="mobile" />
          <Headline />
        </section>
        <Action />
      </>
    );
  }

  // Desktop / tablet: the headline, then a sticky scene where the six features
  // explode out around the laptop as you scroll (tablet arc / desktop scatter).
  return (
    <>
      <section
        id="features-section"
        ref={sectionRef}
        className="relative flex min-h-[260vh] w-full flex-col items-center"
      >
        <div style={containerStyle}>
          <div className="flex h-full w-full items-start justify-center px-8 pt-[6vh]">
            <FeatureScene
              layout={isWide ? 'desktop' : 'tablet'}
              onFrame={onFrame}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-[1152px] max-w-full flex-col items-center justify-center px-8 pt-6 pb-32 md:px-16 md:pt-10 md:pb-48">
        <Headline />
      </div>

      <Action />
    </>
  );
}
