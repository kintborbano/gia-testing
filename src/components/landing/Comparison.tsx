export default function Comparison(): React.ReactElement {
  const rows = [
    ['Generic advice', 'Hook-specific scoring'],
    ['One-off guesses', 'Repeatable creative patterns'],
    ['Vanity metrics', 'Actionable next-post direction'],
  ];

  return (
    <section
      id="bg-stop-comparison"
      className="flex w-full flex-col items-center px-16"
    >
      <div className="flex w-[1152px] max-w-full flex-col items-center gap-6 py-20 text-center text-[#8c1f2e]">
        <p className="font-sans text-[18px] font-bold tracking-[-0.09px]">
          WHY GIA
        </p>
        <h2 className="font-young-serif w-full text-[56px] leading-[1.1] tracking-[-1.12px]">
          less guessing. more useful signals.
        </h2>

        <div className="mt-6 w-full max-w-[820px] overflow-hidden rounded-[15px] border border-black">
          {rows.map(([before, after], index) => (
            <div
              key={before}
              className={`grid md:grid-cols-2 ${
                index < rows.length - 1 ? 'border-b border-black' : ''
              }`}
            >
              <div className="border-b border-black bg-white p-5 text-left font-sans text-[18px] tracking-[-0.09px] text-black md:border-r md:border-b-0">
                {before}
              </div>
              <div className="bg-[#8c1f2e] p-5 text-left font-sans text-[18px] font-bold tracking-[-0.09px] text-white">
                {after}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
