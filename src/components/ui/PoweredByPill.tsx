import Image from 'next/image';
import type { ReactElement } from 'react';

type PoweredByPillProps = {
  /** Extra classes (e.g. horizontal padding overrides) merged after the defaults. */
  className?: string;
  /** Visual size. `md` (default) for footer, `sm` for the compact header. */
  size?: 'sm' | 'md';
};

const SIZES = {
  md: { pill: 'h-[38px] px-5', text: 'text-[13px]', logo: 'h-[15px]' },
  sm: { pill: 'h-[34px] px-[18px]', text: 'text-[12px]', logo: 'h-[13px]' },
} as const;

/**
 * "powered by SOFI AI" pill — outlined rounded badge shown next to the GIA logo
 * in the header, footer, and report layouts.
 */
export default function PoweredByPill({
  className = '',
  size = 'md',
}: PoweredByPillProps): ReactElement {
  const s = SIZES[size];
  return (
    <div
      className={`border-brand-primary flex w-auto items-center justify-center rounded-full border bg-white ${s.pill} ${className}`}
    >
      <p
        className={`text-brand-primary flex items-center gap-1.5 font-sans tracking-[-0.26px] ${s.text}`}
      >
        powered by
        <Image
          src="/logos/sofi-ai-logo.svg"
          alt="SOFI AI"
          width={1675}
          height={489}
          className={`${s.logo} w-auto`}
        />
      </p>
    </div>
  );
}
