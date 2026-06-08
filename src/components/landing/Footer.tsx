'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { scrollToHashTarget } from '@/lib/scroll/navScroll';

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

export default function Footer(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const pathname = usePathname();

  // No backend yet — swallow the native submit (which was reloading the page
  // and jumping to the top) and just confirm the send in place. The email is
  // kept controlled so it stays put after sending.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setCodeSent(true);
  };

  return (
    <footer
      id="bg-stop-footer"
      className="flex w-full justify-center bg-white px-5 pt-10 pb-12 sm:px-8 md:px-16 md:pt-16 md:pb-20"
    >
      {/* Enclosing maroon panel — generous internal padding so the contents
          never crowd the rounded edges. */}
      <div className="bg-brand-primary flex w-[1152px] max-w-full flex-col gap-16 rounded-[32px] p-8 text-white sm:p-12 md:gap-24 md:rounded-[44px] md:p-16">
        {/* Top row: lead-magnet (left) + navigation (right) */}
        <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-16">
          {/* Lead-magnet column */}
          <form
            onSubmit={handleSubmit}
            className="flex w-[480px] max-w-full flex-col gap-[18px]"
          >
            <p className="font-sans text-[22px] leading-[1.35] font-semibold tracking-[-0.11px]">
              Not ready yet?
            </p>
            <p className="font-sans text-[14px] leading-[1.5] tracking-[-0.07px]">
              <span className="font-bold">Get the Superpower Code.</span> A free
              creator guide on understanding audience psychology, content
              signals, and growth patterns.
            </p>

            <input
              type="email"
              name="email"
              placeholder="user@mail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              // Locked once sent — the email stays visible but can't be edited
              // without a page refresh.
              readOnly={codeSent}
              className="text-brand-primary placeholder:text-brand-primary/50 h-[44px] w-full rounded-[25px] border border-white bg-white px-5 font-sans text-[14px] tracking-[-0.28px] read-only:cursor-not-allowed read-only:opacity-70"
            />
            {/* Fixed width so the label swap doesn't reflow the column. Once
                sent, the button rests disabled — overridden here to a black
                pill (the variant's default disabled dim stays for other onBrand
                buttons like the form's CONTINUE). */}
            <Button
              type="submit"
              variant="onBrand"
              size="default"
              disabled={codeSent}
              className="w-[210px] disabled:border-transparent! disabled:bg-black! disabled:text-white!"
            >
              {codeSent ? (
                <>
                  CODE SENT
                  <Check aria-hidden className="h-[16px] w-[16px]" />
                </>
              ) : (
                'RECEIVE CODE'
              )}
            </Button>
          </form>

          {/* Navigate column */}
          <nav className="flex w-[200px] flex-col gap-3 md:items-end md:text-right">
            <p className="pb-3 font-sans text-[18px] font-bold tracking-[-0.09px]">
              Navigate
            </p>
            {NAV_LINKS.map((link) => {
              const isHash = link.href.startsWith('#');
              const linkClassName =
                'font-sans text-[16px] leading-[1.45] font-medium tracking-[-0.08px] text-white/50 transition-colors hover:text-white';

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
          {/* GIA logo — masked so the maroon-fill SVG reads as cream on the
              maroon panel. */}
          <div
            role="img"
            aria-label="GIA"
            className="h-[88px] w-[166px] shrink-0 bg-white md:h-[104px] md:w-[196px]"
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
            <p className="font-sans text-[13px] leading-[1.5] tracking-[-0.065px] text-white/80">
              © 2026 GIA. All rights reserved. · Powered by SOFI
            </p>
            <div className="flex items-center gap-6">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-sans text-[13px] leading-[1.5] tracking-[-0.065px] text-white/80 transition-opacity hover:opacity-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
