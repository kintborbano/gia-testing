import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';

type AnalyzeTiktokButtonProps = {
  /** Extra classes (e.g. size overrides) merged after the defaults. */
  className?: string;
  href?: string;
  /**
   * Visual style. `hero` is the large outlined pill with an animated arrow;
   * `cta` is the compact pill with a brand-colored drop shadow.
   */
  variant?: 'hero' | 'cta';
};

const VARIANT_CLASSES: Record<
  NonNullable<AnalyzeTiktokButtonProps['variant']>,
  string
> = {
  hero: 'h-[60px] w-[266px] rounded-[34px] text-[16px] tracking-[-0.32px]',
  cta: 'h-[44px] w-[196px] rounded-[25px] text-[12px] tracking-[-0.24px]',
};

/**
 * Primary "analyze" CTA — outlined pill. Hovering rotates the arrow to point
 * up-right (north-east).
 */
export default function AnalyzeTiktokButton({
  className = '',
  href = '/action',
  variant = 'hero',
}: AnalyzeTiktokButtonProps): ReactElement {
  return (
    <a
      href={href}
      className={`group border-brand-primary text-brand-primary flex items-center justify-center border bg-white font-sans font-bold ${VARIANT_CLASSES[variant]} ${className}`}
    >
      ANALYZE MY TIKTOK
      <ArrowRight
        aria-hidden
        className="ml-[14px] h-[18px] w-[18px] transition-transform duration-200 ease-out group-hover:-rotate-45"
      />
    </a>
  );
}
