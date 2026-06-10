import type { Metadata } from 'next';
import SubPageShell from '@/components/landing/SubPageShell';
import AboutUs from '@/components/landing/AboutUs';
import { BRAND } from '@/styles/palette';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Why GIA exists — an AI that actually watches your TikTok, reads your comments, and turns it into a growth plan made just for you.',
};

export default function AboutPage(): React.ReactElement {
  return (
    // Dark page: flip the sticky header to its black/cream palette (the same
    // dark version it wears over the How section) and paint the shell black.
    <SubPageShell
      headerBackground="rgb(0, 0, 0)"
      headerForeground={BRAND.cream}
      surfaceClassName="bg-black"
      footerVariant="dark"
      flushContent
    >
      <AboutUs />
    </SubPageShell>
  );
}
