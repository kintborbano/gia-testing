'use client';

import AnalyzeTiktokButton from '@/components/ui/AnalyzeTiktokButton';
import SeeHowItWorksButton from '@/components/ui/SeeHowItWorksButton';
import { getLenisSnapshot } from '@/stores/lenisStore';

export default function Hero(): React.ReactElement {
  const scrollToHow = (): void => {
    const target = document.getElementById('bg-stop-how');
    if (!target) return;

    const lenis = getLenisSnapshot();
    if (lenis) {
      // Land How flush at the top of the viewport. No header offset: arriving
      // here means scrolling down, which hides the sticky header — reserving
      // space for it would leave a gap exposing the previous (Action) section.
      lenis.scrollTo(target);
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="bg-stop-hero"
      className="hero-viewport relative flex items-center justify-center overflow-hidden px-5 sm:px-8 md:px-16"
    >
      {/* The block's bottom margin and the button row's mt (the clamp below)
          always sum to a constant, so the centred headline/subtext hold their
          position while the button alone slides down toward the next section.
          That sum sets where the text sits: 11rem on phones keeps it at the
          approved height, and the header height (sm+) lands it at true centre of
          the full viewport — matching the desktop design. At xl (desktop) the
          button-drift is switched off and the margin returns to the plain header
          height, restoring the original tight CTA spacing. Keep this calc paired
          with the button's mt clamp; change the two together. */}
      <div className="relative z-10 mb-[calc(11rem-clamp(2.5rem,9vh,8rem))] flex w-[1152px] max-w-full flex-col items-center justify-center py-10 sm:mb-[calc(var(--header-h,112px)-clamp(2.5rem,9vh,8rem))] xl:mb-[var(--header-h,112px)]">
        <div className="text-brand-primary flex w-full flex-col items-center justify-center gap-10 text-center sm:gap-11 md:gap-14">
          <h1 className="font-itc-garamond text-[clamp(38px,11vw,50px)] leading-[1.1] tracking-[-1.12px] text-[#151515] sm:text-[68px] md:text-[86px]">
            Finally understand
            <br />
            why your{' '}
            <span className="font-itc-garamond-narrow-italic text-brand-primary italic">
              tiktok
            </span>
            <br />
            {/* The whole tail ("succeeds" + dots + "or flops") recentres as one
                unit. Dots fade in on reserved width (nothing jumps); "or flops"
                reveals in a fixed-width slot (--tail-slot). While "or flops" is
                hidden the tail slides right by half that slot so "succeeds…" is
                optically centred; as it shows, the tail slides back so the full
                phrase is centred. Tune --tail-slot to the rendered " or flops"
                width. */}
            <span className="hero-tail inline-block whitespace-nowrap [--tail-slot:3.2em]">
              succeeds
              <span aria-hidden="true" className="hero-dot-1">
                .
              </span>
              <span aria-hidden="true" className="hero-dot-2">
                .
              </span>
              <span aria-hidden="true" className="hero-dot-3">
                .
              </span>
              <span
                aria-hidden="true"
                className="inline-block w-[var(--tail-slot)] text-left align-baseline"
              >
                <span className="hero-or-flops font-itc-garamond-narrow-italic text-brand-primary whitespace-nowrap italic">
                  &nbsp;or flops
                </span>
              </span>
            </span>
          </h1>
          <p className="font-sans text-[16px] leading-[1.3] font-normal tracking-[-0.12px] text-[#151515] sm:text-[18px] md:text-[20px] md:leading-[1.25]">
            GIA watches your content, reads your
            <br className="sm:hidden" /> comments,
            <br className="hidden sm:inline" /> studies your patterns, and tells
            <br className="sm:hidden" /> you exactly what to post next.
          </p>

          {/* Design calls for Instrument Sans Bold (700); only 400/600 are loaded — falls back to 600 */}
          {/* The button sits a viewport-relative distance below the subtext so
              it drifts toward the next section (the GIA scene) on tall screens —
              closing the big void on iPad portrait — while staying compact on
              short ones (iPhone SE, landscape tablet) where there's no room. The
              clamp floor keeps it off the fold on the smallest phones; the ceil
              keeps desktop close to its original spacing. */}
          <div className="mt-[clamp(2.5rem,9vh,8rem)] flex w-auto flex-col items-center justify-center gap-7 sm:flex-row sm:gap-[34px] xl:mt-0">
            <AnalyzeTiktokButton />
            <SeeHowItWorksButton
              onClick={scrollToHow}
              className="inline-block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
