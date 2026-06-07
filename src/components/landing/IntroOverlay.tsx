'use client';

import { useRef } from 'react';
import { useIntroAnimation } from '@/hooks/useIntroAnimation';
import IntroLoader from './IntroLoader';

interface Props {
  children: React.ReactNode;
}

export default function IntroOverlay({ children }: Props): React.ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { phase, ready, onLoaderFinished } = useIntroAnimation({
    wrapperRef,
    panelRef,
  });
  const isDone = phase === 'done';

  return (
    <div ref={wrapperRef} className={!isDone ? 'intro-wrapper' : undefined}>
      <div ref={panelRef} className="intro-panel">
        {!isDone && <IntroLoader ready={ready} onFinished={onLoaderFinished} />}
      </div>

      {children}
    </div>
  );
}
