import Image from 'next/image';
import Link from 'next/link';
import PoweredByPill from '@/components/ui/PoweredByPill';
import Button from '@/components/ui/Button';

const NAV_LINKS = [
  { label: 'MEET GIA', href: '/meet-gia' },
  { label: 'GIA IN ACTION', href: '/#bg-stop-action' },
  { label: 'HOW GIA WORKS', href: '/#bg-stop-how' },
  { label: 'PRICING', href: '/pricing' },
  { label: 'FAQs', href: '/faq' },
  { label: 'ABOUT US', href: '/#bg-stop-cta' },
];

export default function Footer(): React.ReactElement {
  return (
    <footer
      id="bg-stop-footer"
      className="flex w-full justify-center px-16 pb-[120px]"
    >
      <div className="text-brand-primary flex w-[1056px] max-w-full flex-col gap-[80px] py-20 md:flex-row md:justify-between md:gap-[60px]">
        {/* Lead-magnet column */}
        <form className="flex w-[480px] max-w-full flex-col gap-[18px]">
          <div className="flex items-center gap-3">
            <Image
              src="/logos/gia-logo.svg"
              alt="GIA"
              width={689}
              height={480}
              className="h-[48px] w-auto"
            />
            <PoweredByPill />
          </div>

          <p className="font-sans text-[22px] leading-[1.35] font-semibold tracking-[-0.11px]">
            Not ready yet?
          </p>
          <p className="font-sans text-[14px] leading-[1.5] tracking-[-0.07px]">
            Get the Superpower Code: a free creator guide on understanding
            audience psychology, content signals, and growth patterns.
          </p>

          <input
            type="email"
            name="email"
            placeholder="user@mail.com"
            className="border-brand-primary text-brand-primary placeholder:text-brand-primary/50 h-[44px] w-full rounded-[25px] border bg-white px-5 font-sans text-[14px] tracking-[-0.28px]"
          />
          <Button
            type="submit"
            variant="filled"
            size="default"
            className="w-[210px]"
          >
            SEND ME THE GUIDE
          </Button>
        </form>

        {/* Navigate column */}
        <nav className="flex w-[200px] flex-col gap-3">
          <p className="pb-3 font-sans text-[18px] font-bold tracking-[-0.09px]">
            Navigate
          </p>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-sans text-[16px] leading-[1.45] font-medium tracking-[-0.08px] transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
