'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button, { type ButtonVariant } from '@/components/ui/Button';
import BroadcastPopup from '@/components/landing/BroadcastPopup';
import { scrollToHashTarget } from '@/lib/scroll/navScroll';

/**
 * The footer paints two layers: an outer band (the page-colored margin around
 * the rounded panel) and the panel itself. `light` is the default maroon panel
 * on a white band — right for the light pages. `cream` keeps the same maroon
 * panel but paints the band cream so it melts into the cream pages (e.g.
 * Pricing). `dark` drops the band to transparent so it melts into a dark page
 * (e.g. About) instead of stamping a stale white block, and swaps the panel to
 * a cream card with maroon accents.
 */
export type FooterVariant = 'light' | 'cream' | 'dark';

type FooterTheme = {
  /** Outer `<footer>` band behind the panel. */
  band: string;
  /** Panel background + base text colour everything inherits. */
  panel: string;
  /** Lead-magnet input (border + fill + text + placeholder). */
  input: string;
  /** CONTINUE button palette. */
  button: ButtonVariant;
  /** Masked GIA logo fill. */
  logo: string;
  /** Nav link resting/hover/pressed colours. */
  navLink: string;
  /** Copyright + legal text colour. */
  meta: string;
};

// The maroon panel shared by every light-page variant; only the band differs.
const MAROON_PANEL: Omit<FooterTheme, 'band'> = {
  panel: 'bg-brand-primary text-white',
  input:
    'border-white bg-white text-brand-primary placeholder:text-brand-primary/50',
  button: 'onBrand',
  logo: 'bg-white',
  navLink: 'text-white/50 hover:text-white active:text-white',
  meta: 'text-white/80',
};

const FOOTER_THEME: Record<FooterVariant, FooterTheme> = {
  light: {
    band: 'bg-white',
    ...MAROON_PANEL,
  },
  cream: {
    band: 'bg-brand-cream',
    ...MAROON_PANEL,
  },
  dark: {
    band: 'bg-transparent',
    panel: 'bg-brand-cream text-brand-text',
    input:
      'border-brand-gold/40 bg-white text-brand-text placeholder:text-brand-text/40',
    button: 'onCream',
    logo: 'bg-brand-primary',
    navLink: 'text-brand-text/55 hover:text-brand-text active:text-brand-text',
    meta: 'text-brand-text/65',
  },
};

// Hash entries are stored bare (no leading slash) so the same-page handler can
// pass them straight to scrollToHashTarget; cross-page clicks get a '/' prefix
// to route home first. Mirrors the convention in StickyHeader.
const NAV_LINKS = [
  { label: 'GIA IN ACTION', href: '#bg-stop-action' },
  { label: 'HOW GIA WORKS', href: '#bg-stop-how' },
  { label: 'PRICING', href: '/pricing' },
  { label: 'FAQs', href: '/faq' },
  { label: 'ABOUT US', href: '/about' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
];

// Instagram handle rules: 1–30 chars of letters, numbers, periods, or
// underscores. A single leading '@' is tolerated and stripped before checking
// so users can type their handle either way.
const INSTAGRAM_PATTERN = /^[a-zA-Z0-9._]{1,30}$/;

export default function Footer({
  variant = 'light',
}: {
  variant?: FooterVariant;
} = {}): React.ReactElement {
  const theme = FOOTER_THEME[variant];
  const [username, setUsername] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const pathname = usePathname();

  const isUsernameValid = INSTAGRAM_PATTERN.test(
    username.trim().replace(/^@/, '')
  );

  // CONTINUE is step one of the lead magnet: capture the Instagram handle, then
  // open the popup that asks which TikTok profile to analyze. preventDefault
  // stops the native submit from reloading the page and jumping to the top.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsPopupOpen(true);
  };

  return (
    <footer
      id="bg-stop-footer"
      className={`flex w-full justify-center px-5 pt-10 pb-12 sm:px-8 md:px-16 md:pt-16 md:pb-20 ${theme.band}`}
    >
      {/* Enclosing panel — generous internal padding so the contents never
          crowd the rounded edges. Palette comes from the active footer theme. */}
      <div
        className={`flex w-[1152px] max-w-full flex-col gap-16 rounded-[32px] p-8 sm:p-12 md:gap-24 md:rounded-[44px] md:p-16 ${theme.panel}`}
      >
        {/* Top row: lead-magnet (left) + navigation (right) */}
        <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-16">
          {/* Lead-magnet column */}
          <form
            onSubmit={handleSubmit}
            className="flex w-[480px] max-w-full flex-col gap-[18px]"
          >
            <p className="font-sans text-[22px] leading-[1.35] font-semibold tracking-[-0.11px]">
              Want to be featured?
            </p>
            <p className="font-sans text-[14px] leading-[1.5] tracking-[-0.07px]">
              Enter your <span className="font-bold">Instagram</span> username,
              then tell us which TikTok Profile you want analyzed, and get a
              chance to get featured on our broadcast channel.
            </p>

            <input
              type="text"
              name="username"
              placeholder="@username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={`h-[44px] w-full rounded-[25px] border px-5 font-sans text-[14px] tracking-[-0.28px] ${theme.input}`}
            />
            {/* Fixed width keeps the column from reflowing. Disabled until the
                input reads a valid handle; clicking opens the TikTok-profile
                popup (BroadcastPopup) rather than submitting anywhere. */}
            <Button
              type="submit"
              variant={theme.button}
              size="default"
              disabled={!isUsernameValid}
              className="w-[180px] disabled:border-transparent!"
            >
              CONTINUE
            </Button>
          </form>

          {/* Navigate column */}
          <nav className="flex w-[200px] flex-col gap-3 md:items-end md:text-right">
            <p className="pb-3 font-sans text-[18px] font-bold tracking-[-0.09px]">
              Navigate
            </p>
            {NAV_LINKS.map((link) => {
              const isHash = link.href.startsWith('#');
              // The theme's `navLink` adds a click flash — the link snaps to
              // full strength while pressed, eased by transition-colors, before
              // the navigation/reload fires.
              const linkClassName = `font-sans text-[16px] leading-[1.45] font-medium tracking-[-0.08px] transition-colors ${theme.navLink}`;

              // Same-page hash click: ease to the section via Lenis. Going
              // through scrollToHashTarget (rather than letting the hash drive
              // the scroll) means re-clicking an already-visited section still
              // scrolls — the native hash is a no-op when it hasn't changed.
              if (isHash && pathname === '/') {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(event) => {
                      if (scrollToHashTarget(link.href)) event.preventDefault();
                    }}
                    className={linkClassName}
                  >
                    {link.label}
                  </a>
                );
              }

              // From another page a hash target must first route home.
              const linkHref = isHash ? `/${link.href}` : link.href;
              return (
                <Link
                  key={link.label}
                  href={linkHref}
                  // A `<Link>` to the route you're already on is a no-op, so
                  // clicking e.g. ABOUT US from the footer of /about does
                  // nothing. Force a full reload, which lands back at the top
                  // with fresh state (mirrors the logo handler in StickyHeader).
                  onClick={(event) => {
                    if (pathname === linkHref) {
                      event.preventDefault();
                      window.location.assign(linkHref);
                    }
                  }}
                  className={linkClassName}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom row: logo (left) + legal & attribution (right) */}
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
          {/* GIA logo — masked so the SVG paints in the theme's logo colour
              (white on the maroon panel, maroon on the cream one). */}
          <div
            role="img"
            aria-label="GIA"
            className={`h-[88px] w-[166px] shrink-0 md:h-[104px] md:w-[196px] ${theme.logo}`}
            style={{
              WebkitMaskImage: 'url(/logos/gia-logo.svg)',
              maskImage: 'url(/logos/gia-logo.svg)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'left center',
              maskPosition: 'left center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
            }}
          />

          {/* Copyright + legal links on one row, spaced apart */}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-2.5 md:justify-end">
            <p
              className={`font-sans text-[13px] leading-[1.5] tracking-[-0.065px] ${theme.meta}`}
            >
              © 2026 GIA. All rights reserved. · Powered by SOFI
            </p>
            <div className="flex items-center gap-6">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`font-sans text-[13px] leading-[1.5] tracking-[-0.065px] transition-opacity hover:opacity-100 ${theme.meta}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BroadcastPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </footer>
  );
}
