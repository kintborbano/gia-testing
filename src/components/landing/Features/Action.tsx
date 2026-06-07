import ActionLaptop from './ActionLaptop';

export default function Action(): React.ReactElement {
  return (
    // Normal-flow section: the page keeps scrolling while the laptop scrubs open
    // as it passes through the viewport.
    <section
      id="bg-stop-action"
      className="bg-brand-primary flex w-full flex-col items-center px-5 py-24 text-center text-white sm:px-8 md:px-16 md:py-32"
    >
      <div className="flex w-full flex-col items-center gap-8 sm:gap-11 md:gap-14">
        <p className="font-sans text-[15px] font-bold tracking-[-0.075px]">
          GIA IN ACTION
        </p>
        <h2 className="font-itc-garamond w-full text-[50px] leading-[1.1] tracking-[-1.12px] sm:text-[68px] md:text-[86px]">
          she doesn&apos;t just look
          <br />
          at the{' '}
          <span className="font-itc-garamond-narrow-italic text-brand-secondary italic">
            numbers
          </span>
          .
        </h2>
        <p className="w-[412px] max-w-full font-sans text-[16px] leading-[1.3] font-normal tracking-[-0.12px] md:text-[20px] md:leading-[1.25]">
          Most analytics tools tell you what happened.
          <br />
          GIA tells you why it happened.
        </p>
        <div className="mt-4 flex w-full items-center justify-center">
          <ActionLaptop />
        </div>
      </div>
    </section>
  );
}
