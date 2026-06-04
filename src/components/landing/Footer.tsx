import Image from 'next/image';
import PoweredByPill from '@/components/ui/PoweredByPill';

const NAV_LINKS = [
  { label: 'MEET GIA', href: '#bg-stop-hero' },
  { label: 'GIA IN ACTION', href: '#bg-stop-action' },
  { label: 'HOW GIA WORKS', href: '#bg-stop-how' },
  { label: 'PRICING', href: '#bg-stop-pricing' },
  { label: 'FAQs', href: '#bg-stop-faq' },
  { label: 'ABOUT US', href: '#bg-stop-cta' },
];

export default function Footer(): React.ReactElement {
  return (
    <footer
      id="bg-stop-footer"
      className="flex w-full justify-center px-16 pb-[120px]"
    >
      <div className="text-brand-primary flex w-[1056px] max-w-full flex-col gap-[120px] py-20 md:flex-row">
        {/* Lead-magnet column */}
        <form className="flex w-[349px] max-w-full flex-col gap-[15px]">
          <div className="flex items-center gap-3">
            <Image
              src="/logos/gia-logo.svg"
              alt="GIA"
              width={689}
              height={480}
              className="h-[44px] w-auto"
            />
            <PoweredByPill />
          </div>

          <p className="font-sans text-[16px] leading-[1.45] font-semibold tracking-[-0.08px]">
            Not ready yet?
          </p>
          <p className="font-sans text-[13px] leading-[1.45] tracking-[-0.065px]">
            Get the Superpower Code: a free creator guide on understanding
            audience psychology, content signals, and growth patterns.
          </p>

          <input
            type="email"
            name="email"
            placeholder="user@mail.com"
            className="border-brand-primary text-brand-primary placeholder:text-brand-primary/50 h-[38px] w-full rounded-[25px] border bg-white px-5 font-sans text-[13px] tracking-[-0.26px]"
          />
          <button
            type="submit"
            className="border-brand-primary bg-brand-primary h-[36px] w-[175px] rounded-[25px] border font-sans text-[10px] font-bold tracking-[-0.2px] text-white transition-opacity hover:opacity-90"
          >
            SEND ME THE GUIDE
          </button>
        </form>

        {/* Navigate column */}
        <nav className="flex w-[166px] flex-col gap-2">
          <p className="pb-4 font-sans text-[16px] font-bold tracking-[-0.08px]">
            Navigate
          </p>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-[16px] leading-[1.45] font-medium tracking-[-0.08px] transition-opacity hover:opacity-70"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
