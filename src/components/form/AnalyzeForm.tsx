'use client';

import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import StickyHeader from '@/components/landing/StickyHeader';
import Button from '@/components/ui/Button';
import ScrollBackground from '@/components/landing/ScrollBackground';
import type { ScrollStop } from '@/components/landing/scrollBackground.config';
import { HEADER_HEIGHT_LARGE } from '@/animations/headerAnimations';

// White → cream as you scroll past the first screen — the exact transition the
// landing uses from the hero into features: the cream stop is anchored to its
// section TOP (align 0) nudged +0.5vh, fading over the last 55% of the gap.
const FORM_BG_STOPS: ScrollStop[] = [
  { anchorId: 'form-bg-hero', color: 'white' },
  {
    anchorId: 'form-bg-cream',
    color: 'cream',
    align: 0,
    offsetVh: 0.5,
    fade: 0.55,
  },
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
 * Pull a TikTok handle out of a profile URL. The input must be a tiktok.com
 * link (protocol and www optional) with the handle in the /@username path
 * segment — a bare username or @handle is rejected. Returns null otherwise so
 * the caller can reject it.
 */
function getReportHandle(value: string): string | null {
  const match = value
    .trim()
    .match(/^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([^/?#]+)/i);
  if (!match) return null;

  const handle = match[1];
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
function FieldError({
  message,
  onBrand = false,
}: {
  message?: string;
  onBrand?: boolean;
}): ReactElement | null {
  if (!message) return null;
  return (
    <p
      role="alert"
      className={`font-sans text-[13px] ${
        onBrand ? 'text-white' : 'text-brand-primary'
      }`}
    >
      {message}
    </p>
  );
}

function FieldLabel({
  label,
  helper,
  required = false,
}: {
  label: string;
  helper?: string;
  required?: boolean;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1.5 text-center">
      <p className="text-brand-primary font-sans text-[15px] font-bold tracking-[-0.075px]">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5">
            *
          </span>
        )}
      </p>
      {helper && (
        <p className="text-brand-primary font-sans text-[15px] leading-[1.45] font-medium tracking-[-0.075px]">
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
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [accountType, setAccountType] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [focus, setFocus] = useState('');
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const handle = getReportHandle(tiktok);
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Enter the email where we should send your report.';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!tiktok.trim()) {
      nextErrors.tiktok = 'Paste the TikTok account you want GIA to analyze.';
    } else if (!handle) {
      nextErrors.tiktok =
        'That doesn’t look like a TikTok profile link (e.g. https://www.tiktok.com/@username).';
    }
    if (!accountType) {
      nextErrors.accountType =
        "Let us know if this is your account or one you're browsing.";
    }
    if (!goal) {
      nextErrors.goal = 'Pick what you’re hoping to achieve.';
    }
    if (!agreed) {
      nextErrors.consent = 'Please agree before continuing.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    router.push(`/report/${handle}`);
  };

  return (
    <main
      className="flex w-full flex-1 flex-col"
      style={{ paddingTop: `${HEADER_HEIGHT_LARGE}px` }}
    >
      <ScrollBackground stops={FORM_BG_STOPS} />
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

          {/* Email — also the cream stop: the background is fully cream once
              this block's top reaches the viewport top. */}
          <div
            id="form-bg-cream"
            className="mt-8 flex w-full flex-col items-center gap-3.5"
          >
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
              placeholder="https://www.tiktok.com/@username"
              required
              value={tiktok}
              onChange={(event) => {
                setTiktok(event.target.value);
                clearError('tiktok');
              }}
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.tiktok} />

            <fieldset className="mt-4 flex flex-wrap items-start justify-center gap-x-12 gap-y-4">
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
                    className="accent-brand-primary size-[18px] shrink-0"
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

          {/* CTA */}
          <section className="bg-brand-primary mt-4 flex w-full max-w-[943px] flex-col items-center justify-center gap-6 rounded-[32px] px-8 py-12 text-center sm:px-12 sm:py-14 md:rounded-[44px] md:py-16">
            <h2 className="font-sans text-[28px] leading-[1.1] font-bold tracking-[-0.6px] text-white md:text-[32px]">
              Continue to checkout
            </h2>
            <label className="mx-auto flex w-fit cursor-pointer items-start gap-5 text-left">
              <input
                type="checkbox"
                name="consent"
                required
                checked={agreed}
                onChange={(event) => {
                  setAgreed(event.target.checked);
                  clearError('consent');
                }}
                className="mt-0.5 size-[18px] shrink-0 accent-white"
              />
              <span className="max-w-[600px] font-sans text-[15px] leading-[1.5] font-medium tracking-[-0.075px] text-white">
                By continuing, you agree that GIA will analyze publicly
                available TikTok content and engagement data to generate your
                personalized report.
              </span>
            </label>
            <FieldError message={errors.consent} onBrand />
            <Button type="submit" variant="onBrand" size="default" withArrow>
              CONTINUE
            </Button>
          </section>
        </div>
      </form>
    </main>
  );
}
