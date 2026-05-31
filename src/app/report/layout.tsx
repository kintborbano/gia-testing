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
            src="/logo.png"
            alt="GIA"
            width={689}
            height={480}
            className="h-[42px] w-auto"
            priority
          />
          <div className="flex h-[38px] w-[153px] items-center justify-center rounded-full border border-[#8c1f2e] bg-white">
            <p className="flex items-center gap-1.5 font-sans text-[13px] tracking-[-0.26px] text-[#8c1f2e]">
              powered by
              <Image
                src="/images/sofi logo.png"
                alt="SOFI AI"
                width={1080}
                height={1080}
                className="h-[28px] w-auto"
              />
            </p>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
