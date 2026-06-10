'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { usePageTransition } from '@/components/transition/PageTransitionProvider';

// Gold outline CTA used in the two lower sections — translucent dark fill with a
// gold border/text, inverting to a solid gold pill on hover. Internal routes go
// through the shared page transition so it matches every other CTA on the site.
function AboutCta({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}): React.ReactElement {
  const { navigate } = usePageTransition();
  const isExternal = /^https?:\/\//.test(href);
  const className =
    'group bg-text/20 border-brand-gold text-brand-gold hover:bg-brand-gold inline-flex h-[44px] items-center gap-3 self-start rounded-[25px] border-[2.5px] px-6 font-sans text-[12px] font-bold tracking-[-0.24px] uppercase transition-colors hover:text-black';
  const arrow = (
    <ArrowRight
      aria-hidden
      className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-rotate-45"
    />
  );

  // External links open in a new tab and skip the in-app page transition;
  // internal routes go through the shared transition like every other CTA.
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
      >
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onNavigate={(event) => {
        event.preventDefault();
        navigate(href);
      }}
      className={className}
    >
      {children}
      {arrow}
    </Link>
  );
}

// SOFI wordmark, inlined from public/logos/sofi-teal-logo.svg with a tight
// viewBox (the source is a square canvas with the mark in a centered band) so
// it sits flush in the heading. Original two-tone fills are preserved.
function SofiLogo({ className }: { className?: string }): React.ReactElement {
  return (
    <svg
      viewBox="115 346 855 347"
      fill="#ffffff"
      role="img"
      aria-label="SOFI AI"
      className={className}
    >
      <path d="M 909.54 357.75 C 918.83 356.16 928.77 356.53 937.43 360.55 C 948.44 364.62 957.03 374.68 959.53 386.13 C 961.49 395.74 960.03 406.21 954.53 414.44 C 949.32 422.24 941.09 428.00 931.98 430.22 C 922.16 432.76 911.63 432.25 902.07 428.92 C 893.04 425.54 885.19 418.73 881.13 409.92 C 877.03 400.94 876.79 390.33 880.13 381.07 C 884.87 368.65 896.70 360.18 909.54 357.75 Z" />
      <path d="M 497.21 389.36 C 506.64 385.26 516.81 383.11 527.01 382.18 C 539.30 381.26 551.16 385.62 562.04 390.87 C 572.90 396.09 583.00 402.68 593.56 408.45 C 602.91 413.75 612.78 418.21 621.55 424.49 C 630.30 430.22 639.14 436.05 646.46 443.60 C 651.09 448.74 654.95 454.68 657.27 461.23 C 659.79 467.87 662.15 474.82 661.86 482.03 C 661.73 513.66 662.18 545.30 661.34 576.92 C 661.20 583.44 660.81 590.15 658.20 596.21 C 652.31 611.05 640.51 622.73 627.52 631.58 C 620.03 636.22 612.66 641.20 604.47 644.50 C 599.62 647.37 594.74 650.18 589.69 652.68 C 587.67 651.25 586.94 648.21 585.66 646.04 C 593.87 636.11 598.11 623.50 600.21 610.95 C 601.13 599.29 602.88 587.67 602.79 575.95 C 604.19 553.03 603.37 530.02 603.52 507.05 C 603.84 501.02 602.06 495.11 599.25 489.83 C 596.44 485.10 592.13 481.53 587.99 478.01 C 581.83 472.45 574.21 468.98 567.22 464.62 C 542.67 449.91 517.79 435.68 493.75 420.16 C 483.62 415.37 472.16 413.62 461.02 414.42 C 459.77 412.24 458.59 410.02 457.43 407.80 C 470.27 400.81 483.87 395.33 497.21 389.36 Z" />
      <path d="M 172.59 401.40 C 186.06 394.73 201.07 392.12 215.88 390.51 C 235.56 388.93 255.52 390.85 274.48 396.37 C 293.15 402.50 310.53 413.87 321.76 430.21 C 330.76 443.35 334.90 459.24 335.82 475.00 C 310.86 475.00 285.90 475.00 260.95 475.00 C 260.25 467.81 258.23 460.29 252.77 455.19 C 244.42 446.76 231.54 444.31 220.15 446.20 C 212.19 447.58 203.94 452.13 201.08 460.12 C 198.27 468.08 198.07 477.74 203.28 484.80 C 207.84 491.27 215.27 494.62 222.19 497.95 C 235.40 504.05 249.41 508.04 263.08 512.95 C 272.92 516.48 282.66 520.32 292.18 524.65 C 304.78 530.12 316.11 538.51 324.76 549.21 C 333.54 559.02 338.00 572.06 339.07 585.03 C 340.90 605.71 335.57 627.28 322.74 643.78 C 312.82 657.00 298.61 666.48 283.44 672.72 C 257.60 682.62 228.92 682.79 202.06 677.31 C 185.53 673.90 169.49 667.28 156.19 656.78 C 147.17 649.36 139.18 640.45 133.90 629.97 C 128.04 618.57 125.44 605.74 125.00 593.00 C 149.58 593.01 174.16 592.98 198.74 593.02 C 199.76 602.68 203.51 612.58 211.44 618.65 C 219.46 624.87 230.17 625.96 239.98 625.27 C 249.51 624.45 259.57 619.99 264.12 611.14 C 268.90 601.83 267.96 589.18 260.27 581.67 C 253.64 575.15 245.20 570.79 236.52 567.68 C 218.43 561.06 199.66 556.41 181.88 548.94 C 170.04 544.43 158.66 538.38 149.30 529.74 C 139.35 520.67 131.12 509.17 128.22 495.82 C 123.99 477.07 125.14 456.73 133.12 439.11 C 140.92 422.13 155.93 409.30 172.59 401.40 Z" />
      <path d="M 684.34 392.01 C 745.99 391.99 807.64 392.01 869.29 392.00 C 869.29 410.42 869.29 428.83 869.29 447.25 C 830.72 447.21 792.15 447.34 753.58 447.18 C 753.41 467.20 753.55 487.22 753.51 507.24 C 782.39 507.24 811.26 507.24 840.13 507.24 C 840.15 525.16 840.14 543.08 840.14 561.00 C 811.26 561.00 782.39 561.00 753.51 561.00 C 753.51 599.33 753.50 637.66 753.52 675.99 C 730.46 676.01 707.40 675.99 684.34 676.00 C 684.34 581.33 684.35 486.67 684.34 392.01 Z" />
      <path d="M 884.29 682.99 C 884.31 607.16 884.27 531.32 884.31 455.49 C 907.51 455.50 930.71 455.49 953.91 455.50 C 953.92 531.33 953.91 607.16 953.91 683.00 C 930.70 683.00 907.49 683.01 884.29 682.99 Z" />
      <path
        fill="#00c6a5"
        d="M 390.98 447.94 C 401.68 439.77 413.60 433.43 424.77 425.97 C 425.78 427.78 426.75 429.61 427.72 431.46 C 420.87 438.65 415.85 447.97 415.03 457.97 C 412.15 472.16 413.92 486.69 412.72 501.02 C 412.53 512.68 412.40 524.35 412.76 536.01 C 413.75 546.00 412.49 556.14 414.48 566.05 C 416.09 575.75 420.80 584.66 426.48 592.57 C 432.09 601.09 439.64 608.10 447.46 614.55 C 454.99 619.70 462.19 625.35 470.09 629.96 C 480.50 636.21 490.96 642.38 501.57 648.30 C 508.32 652.04 515.55 654.85 522.38 658.46 C 531.65 663.22 542.32 664.53 552.62 663.53 C 553.94 666.04 555.28 668.54 556.57 671.08 C 540.92 678.58 525.07 685.61 508.94 691.97 C 498.60 695.32 487.46 694.88 476.86 693.11 C 458.91 689.45 442.17 681.24 427.37 670.56 C 410.41 660.78 392.91 651.72 377.38 639.68 C 369.04 633.37 360.79 625.42 358.34 614.87 C 355.20 601.10 357.19 586.90 355.64 572.99 C 355.12 563.65 355.64 554.28 354.74 544.97 C 354.85 528.62 354.57 512.27 354.60 495.92 C 354.73 485.80 359.20 476.21 365.65 468.58 C 372.27 459.69 382.09 454.21 390.98 447.94 Z"
      />
    </svg>
  );
}

// Shared two-column block for the lower sections: a heading + CTA column on the
// left and a body column on the right, stacking on phones.
function InfoSection({
  eyebrow,
  heading,
  cta,
  children,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  cta: React.ReactNode;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex w-full max-w-[1152px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-[54px]">
      <div className="flex flex-col gap-6 lg:w-[460px] lg:shrink-0">
        <p className="text-brand-secondary font-sans text-[15px] leading-[1.45] font-bold tracking-[-0.075px]">
          {eyebrow}
        </p>
        <h2 className="font-young-serif text-[40px] leading-[1.1] tracking-[-1.12px] md:text-[56px]">
          {heading}
        </h2>
        {cta}
      </div>
      <div className="flex flex-col gap-5 font-sans text-[16px] leading-[1.55] md:text-[20px] lg:w-[449px] lg:min-w-0">
        {children}
      </div>
    </div>
  );
}

export default function AboutUs(): React.ReactElement {
  return (
    <section
      id="bg-stop-about"
      className="flex w-full flex-col items-center gap-20 bg-black px-5 pt-2 pb-10 text-white sm:px-8 md:gap-[93px] md:px-12"
    >
      {/* Hero — illustration, eyebrow, headline, and the pull-quote. The image
          sits flush under the header, sized and spaced like the form's hero. */}
      <div className="flex w-full max-w-[1152px] flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <Image
            src="/images/gia-phone-sitting.png"
            alt="GIA, the SOFI AI analyst, working at her desk"
            width={1536}
            height={1024}
            priority
            className="h-auto w-[400px] max-w-full sm:w-[540px] md:w-[680px]"
          />
          <p className="font-sans text-[15px] leading-[1.45] font-bold tracking-[-0.075px]">
            ABOUT US
          </p>
          <h1 className="font-young-serif text-[32px] leading-[1.1] tracking-[-1.12px] sm:text-[44px] md:text-[56px]">
            {`your data, finally `}
            <span className="text-brand-secondary">making sense.</span>
          </h1>
        </div>
        <p className="max-w-[749px] text-center font-sans text-[16px] leading-[1.5] md:text-[20px]">
          {`“Most creators already know their numbers. Views. Likes. Engagement rate. `}
          <br />
          <span className="font-bold">
            But knowing the numbers isn’t the same as understanding them
          </span>
          <br />
          <span className="font-bold">…exactly why GIA exists.</span>
          {`”`}
        </p>
      </div>

      {/* About SOFI AI */}
      <InfoSection
        eyebrow="ABOUT US"
        heading={
          <>
            {`powered by `}
            <br />
            <SofiLogo className="mt-2 inline-block h-[34px] w-auto align-middle md:h-[48px]" />
          </>
        }
        cta={<AboutCta href="https://sofitech.ai/">LEARN MORE</AboutCta>}
      >
        <p>
          <span className="text-brand-gold font-bold">
            SOFI AI Tech Solution Inc.
          </span>
          {` is an AI solutions company helping businesses implement AI — from `}
          <span className="text-brand-gold font-bold">
            sales to operations to customer experience.
          </span>
          {` We build systems that make companies scale smarter, faster, and more efficient.`}
        </p>
        <p>
          {`But we also believe that `}
          <span className="text-brand-gold font-bold">
            AI should work for the individuals…not just the enterprises.
          </span>
        </p>
        <p>
          {`GIA is that belief, built into a product. Created for creators and businesses who want to understand not just how their content is performing, but why. Because behind every view count, every save, every comment — there’s a story. And `}
          <span className="text-brand-gold font-bold">
            most tools stop at the numbers. We don’t.
          </span>
        </p>
        <p className="text-brand-secondary font-bold">
          Data tells stories. GIA is here to help you understand them.
        </p>
      </InfoSection>

      {/* About GIA */}
      <InfoSection
        eyebrow="ABOUT GIA"
        heading={
          // The G/I/A initials each sit in an equal-width, centered box so they
          // line up as a vertical "GIA" despite the serif's uneven letter widths
          // (the narrow "I" would otherwise drift left). The lowercase tails start
          // at the shared box edge, so they align too.
          <span>
            <span className="text-brand-gold inline-block w-[0.8em] text-center">
              G
            </span>
            enerative
            <br />
            <span className="text-brand-gold inline-block w-[0.8em] text-center">
              I
            </span>
            nfluencer
            <br />
            <span className="text-brand-gold inline-block w-[0.8em] text-center">
              A
            </span>
            nalyst
          </span>
        }
        cta={<AboutCta href="/form">ANALYZE MY TIKTOK</AboutCta>}
      >
        <p>
          {`During an internship interview for SOFI AI, an applicant stood out during her interview by mentioning that she was also a content creator on Tiktok. Her name was Gia. Intrigued, Sophia Sy, co-founder of SOFI AI spent that night scrolling through her videos.`}
        </p>
        <p>She got the role.</p>
        <p className="text-brand-gold font-bold">
          {`In a saturated market with equally qualified candidates, Gia’s content and personal branding was what set her apart.`}
        </p>
        <p>
          {`Your content isn’t just content. It’s your reputation. It’s proof of who you are and what you know. And when you build it with intention, it creates opportunities you never had to chase.`}
        </p>
        <p>
          {`GIA is named after that realization. `}
          <span className="text-brand-gold font-bold">
            An AI analyst built to help you understand your audience, own your
            narrative, and stand out… with purpose.
          </span>
        </p>
      </InfoSection>
    </section>
  );
}
