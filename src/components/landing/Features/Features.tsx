'use client';

import { useFeatureSectionAnimation } from '@/hooks/useFeatureSectionAnimation';
import FeatureScene from './FeatureScene';
import Action from './Action';

export default function Features(): React.ReactElement {
  const { sectionRef, animationProgress, containerStyle } =
    useFeatureSectionAnimation();

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
              your vision is great... but your strategy is just vibes.
            </h2>
            <p className="w-[652px] font-sans text-[20px] leading-normal">
              Beyond data, GIA gives you the tea on your account, with receipts
              to back it up, and ways to slay your next post.
            </p>
          </div>
        </div>

        <div style={containerStyle}>
          <FeatureScene animationProgress={animationProgress} />
        </div>
      </section>

      <Action />
    </>
  );
}
