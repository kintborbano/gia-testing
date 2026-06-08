import type { Metadata } from 'next';
import LoadingScreen from '@/components/loading/LoadingScreen';

export const metadata: Metadata = {
  title: 'Analyzing…',
  description: 'GIA is analyzing the TikTok account you submitted.',
};

export default function LoadingPage(): React.ReactElement {
  return <LoadingScreen />;
}
