import { useEffect } from 'react';

interface ProcessingStepProps {
  onComplete: () => void;
}

export default function ProcessingStep({
  onComplete,
}: ProcessingStepProps): React.ReactElement {
  useEffect(() => {
    const timeoutId = window.setTimeout(onComplete, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [onComplete]);

  return (
    <section className="rounded-lg bg-white p-8 text-center shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Analyzing your hook
      </h2>
      <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      <p className="mx-auto max-w-md text-gray-500">
        GIA is reading the opening signal, audience pull, and likely retention
        friction in your TikTok.
      </p>
    </section>
  );
}
