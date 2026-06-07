import type { Metadata } from 'next';
import SubPageShell from '@/components/landing/SubPageShell';
import Story from '@/components/landing/Story';

export const metadata: Metadata = {
  title: 'Meet GIA',
  description:
    'The story behind GIA — how a 60-second TikTok turned into SOFI AI’s hook-analysis intern.',
};

export default function MeetGiaPage(): React.ReactElement {
  return (
    <SubPageShell>
      <Story />
    </SubPageShell>
  );
}
