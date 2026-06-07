import type { Metadata } from 'next';
import AnalyzeForm from '@/components/form/AnalyzeForm';

export const metadata: Metadata = {
  title: 'Analyze your TikTok',
  description:
    "Tell GIA about the TikTok account you'd like analyzed and get your personalized report.",
};

export default function FormPage(): React.ReactElement {
  return <AnalyzeForm />;
}
