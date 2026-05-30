'use client';

import { useCallback, useEffect, useRef } from 'react';
import { lockIntroScroll } from './scrollLock';

interface IntroScrollLock {
  releaseScrollLock: () => void;
}

export function useIntroScrollLock(enabled: boolean): IntroScrollLock {
  const releaseRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const scrollLock = lockIntroScroll();
    releaseRef.current = scrollLock.release;

    return () => {
      releaseRef.current?.();
      releaseRef.current = null;
    };
  }, [enabled]);

  const releaseScrollLock = useCallback(() => {
    releaseRef.current?.();
    releaseRef.current = null;
  }, []);

  return { releaseScrollLock };
}
