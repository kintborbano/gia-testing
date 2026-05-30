'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type ActionStep = 1 | 2 | 3;

export interface UseActionStepsResult {
  currentStep: ActionStep;
  tiktokValue: string;
  inputError: string;
  updateTiktokValue: (value: string) => void;
  submitInputStep: () => void;
  completeProcessingStep: () => void;
  viewFullReport: () => void;
}

function getReportHandle(value: string): string {
  return value.trim().replace(/^@/, '').split('/')[0];
}

export function useActionSteps(): UseActionStepsResult {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ActionStep>(1);
  const [tiktokValue, setTiktokValue] = useState('');
  const [inputError, setInputError] = useState('');

  const updateTiktokValue = (value: string) => {
    setTiktokValue(value);
    setInputError('');
  };

  const submitInputStep = () => {
    if (!tiktokValue.trim()) {
      setInputError('TikTok URL cannot be empty');
      return;
    }

    setInputError('');
    setCurrentStep(2);
  };

  const completeProcessingStep = () => {
    setCurrentStep(3);
  };

  const viewFullReport = () => {
    router.push(`/report/${getReportHandle(tiktokValue)}`);
  };

  return {
    currentStep,
    tiktokValue,
    inputError,
    updateTiktokValue,
    submitInputStep,
    completeProcessingStep,
    viewFullReport,
  };
}
