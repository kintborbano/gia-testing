export default function AboutUs(): React.ReactElement {
  const values = [
    {
      title: 'audience over algorithms',
      body: 'Generic AI prompts and recycled creator advice ignore the one thing that matters — your actual audience. GIA reads your comments and watches your videos so every insight is pulled from the people already showing up for you.',
    },
    {
      title: 'brutally honest, never cruel',
      body: 'Growth needs a friend who tells you the truth. GIA scores your hooks, flags what is not landing, and says what most tools are too polite to mention — then hands you the fix.',
    },
    {
      title: 'made for creators, not enterprises',
      body: 'No dashboards you will never open. No jargon. Just a clear, personalized report you can act on before your next post.',
    },
  ];

  return (
    <section
      id="bg-stop-about"
      className="flex w-full flex-col items-center px-5 py-10 sm:px-8 md:px-16"
    >
      <div className="flex w-[1152px] max-w-full flex-col items-center">
        <div className="flex w-full flex-col items-center gap-6 text-center text-[#151515]">
          <p className="font-sans text-[18px] font-bold tracking-[-0.09px]">
            ABOUT US
          </p>
          <h1 className="font-young-serif w-full text-[32px] leading-[1.1] tracking-[-1.12px] sm:text-[44px] md:text-[56px]">
            your tiktok finally has someone watching.
          </h1>
          <p className="w-[640px] max-w-full font-sans text-[18px] leading-[1.3] font-medium tracking-[-0.12px] md:text-[24px] md:leading-[1.25]">
            GIA started with a simple frustration: creators were drowning in
            advice that had nothing to do with their own content. We built an AI
            that actually watches — video by video, comment by comment — and
            turns it into a growth plan made just for you.
          </p>
        </div>

        <div className="mt-12 grid w-full gap-6 md:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col gap-3 rounded-[24px] bg-[#F5F2EC] px-6 py-8 text-left text-[#151515] md:px-8 md:py-10"
            >
              <h2 className="font-young-serif text-[24px] leading-[1.15] tracking-[-0.5px] md:text-[28px]">
                {value.title}
              </h2>
              <p className="font-sans text-[16px] leading-[1.4] font-normal tracking-[-0.12px] md:text-[18px]">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
