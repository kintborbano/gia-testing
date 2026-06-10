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
  return (
    <Link
      href={href}
      onNavigate={(event) => {
        event.preventDefault();
        navigate(href);
      }}
      className="group bg-text/20 border-brand-gold text-brand-gold hover:bg-brand-gold inline-flex h-[44px] items-center gap-3 self-start rounded-[25px] border-[2.5px] px-6 font-sans text-[12px] font-bold tracking-[-0.24px] uppercase transition-colors hover:text-black"
    >
      {children}
      <ArrowRight
        aria-hidden
        className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-rotate-45"
      />
    </Link>
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
    <div className="flex w-full max-w-[1152px] flex-col gap-10 md:flex-row md:items-start md:justify-center md:gap-[54px]">
      <div className="flex flex-col gap-6 md:w-[460px] md:shrink-0">
        <p className="text-brand-secondary font-sans text-[15px] leading-[1.45] font-bold tracking-[-0.075px]">
          {eyebrow}
        </p>
        <h2 className="font-young-serif text-[40px] leading-[1.1] tracking-[-1.12px] md:text-[56px]">
          {heading}
        </h2>
        {cta}
      </div>
      <div className="flex flex-col gap-5 font-sans text-[16px] leading-[1.4] md:w-[449px] md:shrink-0 md:text-[20px]">
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
            src="/images/about/gia-hero.png"
            alt="GIA, the SOFI AI analyst, working at her desk"
            width={522}
            height={348}
            priority
            className="h-auto w-[380px] max-w-full sm:w-[490px] md:w-[600px]"
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
        eyebrow="ABOUT SOFI AI"
        heading={
          <>
            {`powered by `}
            <br />
            <span className="text-brand-secondary">SOFI AI</span>
          </>
        }
        cta={<AboutCta href="/">LEARN MORE</AboutCta>}
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
        <p className="text-brand-gold font-bold">
          Data tells stories. GIA is here to help you understand them.
        </p>
      </InfoSection>

      {/* About GIA */}
      <InfoSection
        eyebrow="ABOUT GIA"
        heading={
          <>
            {`GIA is `}
            <br />
            <span className="text-brand-secondary">
              Generative
              <br />
              Influencer
              <br />
              Analyst
            </span>
          </>
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
