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
  /** Social icon button — resting/hover icon colour + hover background. */
  social: string;
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
  social: 'text-white/60 hover:bg-white/10 hover:text-white active:text-white',
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
    social:
      'text-brand-text/55 hover:bg-brand-text/10 hover:text-brand-text active:text-brand-text',
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

// Brand glyphs are inlined as filled 24×24 paths (lucide ships no brand icons)
// so they tint with `currentColor` like the rest of the footer art and share a
// single solid visual weight with the envelope. `aria-hidden` keeps them
// decorative — the enclosing <a> carries the accessible label.
function SocialGlyph({
  path,
  className = '',
}: {
  path: string;
  className?: string;
}): React.ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

// Listed in the order GIA promotes them — owned social first, contact last.
// `external` toggles the new-tab + noopener treatment; the contact link opens
// Gmail's web composer in a new tab like the other externals. Paths:
// Instagram/TikTok/Facebook from Simple Icons, envelope from the Material set —
// all single-colour, filled, 24×24.
const SOCIAL_LINKS = [
  {
    label: 'Follow GIA on Instagram',
    href: 'https://www.instagram.com/gia.sofi.ai/',
    external: true,
    path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0Zm0 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.069 1.646.069 4.85 0 3.205-.012 3.584-.069 4.85-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.069-4.85.069-3.204 0-3.584-.012-4.85-.069-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608-.058-1.266-.069-1.646-.069-4.85 0-3.204.012-3.584.069-4.85.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311 1.266-.058 1.646-.069 4.85-.069Zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z',
  },
  {
    label: 'Follow GIA on TikTok',
    href: 'https://www.tiktok.com/@gia.sofi.ai',
    external: true,
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
  {
    label: 'Follow GIA on Facebook',
    href: 'https://www.facebook.com/giasofiai',
    external: true,
    path: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  },
  {
    label: 'Email GIA',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=gia@sofitech.ai',
    external: true,
    path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  },
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

          {/* Right utility stack: the follow/contact icons cap the copyright +
              legal line, sitting directly above the Privacy / Terms links.
              Right-aligned on desktop to track those links; left-aligns to the
              column once the bottom row stacks on phones and tablets. */}
          <div className="flex flex-col gap-5 md:items-end">
            {/* 44px circular hit targets keep the glyphs comfortably tappable
                on phones and tablets; the row never wraps at its narrow width. */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {SOCIAL_LINKS.map(({ label, href, external, path }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${theme.social}`}
                >
                  <SocialGlyph path={path} className="h-[22px] w-[22px]" />
                </a>
              ))}
            </div>

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
      </div>

      <BroadcastPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </footer>
  );
}
