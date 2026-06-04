import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';

type AnalyzeTiktokButtonProps = {
  /** Extra classes (e.g. size overrides) merged after the defaults. */
  className?: string;
  href?: string;
};

/**
 * Primary "analyze" CTA — outlined pill. Hovering rotates the arrow to point
 * up-right (north-east).
 */
export default function AnalyzeTiktokButton({
  className = '',
  href = '/action',
}: AnalyzeTiktokButtonProps): ReactElement {
  return (
    <a
      href={href}
      className={`group border-brand-primary text-brand-primary flex h-[60px] w-[266px] items-center justify-center rounded-[34px] border bg-white font-sans text-[16px] font-bold tracking-[-0.32px] ${className}`}
    >
      ANALYZE MY TIKTOK
      <ArrowRight
        aria-hidden
        className="ml-[14px] h-[18px] w-[18px] transition-transform duration-200 ease-out group-hover:-rotate-45"
      />
    </a>
  );
}
