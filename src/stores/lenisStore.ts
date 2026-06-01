import type Lenis from 'lenis';

type LenisListener = () => void;

const listeners = new Set<LenisListener>();
let lenisSnapshot: Lenis | null = null;

export function getLenisSnapshot(): Lenis | null {
  if (lenisSnapshot) {
    return lenisSnapshot;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  return window.__giaLenis ?? null;
}

export function getLenisServerSnapshot(): Lenis | null {
  return null;
}

export function subscribeToLenis(listener: LenisListener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function setLenisInstance(lenis: Lenis | null): void {
  lenisSnapshot = lenis;

  if (typeof window !== 'undefined') {
    if (lenis) {
      window.__giaLenis = lenis;
    } else {
      delete window.__giaLenis;
    }
  }

  listeners.forEach((listener) => listener());
}
