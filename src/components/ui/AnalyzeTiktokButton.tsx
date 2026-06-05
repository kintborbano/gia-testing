import type { ReactElement } from 'react';
import Button from './Button';

type AnalyzeTiktokButtonProps = {
  /** Extra classes (e.g. size overrides) merged after the defaults. */
  className?: string;
  href?: string;
  /**
   * `hero` is the large pill used in the hero; `cta` is the default-sized pill
   * used in the lower CTA section. Both are outlined with an animated arrow.
   */
  variant?: 'hero' | 'cta';
};

/**
 * Primary "analyze" CTA — outlined pill. Hovering rotates the arrow to point
 * up-right (north-east). Thin wrapper over the shared {@link Button}.
 */
export default function AnalyzeTiktokButton({
  className = '',
  href = '/action',
  variant = 'hero',
}: AnalyzeTiktokButtonProps): ReactElement {
  return (
    <Button
      href={href}
      variant="filledStatic"
      size={variant === 'hero' ? 'lg' : 'default'}
      withArrow
      className={`whitespace-nowrap ${className}`}
    >
      Analyze my TikTok
    </Button>
  );
}
