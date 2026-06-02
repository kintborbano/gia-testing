export default function CTA(): React.ReactElement {
  return (
    <section
      id="bg-stop-cta"
      className="flex w-full flex-col items-center justify-center px-16"
    >
      <div className="flex h-[478px] w-full items-center justify-center gap-8 py-10">
        <div className="flex h-[622px] w-[487px] shrink-0 flex-col items-start justify-center px-[30px]">
          <div className="relative aspect-[342/336] w-full overflow-hidden">
            <img
              alt="GIA holding a phone on a ringlight"
              className="absolute top-[-20.44%] left-[-3.94%] h-[140.87%] w-[103.8%] max-w-none"
              src="/images/gia-ringlight.png"
            />
          </div>
        </div>

        <div className="text-brand-primary flex w-[603px] shrink-0 flex-col items-start justify-center gap-6">
          <h2 className="font-young-serif w-[574px] text-[56px] leading-[1.1] tracking-[-1.12px]">
            ready to know what your audience actually wants?
          </h2>
          <p className="w-[504px] font-sans text-[20px] leading-[1.45] font-medium tracking-[-0.1px]">
            Stop guessing. Start posting with evidence.
          </p>
          <button
            type="button"
            className="border-brand-primary text-brand-primary flex h-[44px] w-[196px] items-center justify-center rounded-[25px] border bg-white font-sans text-[12px] font-bold tracking-[-0.24px] shadow-[4px_4px_4px_0px_var(--brand-primary)]"
          >
            ANALYZE MY TIKTOK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→
          </button>
        </div>
      </div>
    </section>
  );
}
