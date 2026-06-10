'use client';

import { useEffect } from 'react';
import StickyHeader from './StickyHeader';
import Footer, { type FooterVariant } from './Footer';
import {
  setPageBackgroundColor,
  setPageColors,
} from '@/stores/pageBackgroundStore';
import { HEADER_HEIGHT_LARGE } from '@/animations/headerAnimations';

/**
 * Shell for the standalone landing sub-pages (Meet GIA, Pricing, FAQ, About).
 * Renders the shared sticky header + footer and resets the scroll-driven page
 * background, since these pages have no ScrollBackground of their own.
 *
 * Defaults to a light header (white background, default maroon foreground). A
 * page with a dark design (e.g. About) passes `headerBackground` +
 * `headerForeground` to flip the header to its dark palette, and
 * `surfaceClassName="bg-black"` so the whole shell — including the area behind
 * the collapsing header — paints dark behind the content.
 */
export default function SubPageShell({
  children,
  headerBackground = 'rgb(255, 255, 255)',
  headerForeground,
  surfaceClassName = '',
  showFooter = true,
  footerVariant = 'light',
  flushContent = false,
}: {
  children: React.ReactNode;
  /** Header background the sticky header adopts for this page. */
  headerBackground?: string;
  /** Header foreground (text/icons/logo). Omit to reset to the default maroon. */
  headerForeground?: string;
  /** Classes for the shell `<main>` — e.g. `bg-black` for a dark page. */
  surfaceClassName?: string;
  /** Render the shared footer. Set false on pages that stand on their own. */
  showFooter?: boolean;
  /** Footer palette. `dark` drops the white band and swaps the maroon panel for a cream card with maroon accents on dark pages (e.g. About). */
  footerVariant?: FooterVariant;
  /**
   * Drop the default centered `py-10` content wrapper so the page sits flush
   * under the header and owns its own top spacing — matching the form, whose
   * hero image sits just below the header. Used by the About page.
   */
  flushContent?: boolean;
}): React.ReactElement {
  useEffect(() => {
    if (headerForeground) {
      setPageColors({
        background: headerBackground,
        foreground: headerForeground,
      });
    } else {
      setPageBackgroundColor(headerBackground);
    }
  }, [headerBackground, headerForeground]);

  return (
    <main
      className={`flex w-full flex-1 flex-col ${surfaceClassName}`}
      style={{ paddingTop: `${HEADER_HEIGHT_LARGE}px` }}
    >
      <StickyHeader />
      <div
        className={
          flushContent
            ? 'flex flex-1 flex-col'
            : 'flex flex-1 flex-col justify-center py-10'
        }
      >
        {children}
      </div>
      {showFooter && <Footer variant={footerVariant} />}
    </main>
  );
}
