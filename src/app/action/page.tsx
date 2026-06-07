import type { Metadata } from 'next';
import ActionFlow from '@/components/action/ActionFlow';

export const metadata: Metadata = {
  title: 'Analyze your TikTok',
  description:
    'Enter your TikTok handle and let GIA analyze your hooks, comments, and content patterns.',
};

export default function ActionPage(): React.ReactElement {
  return <ActionFlow />;
}
