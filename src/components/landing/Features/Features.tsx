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
        {/* Each "part X" clause is kept non-breaking so tablet widths wrap
            between clauses instead of splitting a phrase (e.g. "part" / "analyst"). */}
        <span className="whitespace-nowrap">
          part{' '}
          <span className="font-itc-garamond-narrow-italic text-brand-primary italic">
            strategist
          </span>
          .
        </span>{' '}
        <br className="md:hidden" />
        <span className="whitespace-nowrap">
          part{' '}
          <span className="font-itc-garamond-narrow-italic text-brand-primary italic">
            analyst
          </span>
          .
        </span>
        <br />
        <span className="whitespace-nowrap">
          part brutally <br className="md:hidden" />
          <span className="font-itc-garamond-narrow-italic text-brand-primary italic">
            honest
          </span>
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
  // md+ gets the sticky scroll-explode. The tablet "ring" (Figma 61:1676) is a
  // tall arc that needs vertical room, so it's reserved for portrait tablets in
  // the 768–1024 band (e.g. iPad Pro's 1024px portrait); everything wider, plus
  // ANY landscape viewport, takes the flat desktop "scatter" (Figma 61:1563).
  // A short, wide panel like the Nest Hub (1024×600) is landscape: forcing it
  // onto the ring crushes the arc and the icons pile onto Gia, so it scatters.
  const isDesktop = useMediaQuery('(min-width: 768px)', true);
  const isWide = useMediaQuery(
    '(min-width: 1025px), (min-width: 768px) and (orientation: landscape)',
    true
  );
  const { sectionRef, containerStyle, onFrame } = useFeatureSectionAnimation();

  // Mobile (Figma 61:1789): a static 3x2 feature grid above a full-width
  // laptop, with the headline below it. No sticky scroll-scrub.
  if (!isDesktop) {
    return (
      <>
        <section
          id="features-section"
          className="flex w-full flex-col items-center gap-12 px-5 pt-4 pb-12 sm:px-8"
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
          {/* Center the scene vertically in the 100vh pinned container. The
              scene's height is driven by width/max-width (not the viewport), so
              on taller/wider screens the leftover space would otherwise all pool
              below Gia (up to ~35% of the viewport on 1920×1080). Centring
              splits it evenly so Gia + the description card stay centred at every
              size. The sceneStyle vertical budget keeps total content ≤ ~94vh,
              so there's always room to centre without clipping. */}
          <div className="flex h-full w-full items-center justify-center px-8 py-[3vh]">
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
