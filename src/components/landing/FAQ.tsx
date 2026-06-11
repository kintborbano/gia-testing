'use client';

import { useState } from 'react';
import { ChevronDown, Minus, Plus } from 'lucide-react';

type FaqItem = {
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    question: 'What is Hook Scoring?',
    answer:
      "Hook Scoring measures how effectively your video's opening captures attention. GIA evaluates clarity, curiosity, specificity, emotion, and scroll-stopping power, then explains how to improve it.",
  },
  {
    question: 'What is Comment Intelligence?',
    answer:
      'Comment Intelligence turns audience conversations into content strategy. GIA identifies recurring questions, requests, objections, and themes hidden in your comments.',
  },
  {
    question: 'What is the GIA Score?',
    answer:
      'A single score designed to track creator growth over time. Think of it as a health check for your TikTok account.',
  },
  {
    question: 'Can I analyze another creator?',
    answer:
      'Yes. Select "Browsing 👀" during checkout and GIA will analyze any public TikTok account.',
  },
  {
    question: 'Does GIA need access to my account?',
    answer:
      'No. GIA only analyzes publicly available TikTok content and engagement signals. No login is required.',
  },
  {
    question: 'How is GIA different from ChatGPT?',
    answer:
      'GIA analyzes your actual TikTok content and audience behavior before making recommendations. ChatGPT and other AI tools only give advice based on prompts.',
  },
];

const EXPANDED_FAQS: FaqItem[] = [
  {
    question: 'Who is GIA for?',
    answer:
      'GIA is built for creators, founders, students, freelancers, personal brands, and businesses using TikTok to grow an audience.',
  },
  {
    question: 'Will GIA tell me what to post next?',
    answer:
      'Yes! Every report includes personalized ready-to-film content ideas based on your audience, performance patterns, and goals.',
  },
  {
    question: 'What happens after payment?',
    answer:
      "After payment, GIA starts preparing your report and sends you an email notification once it's ready.",
  },
  {
    question: 'How long does it take?',
    answer: 'Most reports are delivered to your email within minutes.',
  },
  {
    question: 'Can I share my report?',
    answer:
      'Absolutely! Your report includes a shareable Story Card designed for Instagram Stories and social sharing.',
  },
];

export default function FAQ(): React.ReactElement {
  const [openIndex, setOpenIndex] = useState(-1);
  const [showAll, setShowAll] = useState(false);

  const renderFaq = (faq: FaqItem, index: number): React.ReactElement => {
    const isOpen = openIndex === index;

    return (
      <div key={faq.question} className="border-brand-primary/30 border-b">
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
  };

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
          {FAQS.map((faq, index) => renderFaq(faq, index))}
        </div>

        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => {
            if (showAll && openIndex >= FAQS.length) {
              setOpenIndex(-1);
            }
            setShowAll(!showAll);
          }}
          className="text-brand-primary mt-4 flex flex-wrap items-center justify-center gap-2"
        >
          <ChevronDown
            size={20}
            className={[
              'transition-transform duration-300 ease-in-out',
              showAll ? 'rotate-180' : '',
            ].join(' ')}
          />
          <span className="font-sans text-[20px] leading-snug font-semibold tracking-[-0.1px]">
            Still have questions?
          </span>
          <span className="font-sans text-[16px] font-medium tracking-[-0.08px] underline underline-offset-4">
            View all FAQs
          </span>
        </button>

        <div
          className={[
            'grid w-full max-w-[820px] text-left transition-[grid-template-rows,opacity] duration-300 ease-in-out',
            showAll
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0',
          ].join(' ')}
        >
          <div className="min-h-0 overflow-hidden">
            {EXPANDED_FAQS.map((faq, index) =>
              renderFaq(faq, FAQS.length + index)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
