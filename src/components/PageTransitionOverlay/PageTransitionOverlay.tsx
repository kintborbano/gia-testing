'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

interface PageTransitionOverlayProps {
  targetHref: string;
  onDone: () => void;
}

const COVER_DURATION = 600;
const HOLD_DURATION = 800;
const UNCOVER_DURATION = 600;
const EASING = 'cubic-bezier(0.76, 0, 0.24, 1)';

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function isAnimationCancellation(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export default function PageTransitionOverlay({
  targetHref,
  onDone,
}: PageTransitionOverlayProps): React.ReactElement {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    if (!overlay || !logo) return;

    let cancelled = false;

    async function runTransition(
      transitionOverlay: HTMLDivElement,
      transitionLogo: HTMLDivElement
    ) {
      let shouldComplete = false;

      try {
        const coverAnim = transitionOverlay.animate(
          [{ transform: 'translateY(100%)' }, { transform: 'translateY(0%)' }],
          { duration: COVER_DURATION, easing: EASING, fill: 'forwards' }
        );
        await coverAnim.finished;
        if (cancelled) return;

        transitionLogo.style.opacity = '1';
        const logoAnim = transitionLogo.animate(
          [
            { opacity: 0, transform: 'scale(0.92)' },
            { opacity: 1, transform: 'scale(1)' },
          ],
          { duration: 300, easing: 'ease-out', fill: 'forwards' }
        );

        router.push(targetHref);

        await logoAnim.finished;
        await wait(HOLD_DURATION);
        if (cancelled) return;

        const uncoverAnim = transitionOverlay.animate(
          [{ transform: 'translateY(0%)' }, { transform: 'translateY(-100%)' }],
          { duration: UNCOVER_DURATION, easing: EASING, fill: 'forwards' }
        );
        await uncoverAnim.finished;
        if (cancelled) return;

        shouldComplete = true;
      } catch (error) {
        if (!cancelled && !isAnimationCancellation(error)) {
          console.error('Page transition animation failed', error);
        }

        shouldComplete = !cancelled;
      } finally {
        transitionOverlay
          .getAnimations()
          .forEach((animation) => animation.cancel());
        transitionLogo
          .getAnimations()
          .forEach((animation) => animation.cancel());
        transitionLogo.style.opacity = '0';
        transitionOverlay.style.transform = 'translateY(100%)';

        if (shouldComplete && !cancelled) {
          onDone();
        }
      }
    }

    runTransition(overlay, logo);

    return () => {
      cancelled = true;
      overlay.getAnimations().forEach((animation) => animation.cancel());
      logo.getAnimations().forEach((animation) => animation.cancel());
    };
  }, [onDone, router, targetHref]);

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000',
    zIndex: 9999,
    transform: 'translateY(100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const logoStyle: React.CSSProperties = {
    color: '#fff',
    fontSize: '28px',
    fontWeight: 700,
    opacity: 0,
    letterSpacing: '0.05em',
  };

  return createPortal(
    <div ref={overlayRef} style={overlayStyle}>
      <div ref={logoRef} style={logoStyle}>
        [LOGO]
      </div>
    </div>,
    document.body
  );
}
