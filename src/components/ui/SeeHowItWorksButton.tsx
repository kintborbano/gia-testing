import type { ReactElement } from 'react';
import Button from './Button';

type SeeHowItWorksButtonProps = {
  onClick?: () => void;
  /** Extra classes (e.g. size overrides) merged after the defaults. */
  className?: string;
};

/**
 * Secondary "see how it works" CTA — filled brand pill that inverts to a white
 * fill on hover. Thin wrapper over the shared {@link Button}.
 */
export default function SeeHowItWorksButton({
  onClick,
  className = '',
}: SeeHowItWorksButtonProps): ReactElement {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant="filled"
      size="lg"
      className={`w-[266px] ${className}`}
    >
      SEE HOW IT WORKS
    </Button>
  );
}
