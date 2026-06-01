'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenisInstance } from '@/stores/lenisStore';

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      lerp: 0.06,
      wheelMultiplier: 1,
      syncTouch: true,
      syncTouchLerp: 0.08,
      touchMultiplier: 1,
    });

    setLenisInstance(lenis);

    return () => {
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
