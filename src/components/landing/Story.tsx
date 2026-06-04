const imgGiaIllustration =
  'https://www.figma.com/api/mcp/asset/eb597483-72bd-4df2-8988-d456f708b0fd';

export default function Story(): React.ReactElement {
  return (
    <section id="bg-stop-story" className="w-full px-5 py-16 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row">
        {/* Mobile: simple stacked illustration + heading (the absolutely
            positioned artistic overlay below doesn't fit narrow screens). */}
        <div className="flex w-full flex-col items-center gap-6 sm:hidden">
          <div className="relative aspect-[493/385] w-full max-w-[420px] overflow-hidden">
            <img
              alt="GIA Illustration"
              className="absolute top-[-0.21%] left-[-11.56%] h-full w-[117.3%] max-w-none"
              src={imgGiaIllustration}
            />
          </div>
          <h2 className="font-young-serif text-center text-[40px] leading-[1.05] tracking-[-1.12px] text-black">
            We found our intern on TikTok
          </h2>
        </div>

        {/* sm+ : original overlapping-text composition */}
        <div className="relative hidden shrink-0 [grid-template-columns:max-content] [grid-template-rows:max-content] place-items-start leading-[0] sm:inline-grid">
          <div className="relative [grid-column:1] [grid-row:1] h-[385px] w-[493px] overflow-hidden">
            <img
              alt="GIA Illustration"
              className="absolute top-[-0.21%] left-[-11.56%] h-full w-[117.3%] max-w-none"
              src={imgGiaIllustration}
            />
          </div>
          <h2 className="font-young-serif [grid-column:1] [grid-row:1] mt-[7px] ml-[202px] text-[56px] leading-[1.1] tracking-[-1.12px] text-black">
            We
          </h2>
          <h2 className="font-young-serif [grid-column:1] [grid-row:1] mt-[46px] ml-[315px] text-[56px] leading-[1.1] tracking-[-1.12px] text-black">
            found
          </h2>
          <h2 className="font-young-serif [grid-column:1] [grid-row:1] mt-[240px] ml-[110px] text-[56px] leading-[1.1] tracking-[-1.12px] text-black">
            our
          </h2>
          <h2 className="font-young-serif [grid-column:1] [grid-row:1] mt-[302px] ml-[55px] text-[56px] leading-[1.1] tracking-[-1.12px] text-black">
            intern
          </h2>
          <h2 className="font-young-serif [grid-column:1] [grid-row:1] mt-[378px] ml-[170px] text-[56px] leading-[1.1] tracking-[-1.12px] text-black">
            on TikTok
          </h2>
        </div>

        <div className="flex w-full max-w-[550px] flex-col gap-6 py-10">
          <p className="font-sans text-[18px] leading-[1.45] font-semibold tracking-[-0.09px] text-black">
            THE STORY BEHIND GIA
          </p>
          <div className="font-sans text-[20px] leading-[1.25] tracking-[-0.1px] text-black">
            <p className="mb-4">
              SOFI AI founder Sophia Sy wasn&apos;t looking for an intern. then
              she stumbled on a TikTok from a girl named Gia — and hired her on
              the spot. not through LinkedIn, not through a referral. through a
              60-second video.
            </p>
            <p>
              that moment proved something: in 2025, your TikTok is your resume.
              your content is your personal brand. and most creators have no
              idea how powerful — or how fixable — theirs actually is.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
