import Image from 'next/image';
import type { ReactElement } from 'react';

type PoweredByPillProps = {
  /** Extra classes (e.g. horizontal padding overrides) merged after the defaults. */
  className?: string;
};

/**
 * "powered by SOFI AI" pill — outlined rounded badge shown next to the GIA logo
 * in the header, footer, and report layouts.
 */
export default function PoweredByPill({
  className = '',
}: PoweredByPillProps): ReactElement {
  return (
    <div
      className={`border-brand-primary flex h-[38px] w-auto items-center justify-center rounded-full border bg-white px-5 ${className}`}
    >
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
  );
}
