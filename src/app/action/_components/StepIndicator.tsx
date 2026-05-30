import type { ActionStep } from '../_hooks/useActionSteps';

const STEPS: Array<{ number: ActionStep; label: string }> = [
  { number: 1, label: 'Submit' },
  { number: 2, label: 'Analyze' },
  { number: 3, label: 'Preview' },
];

interface StepIndicatorProps {
  currentStep: ActionStep;
}

export default function StepIndicator({
  currentStep,
}: StepIndicatorProps): React.ReactElement {
  return (
    <div className="mb-12 flex justify-center gap-8 md:gap-16">
      {STEPS.map((step) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <div key={step.number} className="flex flex-col items-center gap-2">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step.number}
            </div>
            <span
              className={`text-xs font-medium ${
                isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
