'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const FAQS = [
  {
    question: 'What is GIA?',
    answer:
      'GIA helps creators analyze TikTok hooks, understand what makes them work, and improve ideas before they post.',
  },
  {
    question: 'How does GIA score my hooks?',
    answer:
      'GIA reviews your hook for clarity, curiosity, emotional pull, and scroll-stopping potential, then turns those signals into practical feedback.',
  },
  {
    question: 'Can I use GIA for any niche?',
    answer:
      'Yes. GIA is designed to work across niches by focusing on audience psychology, structure, and the strength of the opening idea.',
  },
  {
    question: 'Do I need to be an expert creator?',
    answer:
      'No. GIA is built to make strong hook writing easier whether you are starting from scratch or refining content you already have.',
  },
  {
    question: 'Will GIA write hooks for me?',
    answer:
      'GIA can help you sharpen direction, spot weak points, and turn rough ideas into stronger openings that feel ready to test.',
  },
];

export default function FAQ(): React.ReactElement {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section
      id="bg-stop-faq"
      className="flex w-full flex-col items-center px-5 sm:px-8 md:px-16"
    >
      <div className="text-brand-primary flex w-[1152px] max-w-full flex-col items-center gap-6 py-16 text-center md:py-20">
        <p className="font-sans text-[18px] font-bold tracking-[-0.09px]">
          FAQ
        </p>
        <h2 className="font-young-serif w-full text-[32px] leading-[1.1] tracking-[-1.12px] sm:text-[44px] md:text-[56px]">
          frequently asked questions.
        </h2>
        <p className="w-[480px] max-w-full font-sans text-[18px] leading-[1.3] font-medium tracking-[-0.12px] md:text-[24px] md:leading-[1.25]">
          The stuff people ask before they hit subscribe.
        </p>

        <div className="mt-6 w-full max-w-[820px] text-left">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="border-brand-primary/30 border-b"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-brand-primary font-sans text-[20px] leading-snug font-semibold tracking-[-0.1px]">
                    {faq.question}
                  </span>
                  <span className="text-brand-primary grid size-10 shrink-0 place-items-center">
                    {isOpen ? <Minus size={22} /> : <Plus size={22} />}
                  </span>
                </button>

                <div
                  className={[
                    'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0',
                  ].join(' ')}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="max-w-[680px] pb-6 font-sans text-[16px] leading-7 tracking-[-0.08px] text-black">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
