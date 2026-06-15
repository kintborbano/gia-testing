import type { ReactElement } from 'react';

/**
 * Structured legal copy (Privacy Policy, Terms & Conditions, Data Retention
 * Policy). The content lives as data in `src/lib/legal/*` and is rendered here
 * so all three pages share one layout.
 *
 * Layout follows the Assembly legal-page pattern (assembly.com/legal): a single
 * left-aligned reading column, the effective/updated date pinned directly under
 * the title, and numbered top-level sections with borderless, generously-spaced
 * subsections — dressed in the GIA brand (maroon accents, Young Serif title,
 * Instrument Sans body).
 */

/** A block within a section: a subheading, paragraph, lead line, or list. */
export type LegalBlock =
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'lead'; text: string }
  | { type: 'list'; items: string[] };

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

export type LegalContent = {
  /** Page title, set in the display serif. */
  title: string;
  /** Date the policy takes effect, e.g. "June 15, 2026" (or a placeholder). */
  effectiveDate: string;
  /** Optional "last updated" date shown alongside the effective date. */
  updatedDate?: string;
  /** Intro paragraph(s) under the date. */
  intro: string[];
  sections: LegalSection[];
};

function Block({ block }: { block: LegalBlock }): ReactElement {
  if (block.type === 'list') {
    return (
      <ul className="marker:text-brand-primary/60 flex list-disc flex-col gap-2 pl-5">
        {block.items.map((item) => (
          <li
            key={item}
            className="font-sans text-[16px] leading-[1.75] tracking-[-0.08px] text-black"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'subheading') {
    return (
      <h3 className="text-brand-primary mt-2 font-sans text-[18px] leading-snug font-semibold tracking-[-0.09px]">
        {block.text}
      </h3>
    );
  }

  if (block.type === 'lead') {
    return (
      <p className="text-brand-primary font-sans text-[18px] leading-[1.6] font-medium tracking-[-0.09px]">
        {block.text}
      </p>
    );
  }

  return (
    <p className="font-sans text-[16px] leading-[1.75] tracking-[-0.08px] text-black">
      {block.text}
    </p>
  );
}

export default function LegalDocument({
  content,
}: {
  content: LegalContent;
}): ReactElement {
  return (
    <section className="flex w-full flex-col items-center px-5 sm:px-8 md:px-16">
      <article className="flex w-[1152px] max-w-full flex-col px-8 pt-6 pb-14 sm:px-12 md:px-16 md:pt-8 md:pb-20">
        {/* Title block — centered, with the effective date sitting above the
            title (Assembly pattern). */}
        <header className="flex flex-col items-center gap-7 text-center">
          <p className="text-brand-primary font-sans text-[18px] font-semibold tracking-[0.04em]">
            <span>Effective {content.effectiveDate}</span>
            {content.updatedDate ? (
              <span className="text-brand-primary/50">
                {`  ·  Updated ${content.updatedDate}`}
              </span>
            ) : null}
          </p>
          <h1 className="font-young-serif text-brand-primary text-[36px] leading-[1.05] tracking-[-1.12px] sm:text-[48px] md:text-[60px]">
            {content.title}
          </h1>
        </header>

        {/* Intro paragraphs. */}
        <div className="mt-24 flex flex-col gap-4 md:mt-32">
          {content.intro.map((paragraph) => (
            <p
              key={paragraph}
              className="font-sans text-[16px] leading-[1.75] tracking-[-0.08px] text-black"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Numbered sections — left-aligned, borderless, generous spacing. */}
        <div className="mt-12 flex flex-col gap-11">
          {content.sections.map((section, index) => (
            <section
              key={section.heading}
              className="flex scroll-mt-28 flex-col gap-4"
              id={slugify(section.heading)}
            >
              <h2 className="text-brand-primary font-sans text-[24px] leading-snug font-semibold tracking-[-0.12px]">
                <span className="tabular-nums">{`${index + 1}. `}</span>
                {section.heading}
              </h2>
              {section.blocks.map((block, blockIndex) => (
                <Block key={blockIndex} block={block} />
              ))}
            </section>
          ))}
        </div>
      </article>
    </section>
  );
}

/** Kebab-case anchor id so sections are deep-linkable (e.g. #data-security). */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
