import { ArrowRight } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

export type ButtonVariant = 'filled' | 'outlined';
export type ButtonSize = 'sm' | 'default' | 'lg';

type BaseProps = {
  children: ReactNode;
  /** `filled` = brand fill, inverts on hover. `outlined` = white fill, inverts on hover. */
  variant?: ButtonVariant;
  /** sm 38px/13px · default 44px/14px · lg 60px/16px. */
  size?: ButtonSize;
  /** Appends an arrow that rotates north-east on hover. */
  withArrow?: boolean;
  /** Extra classes (e.g. a fixed `w-[...]`) merged after the defaults. */
  className?: string;
};

type ButtonAsLink = BaseProps & {
  href: string;
  type?: never;
  onClick?: never;
};

type ButtonAsButton = BaseProps & {
  href?: never;
  type?: 'button' | 'submit';
  onClick?: () => void;
};

export type ButtonProps = ButtonAsLink | ButtonAsButton;

const BASE =
  'group inline-flex shrink-0 items-center justify-center border font-sans font-bold tracking-[-0.02em] transition-[background-color,color] duration-200 ease-out';

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-[38px] gap-2 rounded-[25px] px-5 text-[13px]',
  default: 'h-[44px] gap-2.5 rounded-[25px] px-6 text-[14px]',
  lg: 'h-[60px] gap-[14px] rounded-[34px] px-8 text-[16px]',
};

const ARROW_SIZE: Record<ButtonSize, string> = {
  sm: 'h-[16px] w-[16px]',
  default: 'h-[16px] w-[16px]',
  lg: 'h-[18px] w-[18px]',
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  filled:
    'border-brand-primary bg-brand-primary text-white hover:bg-white hover:text-brand-primary',
  outlined:
    'border-brand-primary bg-white text-brand-primary hover:bg-brand-primary hover:text-white',
};

/**
 * The single source of truth for buttons across the site. Renders an anchor
 * when given `href`, otherwise a `<button>`.
 */
export default function Button(props: ButtonProps): ReactElement {
  const {
    children,
    variant = 'filled',
    size = 'default',
    withArrow = false,
    className = '',
  } = props;

  const classes = `${BASE} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`;

  const content = (
    <>
      {children}
      {withArrow && (
        <ArrowRight
          aria-hidden
          className={`${ARROW_SIZE[size]} transition-transform duration-200 ease-out group-hover:-rotate-45`}
        />
      )}
    </>
  );

  if ('href' in props && props.href) {
    return (
      <a href={props.href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      className={classes}
    >
      {content}
    </button>
  );
}
