'use client';

import AnalyzeTiktokButton from '@/components/ui/AnalyzeTiktokButton';
import SeeHowItWorksButton from '@/components/ui/SeeHowItWorksButton';
import { getLenisSnapshot } from '@/stores/lenisStore';
import { HEADER_HEIGHT_LARGE } from '@/animations/headerAnimations';

export default function Hero(): React.ReactElement {
  const scrollToHow = (): void => {
    const target = document.getElementById('bg-stop-how');
    if (!target) return;

    const lenis = getLenisSnapshot();
    if (lenis) {
      lenis.scrollTo(target, { offset: -HEADER_HEIGHT_LARGE });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="bg-stop-hero"
      className="relative flex items-center justify-center overflow-hidden px-5 sm:px-8 md:px-16"
      style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT_LARGE}px)` }}
    >
      <div
        className="relative z-10 flex w-[1152px] max-w-full flex-col items-center justify-center py-10"
        style={{ marginBottom: HEADER_HEIGHT_LARGE }}
      >
        <div className="text-brand-primary flex w-full flex-col items-center justify-center gap-6 text-center sm:gap-8 md:gap-10">
          <h1 className="font-itc-garamond text-[50px] leading-[1.1] tracking-[-1.12px] text-[#151515] sm:text-[68px] md:text-[86px]">
            your{' '}
            <span className="font-itc-garamond-narrow-italic text-brand-primary italic">
              tiktok
            </span>{' '}
            finally has
            <br />
            someone watching...
          </h1>
          <p className="font-sans text-[16px] leading-[1.3] font-medium tracking-[-0.12px] text-[#151515] sm:text-[18px] md:text-[20px] md:leading-[1.25]">
            GIA watches your content, reads your comments,
            <br />
            studies your patterns, and tells you exactly what to post next.
          </p>

          {/* Design calls for Instrument Sans Bold (700); only 400/600 are loaded — falls back to 600 */}
          <div className="mt-4 flex w-auto flex-row items-center justify-center gap-4 sm:mt-6 sm:gap-[34px] md:mt-8">
            <AnalyzeTiktokButton />
            <SeeHowItWorksButton onClick={scrollToHow} />
          </div>
        </div>
      </div>
    </section>
  );
}
