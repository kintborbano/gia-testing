import type { Metadata } from 'next';
import SubPageShell from '@/components/landing/SubPageShell';
import LegalDocument from '@/components/legal/LegalDocument';
import { DATA_RETENTION_POLICY } from '@/lib/legal/dataRetention';

export const metadata: Metadata = {
  title: 'Data Retention Policy',
  description:
    'How GIA manages temporary storage, retention, and deletion of processed information and generated reports.',
};

export default function DataRetentionPage(): React.ReactElement {
  return (
    <SubPageShell>
      <LegalDocument content={DATA_RETENTION_POLICY} />
    </SubPageShell>
  );
}
