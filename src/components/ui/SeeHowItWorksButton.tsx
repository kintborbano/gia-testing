import type { ReactElement } from 'react';

type SeeHowItWorksButtonProps = {
  onClick?: () => void;
  /** Extra classes (e.g. size overrides) merged after the defaults. */
  className?: string;
};

/**
 * Secondary "see how it works" CTA — filled brand-primary pill. Hovering
 * inverts it to a white fill with brand-primary text.
 */
export default function SeeHowItWorksButton({
  onClick,
  className = '',
}: SeeHowItWorksButtonProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-brand-primary bg-brand-primary hover:text-brand-primary flex h-[60px] w-[266px] items-center justify-center rounded-[34px] border font-sans text-[16px] font-bold tracking-[-0.32px] text-white transition-[background-color,color] duration-200 ease-out hover:bg-white ${className}`}
    >
      SEE HOW IT WORKS
    </button>
  );
}
