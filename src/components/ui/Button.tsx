'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';
import { usePageTransition } from '@/components/transition/PageTransitionProvider';

export type ButtonVariant =
  | 'filled'
  | 'filledStatic'
  | 'outlined'
  | 'onBrand'
  | 'whiteStatic'
  | 'adaptive';
export type ButtonSize = 'sm' | 'default' | 'lg';

type BaseProps = {
  children: ReactNode;
  /** `filled` = brand fill, inverts on hover. `filledStatic` = brand fill, no color change on hover. `outlined` = white fill, inverts on hover. `onBrand` = white fill with brand text for use on a brand-colored surface; warms to cream on hover so it never blends in. `whiteStatic` = white fill, black border and text, no color change on hover (only the arrow moves). `adaptive` = fills with the live `--page-fg`/`--page-bg` CSS vars so it tracks the section palette (used in the sticky header); inverts on hover. */
  variant?: ButtonVariant;
  /** sm 38px/13px · default 48px/14px · lg 60px/16px. */
  size?: ButtonSize;
  /** Appends an arrow that rotates north-east on hover. */
  withArrow?: boolean;
  /** Extra classes (e.g. a fixed `w-[...]`) merged after the defaults. */
  className?: string;
  /**
   * For internal `href`s: play the loop page-transition overlay on click
   * instead of navigating instantly. No effect on external/hash links.
   */
  transition?: boolean;
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
  'group inline-flex shrink-0 items-center justify-center border font-sans font-bold tracking-[-0.02em] transition-[background-color,color,box-shadow] duration-200 ease-out';

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-[38px] gap-2 rounded-[25px] px-5 text-[13px]',
  default: 'h-[48px] gap-2.5 rounded-[25px] px-6 text-[14px]',
  lg: 'h-[60px] gap-[14px] rounded-[34px] px-8 text-[16px]',
};

const ARROW_SIZE: Record<ButtonSize, string> = {
  sm: 'h-[16px] w-[16px]',
  default: 'h-[16px] w-[16px]',
  lg: 'h-[20px] w-[20px]',
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  filled:
    'border-brand-primary bg-brand-primary text-white hover:bg-white hover:text-brand-primary',
  filledStatic: 'border-brand-primary bg-brand-primary text-white',
  outlined:
    'border-brand-primary bg-white text-brand-primary hover:bg-brand-primary hover:text-white',
  onBrand:
    'border-white bg-white text-brand-primary hover:border-black hover:bg-black hover:text-white',
  whiteStatic: 'border-black bg-white text-black',
  adaptive:
    'border-[color:var(--page-fg)] bg-[color:var(--page-fg)] text-[color:var(--page-bg)] hover:bg-[color:var(--page-bg)] hover:text-[color:var(--page-fg)]',
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
    transition = false,
  } = props;
  const { navigate } = usePageTransition();

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
    const { href } = props;
    // Internal route → next/link for client-side nav + prefetch. External URLs
    // and same-page hash anchors fall back to a plain anchor.
    if (href.startsWith('/')) {
      return (
        <Link
          href={href}
          className={classes}
          // onNavigate only fires on same-origin SPA navigation, so prefetch
          // and modifier-click (open-in-new-tab) keep working untouched.
          onNavigate={
            transition
              ? (e) => {
                  e.preventDefault();
                  navigate(href);
                }
              : undefined
          }
        >
          {content}
        </Link>
      );
    }
    return (
      <a href={href} className={classes}>
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
