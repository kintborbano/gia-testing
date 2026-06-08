import AnalyzeTiktokButton from '@/components/ui/AnalyzeTiktokButton';
import PeaceScrubber from './PeaceScrubber';

export default function CTA(): React.ReactElement {
  return (
    <section
      id="bg-stop-cta"
      className="flex w-full flex-col items-center justify-center bg-white px-5 sm:px-8 md:px-16"
    >
      <div className="flex w-full max-w-[1152px] flex-col items-center justify-center gap-8 pt-20 pb-12 md:h-[478px] md:flex-row md:pt-24 md:pb-10">
        <div className="flex w-full max-w-[640px] flex-col items-center justify-center md:h-[622px] md:min-w-0 md:flex-[1.5] md:items-start">
          <PeaceScrubber />
        </div>

        <div className="text-brand-primary flex w-full max-w-[603px] flex-col items-center justify-center gap-5 text-center sm:gap-6 md:min-w-0 md:flex-1 md:items-start md:gap-7 md:text-left">
          <h2 className="font-itc-garamond w-full max-w-[574px] text-[40px] leading-[1.1] tracking-[-1px] text-[#151515] sm:text-[52px] md:text-[64px]">
            ready to know what <br className="md:hidden" />
            your{' '}
            <span className="font-itc-garamond-narrow-italic text-brand-primary italic">
              audience
            </span>{' '}
            <br className="md:hidden" />
            <span className="font-itc-garamond-narrow-italic text-brand-primary italic">
              actually
            </span>{' '}
            wants?
          </h2>
          <p className="w-full max-w-[504px] font-sans text-[16px] leading-[1.3] font-normal tracking-[-0.12px] text-[#151515] md:text-[20px] md:leading-[1.25]">
            Stop guessing. Start posting with evidence.
          </p>
          <AnalyzeTiktokButton variant="cta" />
        </div>
      </div>
    </section>
  );
}
