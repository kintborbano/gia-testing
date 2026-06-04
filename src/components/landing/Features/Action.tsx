import Image from 'next/image';

export default function Action(): React.ReactElement {
  return (
    <section
      id="bg-stop-action"
      className="flex w-full flex-col items-center bg-[#8c1f2e] px-5 py-16 sm:px-8 md:px-16 md:py-20"
    >
      <div className="flex w-full flex-col items-center gap-6 text-center text-white">
        <p className="font-sans text-[15px] font-bold tracking-[-0.075px]">
          GIA IN ACTION
        </p>
        <h2 className="font-young-serif w-[728px] max-w-full text-[32px] leading-[1.1] tracking-[-1.12px] sm:text-[44px] md:text-[56px]">
          she doesn&apos;t just look
          <br />
          at the numbers.
        </h2>
        <p className="w-[412px] max-w-full font-sans text-[16px] leading-[1.25] font-medium tracking-[-0.1px] md:text-[20px]">
          Most analytics tools tell you what happened.
          <br />
          GIA tells you why it happened.
        </p>
        <div className="mt-4 flex w-full items-center justify-center">
          <Image
            src="/images/laptop-frame.png"
            alt="GIA in action"
            width={1100}
            height={801}
            className="max-w-full"
          />
        </div>
      </div>
    </section>
  );
}
