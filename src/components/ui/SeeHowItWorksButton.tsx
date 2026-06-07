import type { ReactElement } from 'react';

type SeeHowItWorksButtonProps = {
  onClick?: () => void;
  /** Extra classes (e.g. size overrides) merged after the defaults. */
  className?: string;
};

/**
 * Secondary "see how it works" CTA — plain underlined text link, no pill.
 */
export default function SeeHowItWorksButton({
  onClick,
  className = '',
}: SeeHowItWorksButtonProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-brand-primary font-sans text-base font-bold tracking-[-0.02em] underline underline-offset-4 transition-opacity duration-200 ease-out hover:opacity-70 ${className}`}
    >
      See how it works
    </button>
  );
}
