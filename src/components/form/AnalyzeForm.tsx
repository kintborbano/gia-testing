'use client';

import { useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import StickyHeader from '@/components/landing/StickyHeader';
import Button from '@/components/ui/Button';
import { setPageBackgroundColor } from '@/stores/pageBackgroundStore';
import { HEADER_HEIGHT_LARGE } from '@/animations/headerAnimations';

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

/** Strip the URL/@ wrapping so we can route straight to the report. */
function getReportHandle(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?tiktok\.com\//i, '')
    .replace(/^@/, '')
    .split(/[/?]/)[0];
}

const INPUT_CLASSES =
  'h-[44px] w-full max-w-[459px] rounded-[25px] border border-brand-primary bg-white px-7 font-sans text-[15px] tracking-[-0.3px] text-brand-primary outline-none transition-shadow duration-200 placeholder:text-brand-primary/50 focus:ring-2 focus:ring-brand-primary/30';

function FieldLabel({
  label,
  helper,
}: {
  label: string;
  helper?: string;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1.5 text-center">
      <p className="text-brand-primary font-sans text-[15px] font-bold tracking-[-0.075px]">
        {label}
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
  const [error, setError] = useState('');

  // These pages have no ScrollBackground, so paint the shared background cream
  // to match the rest of the form surface.
  useEffect(() => {
    setPageBackgroundColor('rgb(254, 247, 221)');
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const handle = getReportHandle(tiktok);
    if (!handle) {
      setError('Paste the TikTok account you want GIA to analyze.');
      return;
    }
    setError('');
    router.push(`/report/${handle}`);
  };

  return (
    <main
      className="bg-brand-cream flex w-full flex-1 flex-col"
      style={{ paddingTop: `${HEADER_HEIGHT_LARGE}px` }}
    >
      <StickyHeader />

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-1 flex-col items-center px-5 pt-2 pb-10 sm:px-8 md:px-16"
      >
        <div className="flex w-full max-w-[1152px] flex-col items-center gap-10">
          {/* Hero + intro */}
          <div className="flex flex-col items-center gap-5 text-center">
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
          <div className="mt-8 flex w-full flex-col items-center gap-1.5">
            <FieldLabel
              label="EMAIL ADDRESS"
              helper="we'll send your report here"
            />
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="username@mail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={INPUT_CLASSES}
            />
          </div>

          {/* TikTok profile link */}
          <div className="flex w-full flex-col items-center gap-1.5">
            <FieldLabel
              label="TIKTOK PROFILE LINK"
              helper="paste the tiktok account you want gia to analyze"
            />
            <input
              type="text"
              name="tiktok"
              placeholder="https://www.tiktok.com/@username"
              value={tiktok}
              onChange={(event) => {
                setTiktok(event.target.value);
                if (error) setError('');
              }}
              className={INPUT_CLASSES}
            />
            {error && (
              <p className="text-brand-primary font-sans text-[13px]">
                {error}
              </p>
            )}

            <fieldset className="mt-4 flex flex-wrap items-start justify-center gap-x-12 gap-y-4">
              {ACCOUNT_TYPES.map(({ value, description }) => (
                <label
                  key={value}
                  className="flex max-w-[220px] cursor-pointer items-start gap-3"
                >
                  <input
                    type="radio"
                    name="accountType"
                    value={value}
                    checked={accountType === value}
                    onChange={() => setAccountType(value)}
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
          </div>

          {/* Goal */}
          <div className="flex w-full flex-col items-center gap-3">
            <FieldLabel label="WHAT ARE YOU HOPING TO ACHIEVE?" />
            <fieldset className="flex flex-col items-start gap-2">
              {GOALS.map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="radio"
                    name="goal"
                    value={value}
                    checked={goal === value}
                    onChange={() => setGoal(value)}
                    className="accent-brand-primary size-[18px] shrink-0"
                  />
                  <span className="text-brand-primary font-sans text-[14px] font-medium tracking-[-0.07px]">
                    {value}
                  </span>
                </label>
              ))}
            </fieldset>
          </div>

          {/* Optional focus */}
          <div className="flex w-full flex-col items-center gap-2">
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
            <h2 className="font-itc-garamond text-[28px] leading-[1.1] tracking-[-0.6px] text-white md:text-[32px]">
              continue to checkout
            </h2>
            <p className="max-w-[504px] font-sans text-[15px] leading-[1.5] font-medium tracking-[-0.075px] text-white">
              By continuing, you agree that GIA will analyze publicly available
              TikTok content and engagement data to generate your personalized
              report.
            </p>
            <Button type="submit" variant="onBrand" size="default" withArrow>
              CONTINUE
            </Button>
          </section>
        </div>
      </form>
    </main>
  );
}
