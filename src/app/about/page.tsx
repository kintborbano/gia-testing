import type { Metadata } from 'next';
import SubPageShell from '@/components/landing/SubPageShell';
import AboutUs from '@/components/landing/AboutUs';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Why GIA exists — an AI that actually watches your TikTok, reads your comments, and turns it into a growth plan made just for you.',
};

export default function AboutPage(): React.ReactElement {
  return (
    <SubPageShell>
      <AboutUs />
    </SubPageShell>
  );
}
