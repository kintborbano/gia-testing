'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useIntroAnimation } from '@/hooks/useIntroAnimation';

interface Props {
  children: React.ReactNode;
}

export default function IntroOverlay({ children }: Props): React.ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const { phase } = useIntroAnimation({ wrapperRef, panelRef, logoRef });
  const isDone = phase === 'done';

  return (
    <div ref={wrapperRef} className={!isDone ? 'intro-wrapper' : undefined}>
      <div ref={panelRef} className="intro-panel">
        {!isDone && (
          <Image
            ref={logoRef}
            id="intro-logo"
            src="/logo.png"
            width={689}
            height={480}
            alt="GIA by SOFI AI"
            className="intro-overlay__logo"
            priority
          />
        )}
      </div>

      {children}
    </div>
  );
}
