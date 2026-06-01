'use client';

import { useActionSteps } from '@/hooks/useActionSteps';
import ProcessingStep from '@/components/action/ProcessingStep';
import ReportStep from '@/components/action/ReportStep';
import StepIndicator from '@/components/action/StepIndicator';
import TiktokInputStep from '@/components/action/TiktokInputStep';

export default function ActionFlow(): React.ReactElement {
  const {
    currentStep,
    tiktokValue,
    inputError,
    updateTiktokValue,
    submitInputStep,
    completeProcessingStep,
    viewFullReport,
  } = useActionSteps();

  return (
    <main className="min-h-screen w-full bg-gray-50 px-4 py-12">
      <StepIndicator currentStep={currentStep} />

      <div className="mx-auto max-w-2xl">
        {currentStep === 1 && (
          <TiktokInputStep
            value={tiktokValue}
            error={inputError}
            onValueChange={updateTiktokValue}
            onSubmit={submitInputStep}
          />
        )}

        {currentStep === 2 && (
          <ProcessingStep onComplete={completeProcessingStep} />
        )}

        {currentStep === 3 && (
          <ReportStep
            tiktokValue={tiktokValue}
            onViewFullReport={viewFullReport}
          />
        )}
      </div>
    </main>
  );
}
