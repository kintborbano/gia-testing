'use client';

import { useRef, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { usePageTransition } from '@/components/transition/PageTransitionProvider';
import StickyHeader from '@/components/landing/StickyHeader';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import ScrollBackground from '@/components/landing/ScrollBackground';
import type { ScrollStop } from '@/components/landing/scrollBackground.config';
import { HEADER_HEIGHT_LARGE } from '@/animations/headerAnimations';

// Static white background — no scroll-driven transition. A single stop keeps the
// fixed page-background fill and the header palette (white bg / maroon text)
// without ever changing color as you scroll.
const FORM_BG_STOPS: ScrollStop[] = [
  { anchorId: 'form-bg-hero', color: 'white' },
];

/** Single-select radio groups rendered in the form. */
const ACCOUNT_TYPES = [
  { value: 'my account', description: 'I want to grow my own content.' },
  {
    value: "i'm browsing",
    description: "I'm analyzing another creator's account.",
  },
] as const;

const GOALS = [
  'more views',
  'more followers',
  'more sales',
  'brand partnerships',
  'personal branding',
  'just curious',
] as const;

/** TikTok usernames: letters, numbers, underscores and periods, up to 24. */
const TIKTOK_HANDLE = /^[a-z0-9_.]{1,24}$/i;

/**
 * Pull a TikTok handle out of whatever people actually type — a bare
 * `username`, an `@username`, or a tiktok.com link (with or without the
 * protocol/`www`/`@`). Returns the clean handle, or null when there's nothing
 * recoverable so the caller can reject it.
 */
function extractHandle(value: string): string | null {
  let handle = value.trim();
  // Strip a tiktok.com/(@)username prefix if present, otherwise drop a lone @.
  const urlMatch = handle.match(
    /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@?([^/?#]+)/i
  );
  handle = urlMatch ? urlMatch[1] : handle.replace(/^@/, '');
  return TIKTOK_HANDLE.test(handle) ? handle : null;
}

/** Loose email shape check — enough to catch an empty/obviously wrong entry. */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Per-field validation messages, keyed by the field they belong to. */
type FormErrors = {
  email?: string;
  tiktok?: string;
  accountType?: string;
  goal?: string;
  consent?: string;
};

const INPUT_CLASSES =
  'h-[44px] w-full max-w-[459px] rounded-[25px] border border-brand-primary bg-white px-7 font-sans text-[15px] tracking-[-0.3px] text-brand-primary outline-none transition-shadow duration-200 placeholder:text-brand-primary/50 focus:ring-2 focus:ring-brand-primary/30';

/** Inline validation message shown beneath a field. */
function FieldError({ message }: { message?: string }): ReactElement | null {
  if (!message) return null;
  return (
    <p role="alert" className="font-sans text-[13px] text-red-500">
      {message}
    </p>
  );
}

function FieldLabel({
  label,
  helper,
  required = false,
  onBrand = false,
  align = 'center',
}: {
  label: string;
  helper?: string;
  required?: boolean;
  onBrand?: boolean;
  align?: 'center' | 'left';
}): ReactElement {
  const textColor = onBrand ? 'text-white' : 'text-brand-primary';
  const alignment =
    align === 'left' ? 'items-start text-left' : 'items-center text-center';
  return (
    <div className={`flex w-full flex-col gap-1.5 ${alignment}`}>
      <p
        className={`font-sans text-[15px] font-bold tracking-[-0.075px] ${textColor}`}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1.5 font-normal text-red-500">
            *
          </span>
        )}
      </p>
      {helper && (
        <p
          className={`font-sans text-[15px] leading-[1.45] font-medium tracking-[-0.075px] ${textColor}`}
        >
          {helper}
        </p>
      )}
    </div>
  );
}

/**
 * The "before gia starts watching…" intake form (Figma 77:80). Collects the
 * account to analyze plus context, then routes to the generated report.
 */
export default function AnalyzeForm(): ReactElement {
  const { navigate } = usePageTransition();
  // The maroon CTA section — the paint-bucket flood spreads out from its centre.
  const ctaRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [accountType, setAccountType] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [focus, setFocus] = useState('');
  const [instagram, setInstagram] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  /** Drop a single field's error once the user starts correcting it. */
  const clearError = (field: keyof FormErrors): void => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // Single source of truth for the form's validity: returns a message per
  // invalid field. Drives canSubmit, the per-field blur checks and submit.
  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!email.trim()) {
      e.email = 'Enter the email where we should send your report.';
    } else if (!isValidEmail(email)) {
      e.email = 'Enter a valid email address.';
    }
    if (!tiktok.trim()) {
      e.tiktok = 'Paste the TikTok account you want GIA to analyze.';
    } else if (!extractHandle(tiktok)) {
      e.tiktok =
        'That doesn’t look like a TikTok account — try a username or profile link.';
    }
    if (!accountType) {
      e.accountType =
        "Let us know if this is your account or one you're browsing.";
    }
    if (!goal) {
      e.goal = 'Pick what you’re hoping to achieve.';
    }
    if (!agreed) {
      e.consent = 'Please agree before continuing.';
    }
    return e;
  };

  // Surface a single field's warning once the user tabs away from it, so the
  // message shows without needing to submit (the button stays disabled).
  const handleBlur = (field: keyof FormErrors): void => {
    setErrors((prev) => ({ ...prev, [field]: validate()[field] }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    // Flood the screen with maroon out of the CTA section, then swipe up into
    // the loading screen (which carries the handle on to the report).
    const handle = extractHandle(tiktok);
    const rect = ctaRef.current?.getBoundingClientRect();
    const flood = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;
    navigate(`/loading?handle=${handle}`, flood ? { flood } : undefined);
  };

  // No outstanding errors — gates the submit button's disabled state.
  const canSubmit = Object.keys(validate()).length === 0;

  return (
    <main
      className="flex w-full flex-1 flex-col"
      style={{ paddingTop: `${HEADER_HEIGHT_LARGE}px` }}
    >
      <ScrollBackground stops={FORM_BG_STOPS} realBgStopCount={1} />
      <StickyHeader />

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-1 flex-col items-center px-5 pt-2 pb-10 sm:px-8 md:px-16"
      >
        <div className="flex w-full max-w-[1152px] flex-col items-center gap-10">
          {/* Hero + intro */}
          <div
            id="form-bg-hero"
            className="flex flex-col items-center gap-5 text-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/gia-on-laptop.png"
              alt="GIA studying a TikTok account at her laptop"
              className="h-auto w-[380px] max-w-full sm:w-[490px] md:w-[600px]"
            />
            <h1 className="font-itc-garamond text-brand-primary text-[42px] leading-[1.1] tracking-[-1.12px] sm:text-[56px] md:text-[68px]">
              before gia starts watching
              <span aria-hidden="true">
                .<span className="ellipsis-dot-2">.</span>
                <span className="ellipsis-dot-3">.</span>
              </span>
            </h1>
            <p className="text-brand-primary max-w-[736px] font-sans text-[18px] font-normal md:text-[20px]">
              tell us a little about the account you&apos;d like analyzed
            </p>
          </div>

          {/* Email */}
          <div className="mt-8 flex w-full flex-col items-center gap-3.5">
            <FieldLabel
              label="EMAIL ADDRESS"
              helper="we'll send your report here"
              required
            />
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="username@mail.com"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearError('email');
              }}
              onBlur={() => handleBlur('email')}
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.email} />
          </div>

          {/* TikTok profile link */}
          <div className="flex w-full flex-col items-center gap-3.5">
            <FieldLabel
              label="TIKTOK PROFILE LINK"
              helper="paste the tiktok account you want gia to analyze"
              required
            />
            <input
              type="text"
              name="tiktok"
              placeholder="@username or https://www.tiktok.com/@username"
              required
              value={tiktok}
              onChange={(event) => {
                setTiktok(event.target.value);
                clearError('tiktok');
              }}
              onBlur={() => handleBlur('tiktok')}
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.tiktok} />
          </div>

          {/* Account type */}
          <div className="flex w-full flex-col items-center gap-3.5">
            <FieldLabel label="WHOSE ACCOUNT IS THIS?" required />
            <fieldset className="flex flex-wrap items-start justify-center gap-x-12 gap-y-4">
              {ACCOUNT_TYPES.map(({ value, description }, index) => (
                <label
                  key={value}
                  className="flex max-w-[220px] cursor-pointer items-start gap-3"
                >
                  <input
                    type="radio"
                    name="accountType"
                    value={value}
                    required={index === 0}
                    checked={accountType === value}
                    onChange={() => {
                      setAccountType(value);
                      clearError('accountType');
                    }}
                    className="accent-brand-primary mt-0.5 size-[18px] shrink-0"
                  />
                  <span className="flex flex-col gap-1 text-left">
                    <span className="text-brand-primary font-sans text-[14px] font-medium tracking-[-0.07px]">
                      {value}
                    </span>
                    <span className="text-brand-primary font-sans text-[12px] leading-[1.4] tracking-[-0.06px]">
                      {description}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
            <FieldError message={errors.accountType} />
          </div>

          {/* Goal */}
          <div className="flex w-full flex-col items-center gap-3">
            <FieldLabel label="WHAT ARE YOU HOPING TO ACHIEVE?" required />
            <fieldset className="flex flex-col items-start gap-2">
              {GOALS.map((value, index) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="radio"
                    name="goal"
                    value={value}
                    required={index === 0}
                    checked={goal === value}
                    onChange={() => {
                      setGoal(value);
                      clearError('goal');
                    }}
                    className="border-brand-primary focus-visible:ring-brand-primary/30 checked:before:bg-brand-primary box-border inline-flex size-[18px] shrink-0 appearance-none items-center justify-center rounded-[4px] border bg-white leading-none transition-colors duration-150 outline-none before:block before:size-[10px] before:rounded-[2.5px] before:bg-transparent before:transition-colors before:duration-150 before:content-[''] focus-visible:ring-2"
                  />
                  <span className="text-brand-primary font-sans text-[14px] font-medium tracking-[-0.07px]">
                    {value}
                  </span>
                </label>
              ))}
            </fieldset>
            <FieldError message={errors.goal} />
          </div>

          {/* Optional focus */}
          <div className="flex w-full flex-col items-center gap-3.5">
            <FieldLabel label="ANYTHING YOU'D LIKE GIA TO FOCUS ON? (OPTIONAL)" />
            <textarea
              name="focus"
              rows={3}
              placeholder="like... why are my views dropping? or... why don't people follow after watching?... or what content should i make next?"
              value={focus}
              onChange={(event) => setFocus(event.target.value)}
              className="border-brand-primary text-brand-primary placeholder:text-brand-primary/50 focus:ring-brand-primary/30 w-full max-w-[459px] resize-none rounded-[25px] border bg-white px-7 py-3.5 font-sans text-[15px] tracking-[-0.3px] transition-shadow duration-200 outline-none focus:ring-2"
            />
          </div>

          {/* Instagram handle (Figma 111:224) */}
          <div className="flex w-full flex-col items-center gap-3.5">
            <FieldLabel
              label="INSTAGRAM HANDLE (OPTIONAL)"
              helper="we'll send your report here"
            />
            <input
              type="text"
              name="instagram"
              placeholder="@yourinstagramhandle"
              value={instagram}
              onChange={(event) => setInstagram(event.target.value)}
              className={INPUT_CLASSES}
            />
          </div>

          {/* CTA */}
          <section
            ref={ctaRef}
            className="bg-brand-primary mt-4 flex w-full max-w-[943px] flex-col items-center justify-center gap-10 rounded-[32px] px-8 py-12 text-center sm:px-12 sm:py-14 md:rounded-[44px] md:py-16"
          >
            <h2 className="font-young-serif text-[28px] leading-[1.1] tracking-[-0.6px] text-white md:text-[32px]">
              continue to checkout
            </h2>
            {/* Centered, content-width column for the checkbox and consent text. */}
            <div className="mx-auto flex w-fit flex-col items-center gap-3">
              <label className="flex cursor-pointer items-start gap-5 text-left">
                <Checkbox
                  name="consent"
                  required
                  checked={agreed}
                  onChange={(checked) => {
                    setAgreed(checked);
                    clearError('consent');
                  }}
                  className="mt-0.5"
                />
                <span className="max-w-[600px] font-sans text-[15px] leading-[1.5] font-medium tracking-[-0.075px] text-white">
                  By continuing, you agree that GIA will analyze publicly
                  available TikTok content and engagement data to generate your
                  personalized report.
                </span>
              </label>
              <FieldError message={errors.consent} />
            </div>
            <Button
              type="submit"
              variant="onBrand"
              size="default"
              withArrow
              disabled={!canSubmit}
              className="px-14"
            >
              CONTINUE
            </Button>
          </section>
        </div>
      </form>
    </main>
  );
}
