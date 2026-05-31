export default function Footer(): React.ReactElement {
  return (
    <footer
      id="bg-stop-footer"
      className="flex w-full flex-col items-center px-16 py-10"
    >
      <div className="flex w-[1152px] max-w-full flex-col gap-8 rounded-[24px] bg-[#8c1f2e] px-16 py-20 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 text-white">
          <div className="font-young-serif text-[40px] leading-[1.1] tracking-[-0.8px]">
            GIA by SOFI AI
          </div>
          <p className="max-w-[480px] font-sans text-[18px] leading-[1.45] tracking-[-0.09px] text-white/80">
            TikTok hook analysis for creators who want clearer feedback before
            the next post goes live.
          </p>
        </div>
        <a
          href="/action"
          className="inline-flex h-[44px] w-fit items-center rounded-full border border-[#8c1f2e] bg-white px-6 font-sans text-[15px] font-bold tracking-[-0.3px] text-[#8c1f2e]"
        >
          Analyze a hook
        </a>
      </div>
    </footer>
  );
}
