'use client';

import { useEffect } from 'react';
import StickyHeader from './StickyHeader';
import Footer from './Footer';
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
}: {
  children: React.ReactNode;
  /** Header background the sticky header adopts for this page. */
  headerBackground?: string;
  /** Header foreground (text/icons/logo). Omit to reset to the default maroon. */
  headerForeground?: string;
  /** Classes for the shell `<main>` — e.g. `bg-black` for a dark page. */
  surfaceClassName?: string;
  /** Render the shared footer. Set false on pages that stand on their own (e.g. the dark About page). */
  showFooter?: boolean;
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
      <div className="flex flex-1 flex-col justify-center py-10">
        {children}
      </div>
      {showFooter && <Footer />}
    </main>
  );
}
