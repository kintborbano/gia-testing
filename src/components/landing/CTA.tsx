import AnalyzeTiktokButton from '@/components/ui/AnalyzeTiktokButton';

export default function CTA(): React.ReactElement {
  return (
    <section
      id="bg-stop-cta"
      className="flex w-full flex-col items-center justify-center px-5 sm:px-8 md:px-16"
    >
      <div className="flex w-full max-w-[1152px] flex-col items-center justify-center gap-8 py-12 md:h-[478px] md:flex-row md:py-10">
        <div className="flex w-full max-w-[487px] shrink-0 flex-col items-center justify-center md:h-[622px] md:items-start md:px-[30px]">
          <div className="relative aspect-[342/336] w-full overflow-hidden">
            <img
              alt="GIA holding a phone on a ringlight"
              className="absolute top-[-20.44%] left-[-3.94%] h-[140.87%] w-[103.8%] max-w-none"
              src="/images/gia-ringlight.png"
            />
          </div>
        </div>

        <div className="text-brand-primary flex w-full max-w-[603px] shrink-0 flex-col items-center justify-center gap-6 text-center md:items-start md:text-left">
          <h2 className="font-young-serif w-full max-w-[574px] text-[32px] leading-[1.1] tracking-[-1.12px] sm:text-[44px] md:text-[56px]">
            ready to know what your audience actually wants?
          </h2>
          <p className="w-full max-w-[504px] font-sans text-[16px] leading-[1.45] font-medium tracking-[-0.1px] md:text-[20px]">
            Stop guessing. Start posting with evidence.
          </p>
          <AnalyzeTiktokButton variant="cta" className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
