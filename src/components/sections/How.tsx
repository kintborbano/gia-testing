const steps = [
  {
    number: 1,
    title: 'drop the link',
    description:
      'Enter your TikTok handle so GIA can pull and analyze your videos.',
  },
  {
    number: 2,
    title: 'set the vibe',
    description: 'Choose what you want analyzed and optimized.',
  },
  {
    number: 3,
    title: 'let gia cook',
    description: 'Get actionable growth recommendations.',
  },
];

export default function How(): React.ReactElement {
  return (
    <section
      id="bg-stop-how"
      className="flex w-full flex-col items-center px-16"
    >
      <div className="flex w-[1152px] max-w-full flex-col items-center gap-6 py-10 text-center text-[#8c1f2e]">
        <p className="font-sans text-[18px] font-bold tracking-[-0.09px]">
          HOW GIA WORKS
        </p>
        <h2 className="font-young-serif w-full text-[56px] leading-[1.1] tracking-[-1.12px]">
          Your TikTok data, stripped of the boring math.
        </h2>
        <p className="w-[360px] font-sans text-[24px] leading-[1.25] font-medium tracking-[-0.12px]">
          Turn raw metrics to actionable and shareable insights.
        </p>

        <div className="mt-2 flex w-full items-center justify-center gap-[21px]">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex h-[214px] w-[355px] flex-col items-center justify-center gap-[9px] rounded-[15px] border border-black bg-[#8c1f2e] px-[30px] py-[31px]"
            >
              <div className="relative flex h-[45px] w-[45px] shrink-0 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#fef7dd]" />
                <span className="font-young-serif relative text-[20px] tracking-[-0.1px] text-[#8c1f2e]">
                  {step.number}
                </span>
              </div>
              <p className="font-young-serif text-[25px] tracking-[-1.5px] text-white">
                {step.title}
              </p>
              <p className="w-[224px] font-sans text-[15px] tracking-[-0.3px] text-white">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
