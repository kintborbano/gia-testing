'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { usePageTransition } from '@/components/transition/PageTransitionProvider';
import StickyHeader from '@/components/landing/StickyHeader';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import NotebookOption from '@/components/form/NotebookOption';
import ScrollBackground from '@/components/landing/ScrollBackground';
import type { ScrollStop } from '@/components/landing/scrollBackground.config';
import { HEADER_HEIGHT_LARGE } from '@/animations/headerAnimations';
import BetaGate from '@/components/auth/BetaGate';
import { isAuthenticated, clearToken } from '@/lib/auth';
import { api, ApiError } from '@/lib/api';

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

// Where the in-progress form is stashed so navigating away and back (e.g.
// hitting Back from the loading screen) restores what was typed. sessionStorage
// keeps it scoped to the tab and clears it on close, so email/handle aren't left
// in long-term storage.
const DRAFT_KEY = 'gia:analyze-form-draft';

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
  'h-[52px] w-full max-w-[459px] rounded-[15px] border-[3px] border-brand-gold bg-white px-6 font-sans text-[15px] tracking-[-0.3px] text-text outline-none shadow-[inset_0_0_0_2px_var(--color-text),inset_0_3px_5px_rgba(255,240,190,0.45),0_5px_0_var(--color-brand-gold-shadow)] placeholder:text-text/50';

/**
 * Inline validation message shown beneath a field. The paragraph is always
 * rendered with a reserved single-line height, so a warning appearing or
 * clearing never shifts the surrounding layout.
 */
function FieldError({ message }: { message?: string }): ReactElement {
  return (
    <p
      role="alert"
      className="font-pixelify min-h-[1.5rem] text-[14px] leading-[1.5rem] tracking-[0.3px] text-red-500"
    >
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
        className={`font-young-serif text-[17px] tracking-[-0.075px] ${textColor}`}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1.5 font-normal text-red-500">
            *
          </span>
        )}
      </p>
      {helper && (
        <p className="font-sans text-[15px] leading-[1.45] tracking-[-0.075px] text-[#1A1208]">
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
  const ctaRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [accountType, setAccountType] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [focus, setFocus] = useState('');
  const [instagram, setInstagram] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showGate, setShowGate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [freeSpent, setFreeSpent] = useState(false);

  // `restored` flips true only after the mount effect below has had a chance to
  // re-hydrate from a saved draft. The persist effect waits on it so the empty
  // starting state can't overwrite the draft before it's read back.
  const [restored, setRestored] = useState(false);

  // Restore a saved draft once, after hydration. Reading storage in an effect
  // (not during render) keeps the server-rendered empty form and the first
  // client render in agreement; the setState happens on the next tick so it
  // stays out of the effect body (which the lint rules flag as a cascading
  // render).
  useEffect(() => {
    const apply = setTimeout(() => {
      try {
        const raw = sessionStorage.getItem(DRAFT_KEY);
        if (raw) {
          const d = JSON.parse(raw) as Record<string, unknown>;
          if (typeof d.email === 'string') setEmail(d.email);
          if (typeof d.tiktok === 'string') setTiktok(d.tiktok);
          if (typeof d.accountType === 'string') setAccountType(d.accountType);
          if (typeof d.goal === 'string') setGoal(d.goal);
          if (typeof d.focus === 'string') setFocus(d.focus);
          if (typeof d.instagram === 'string') setInstagram(d.instagram);
          if (typeof d.agreed === 'boolean') setAgreed(d.agreed);
        }
      } catch {
        // Corrupt or unavailable storage — start with a blank form.
      }
      setRestored(true);
    }, 0);
    return () => clearTimeout(apply);
  }, []);

  // Persist the draft as the user fills it in (only once the restore above has
  // run). Transient state — errors, submit status, the gate — is intentionally
  // left out; only the user's actual answers are saved.
  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          email,
          tiktok,
          accountType,
          goal,
          focus,
          instagram,
          agreed,
        })
      );
    } catch {
      // Quota or private-mode failures are non-fatal for a convenience save.
    }
  }, [restored, email, tiktok, accountType, goal, focus, instagram, agreed]);

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

  const doAnalyze = async (): Promise<void> => {
    const handle = extractHandle(tiktok);
    if (!handle) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const profileUrl = `https://www.tiktok.com/@${handle}`;
      const { job_id } = await api.startAnalysis(profileUrl, {
        email: email.trim(),
        goal,
        accountType,
      });
      const rect = ctaRef.current?.getBoundingClientRect();
      const flood = rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : undefined;
      navigate(
        `/loading?job_id=${job_id}&handle=${encodeURIComponent(handle)}`,
        flood ? { flood } : undefined
      );
    } catch (err) {
      // 401 = expired/invalid token (API client already cleared it).
      // 403 = analysis quota spent. If the user was authenticated (Google free
      // run), flag freeSpent so the gate hides the Google door on re-open.
      if (
        err instanceof ApiError &&
        (err.status === 401 || err.status === 403)
      ) {
        const wasAuthed = isAuthenticated();
        clearToken();
        if (err.status === 403 && wasAuthed) setFreeSpent(true);
        setShowGate(true);
        setSubmitting(false);
        return;
      }
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : 'Something went wrong. Please try again.'
      );
      setSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    if (!isAuthenticated()) {
      setShowGate(true);
      return;
    }
    doAnalyze();
  };

  const canSubmit = Object.keys(validate()).length === 0 && !submitting;

  return (
    <main
      className="flex w-full flex-1 flex-col"
      style={{ paddingTop: `${HEADER_HEIGHT_LARGE}px` }}
    >
      <ScrollBackground stops={FORM_BG_STOPS} />
      <StickyHeader />

      {/* Rough-edge filter for the notebook radio options (dots + strikethrough).
          Rendered once, off-screen; referenced via filter: url(#handDrawnNoise). */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute h-0 w-0"
      >
        <filter id="handDrawnNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.04"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={3}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-1 flex-col items-center px-5 pt-2 pb-10 sm:px-8 md:px-16"
      >
        <div className="flex w-full max-w-[1152px] flex-col items-center gap-14">
          {/* Hero + intro */}
          <div
            id="form-bg-hero"
            className="flex flex-col items-center gap-5 text-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/gia-writing-notebook.png"
              alt="GIA studying a TikTok account at her laptop"
              className="h-auto w-[380px] max-w-full sm:w-[490px] md:w-[600px]"
            />
            <h1 className="font-young-serif text-brand-primary text-[32px] leading-[1.1] tracking-[-1.12px] sm:text-[44px] md:text-[56px]">
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
              onBlur={() => handleBlur('email')}
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.email} />
          </div>

          {/* TikTok profile link */}
          <div className="flex w-full flex-col items-center gap-3.5">
            <FieldLabel
              label="TIKTOK USERNAME"
              helper="enter the @username you want gia to analyze"
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
            <fieldset className="mt-3 flex flex-col items-start gap-4">
              {ACCOUNT_TYPES.map(({ value, description }, index) => (
                <NotebookOption
                  key={value}
                  name="accountType"
                  value={value}
                  label={value}
                  description={description}
                  required={index === 0}
                  checked={accountType === value}
                  onChange={() => {
                    setAccountType(value);
                    clearError('accountType');
                  }}
                />
              ))}
            </fieldset>
            <FieldError message={errors.accountType} />
          </div>

          {/* Goal */}
          <div className="flex w-full flex-col items-center gap-3">
            <FieldLabel label="WHAT ARE YOU HOPING TO ACHIEVE?" required />
            <fieldset className="mt-3 flex flex-col items-start gap-2">
              {GOALS.map((value, index) => (
                <NotebookOption
                  key={value}
                  name="goal"
                  value={value}
                  label={value}
                  required={index === 0}
                  checked={goal === value}
                  onChange={() => {
                    setGoal(value);
                    clearError('goal');
                  }}
                />
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
              className="border-brand-gold text-text placeholder:text-text/50 mx-auto w-full max-w-[680px] resize-none rounded-[15px] border-[3px] bg-white px-8 py-5 text-left font-sans text-[14px] leading-[1.45] tracking-[-0.2px] shadow-[inset_0_0_0_2px_var(--color-text),inset_0_3px_5px_rgba(255,240,190,0.45),0_5px_0_var(--color-brand-gold-shadow)] outline-none md:text-[15px]"
            />
          </div>

          {/* Instagram handle (Figma 111:224) */}
          <div className="flex w-full flex-col items-center gap-3.5">
            <FieldLabel label="INSTAGRAM HANDLE (OPTIONAL)" />
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
              get your analysis
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
                <span className="max-w-[600px] font-sans text-[17px] leading-[1.5] font-medium tracking-[-0.075px] text-white">
                  By continuing, you agree that GIA will analyze publicly
                  available TikTok content and engagement data to generate your
                  personalized report.
                </span>
              </label>
              <FieldError message={errors.consent} />
            </div>
            {submitError && (
              <p
                role="alert"
                className="font-pixelify text-[14px] text-red-300"
              >
                {submitError}
              </p>
            )}
            <Button
              type="submit"
              variant="onBrand"
              size="default"
              withArrow
              disabled={!canSubmit}
              className="-mt-4 px-14"
            >
              {submitting ? 'ANALYZING…' : 'CONTINUE'}
            </Button>
          </section>
        </div>
      </form>

      {showGate && (
        <BetaGate
          freeSpent={freeSpent}
          profileUrl={`https://www.tiktok.com/@${extractHandle(tiktok) ?? ''}`}
          onSuccess={() => {
            setShowGate(false);
            doAnalyze();
          }}
          onClose={() => setShowGate(false)}
        />
      )}
    </main>
  );
}
