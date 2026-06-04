'use client';

import { useEffect } from 'react';
import StickyHeader from './StickyHeader';
import Footer from './Footer';
import { setPageBackgroundColor } from '@/stores/pageBackgroundStore';
import { HEADER_HEIGHT_LARGE } from '@/animations/headerAnimations';

/**
 * Shell for the standalone landing sub-pages (Meet GIA, Pricing, FAQ).
 * Renders the shared sticky header + footer and resets the scroll-driven
 * page background to white, since these pages have no ScrollBackground.
 */
export default function SubPageShell({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  useEffect(() => {
    setPageBackgroundColor('rgb(255, 255, 255)');
  }, []);

  return (
    <main
      className="flex w-full flex-1 flex-col"
      style={{ paddingTop: `${HEADER_HEIGHT_LARGE}px` }}
    >
      <StickyHeader />
      <div className="flex flex-1 flex-col justify-center py-10">
        {children}
      </div>
      <Footer />
    </main>
  );
}
