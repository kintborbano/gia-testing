import type { ReactElement } from 'react';
import SofiLogo from './SofiLogo';

type PoweredByPillProps = {
  /** Extra classes (e.g. horizontal padding overrides) merged after the defaults. */
  className?: string;
  /** Visual size. `md` (default) for footer, `sm` for the compact header. */
  size?: 'sm' | 'md';
  /**
   * Color scheme. `default` = white pill with maroon border/text/logo.
   * `onDark` = transparent pill with a gold border and gold wordmark (a glimpse
   * of gold) plus cream text, so it reads on the black How section.
   */
  tone?: 'default' | 'onDark';
};

const SIZES = {
  md: { pill: 'h-[38px] px-5', text: 'text-[13px]', logo: 'h-[15px]' },
  sm: { pill: 'h-[34px] px-[18px]', text: 'text-[12px]', logo: 'h-[13px]' },
} as const;

const TONES = {
  default: {
    pill: 'border-brand-primary bg-white',
    text: 'text-brand-primary',
    logo: 'text-brand-primary',
  },
  onDark: {
    pill: 'border-brand-gold bg-transparent',
    text: 'text-brand-cream',
    logo: 'text-brand-gold',
  },
} as const;

/**
 * "powered by SOFI AI" pill — outlined rounded badge shown next to the GIA logo
 * in the header, footer, and report layouts.
 */
export default function PoweredByPill({
  className = '',
  size = 'md',
  tone = 'default',
}: PoweredByPillProps): ReactElement {
  const s = SIZES[size];
  const c = TONES[tone];
  return (
    <div
      className={`flex w-auto items-center justify-center rounded-full border ${c.pill} ${s.pill} ${className}`}
    >
      <p
        className={`flex items-center gap-1.5 font-sans tracking-[-0.26px] ${c.text} ${s.text}`}
      >
        powered by
        <SofiLogo className={`${s.logo} w-auto ${c.logo}`} />
      </p>
    </div>
  );
}
