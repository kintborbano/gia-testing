'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/Button';
import { startLenis, stopLenis } from '@/lib/scroll/lenisControls';

// TikTok handle rules: 2–24 chars of letters, numbers, periods, or
// underscores. A single leading '@' is tolerated and stripped before checking
// so users can type their handle either way. Mirrors the Instagram gate in
// Footer.tsx.
const TIKTOK_PATTERN = /^[a-zA-Z0-9._]{2,24}$/;

// Where the form sends visitors on submit — the GIA Instagram broadcast channel.
const BROADCAST_CHANNEL_URL =
  'https://www.instagram.com/channel/AbaXwsrEEM1hoSpY/';

type BroadcastPopupProps = {
  /** Whether the modal is mounted and visible. */
  open: boolean;
  /** Called on backdrop click, Escape, or the close button. */
  onClose: () => void;
};

/**
 * The "which TikTok profile should we analyze?" overlay — step two of the
 * footer lead magnet. Opened once a visitor submits their Instagram handle in
 * Footer.tsx. Renders into a portal on document.body so the maroon card sits
 * above the page regardless of the footer's stacking context, and freezes Lenis
 * while open so the background can't scroll underneath. (Figma: "Footer Pop-Up").
 */
export default function BroadcastPopup({
  open,
  onClose,
}: BroadcastPopupProps): React.ReactElement | null {
  const [tiktok, setTiktok] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isTiktokValid = TIKTOK_PATTERN.test(tiktok.trim().replace(/^@/, ''));

  // While open: close on Escape, freeze the background scroll, and focus the
  // field. Restoring Lenis on cleanup means it always resumes, even if the
  // parent unmounts the popup directly rather than calling onClose.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    stopLenis();
    inputRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      startLenis();
    };
  }, [open, onClose]);

  // No backend yet — swallow the native submit, lock the form, then send the
  // user to the Instagram broadcast channel (as the footnote promises).
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    window.location.assign(BROADCAST_CHANNEL_URL);
  };

  // `open` only flips true from a client-side click, so there's no SSR render to
  // mismatch; the document guard keeps createPortal safe regardless.
  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="broadcast-popup-title"
      // The backdrop closes on a bare click; clicks inside the card stop
      // propagating so they never bubble up to this handler.
      onClick={onClose}
      data-lenis-prevent
      className="broadcast-popup-backdrop fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 px-5 py-10 backdrop-blur-sm"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="broadcast-popup-card bg-brand-primary relative flex w-[768px] max-w-full flex-col gap-[17px] rounded-[32px] px-8 py-14 text-white sm:px-12 sm:py-16 md:rounded-[44px] md:px-[77px] md:py-20"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-6 text-[26px] leading-none text-white/60 transition-colors hover:text-white md:top-7 md:right-9"
        >
          &times;
        </button>

        <h2
          id="broadcast-popup-title"
          className="font-young-serif text-[26px] leading-[1.1] tracking-[-0.5px] sm:text-[30px]"
        >
          which tiktok profile should we analyze?
        </h2>
        <p className="mt-2 font-sans text-[15px] leading-[1.45] font-medium tracking-[-0.075px] sm:mt-3">
          Enter the TikTok username you want us to review. We&rsquo;ll look at
          the account&rsquo;s content signals, audience patterns, and growth
          opportunities.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[17px]">
          <input
            ref={inputRef}
            type="text"
            name="tiktok"
            placeholder="@tiktokusername"
            value={tiktok}
            onChange={(event) => setTiktok(event.target.value)}
            // Locked once sent — the handle stays visible but can't be edited.
            readOnly={submitted}
            className="text-brand-primary placeholder:text-brand-primary/50 h-[44px] w-full rounded-[25px] border border-white bg-white px-7 font-sans text-[15px] tracking-[-0.3px] read-only:cursor-not-allowed read-only:opacity-70"
          />
          <Button
            type="submit"
            variant="onBrand"
            size="default"
            disabled={submitted || !isTiktokValid}
            className="w-full text-[12px] disabled:border-transparent! sm:w-[336px]"
          >
            {submitted ? 'SUBMITTED' : 'SUBMIT AND JOIN BROADCAST CHANNEL'}
          </Button>
        </form>

        <p className="font-sans text-[15px] leading-[1.45] font-medium tracking-[-0.075px] text-white/50">
          After submitting, you&rsquo;ll be redirected to our Instagram
          broadcast channel.
        </p>
      </div>
    </div>,
    document.body
  );
}
