import Image from 'next/image';

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <>
      <header className="flex items-center justify-center border-b border-black/10 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/gia-logo.svg"
            alt="GIA"
            width={689}
            height={480}
            className="h-[42px] w-auto"
            priority
          />
          <div className="border-brand-primary flex h-[38px] w-auto items-center justify-center rounded-full border bg-white px-3.5">
            <p className="text-brand-primary flex items-center gap-1.5 font-sans text-[13px] tracking-[-0.26px]">
              powered by
              <Image
                src="/logos/sofi-ai-logo.svg"
                alt="SOFI AI"
                width={1675}
                height={489}
                className="h-[15px] w-auto"
              />
            </p>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
