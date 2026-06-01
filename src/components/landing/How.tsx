const steps = [
  {
    number: 1,
    title: 'tell gia who to watch',
    description:
      "Enter your TikTok username and tell GIA what you're trying to achieve.",
    descriptionWidth: 290,
  },
  {
    number: 2,
    title: 'unlock your report',
    description: 'Complete checkout through our secure Payrex payment portal.',
    descriptionWidth: 224,
  },
  {
    number: 3,
    title: 'report arrives in 24 hours',
    description:
      'Receive your personalized report with recommendations, content roadmap, and audience insights.',
    descriptionWidth: 468,
  },
];

export default function How(): React.ReactElement {
  return (
    <section
      id="bg-stop-how"
      className="flex w-full flex-col items-center gap-10 bg-black px-16 py-24"
    >
      <div className="flex w-[1152px] max-w-full flex-col items-center pb-5">
        <div className="flex w-full flex-col items-center gap-6 text-center text-[#fef7dd]">
          <p className="w-[360px] font-sans text-[15px] leading-[1.45] font-bold tracking-[-0.075px]">
            HOW GIA WORKS
          </p>
          <h2 className="font-young-serif w-full text-[56px] leading-[1.1] tracking-[-1.12px]">
            three simple steps.
            <br />
            one brutally honest report.
          </h2>
        </div>
      </div>

      <div className="flex flex-col items-center gap-[30px]">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex h-[214px] w-[773px] max-w-full flex-col items-center justify-center gap-[9px] rounded-[15px] border border-black bg-[#fef7dd] pt-[31px] pr-[29px] pb-[33px] pl-[30px]"
          >
            <div className="flex size-[45px] shrink-0 items-center justify-center rounded-full bg-[#1a1208]">
              <span className="font-sans text-[20px] font-bold tracking-[-0.1px] text-[#fef7dd]">
                {step.number}
              </span>
            </div>
            <p className="font-young-serif text-[25px] tracking-[-1.5px] text-[#1a1208]">
              {step.title}
            </p>
            <p
              className="font-sans text-[15px] tracking-[-0.3px] text-[#1a1208]"
              style={{ width: step.descriptionWidth }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
