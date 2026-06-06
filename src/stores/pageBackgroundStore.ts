type Listener = () => void;

/** The live page palette the header adopts as it scrolls between sections. */
export type PageColors = {
  /** Background fill — the header paints this so it melts into the section. */
  background: string;
  /** Foreground tint — the header's text, icons, and logo inherit this. */
  foreground: string;
};

const DEFAULT_BACKGROUND = 'rgb(255, 255, 255)';
/** Brand maroon (`--brand-primary`); the foreground used on light sections. */
const DEFAULT_FOREGROUND = '#8c1f2e';

const listeners = new Set<Listener>();

let snapshot: PageColors = {
  background: DEFAULT_BACKGROUND,
  foreground: DEFAULT_FOREGROUND,
};

// A stable reference for SSR — useSyncExternalStore compares snapshots by
// identity, so the server snapshot must never be re-created.
const serverSnapshot: PageColors = {
  background: DEFAULT_BACKGROUND,
  foreground: DEFAULT_FOREGROUND,
};

export function getPageColorsSnapshot(): PageColors {
  return snapshot;
}

export function getPageColorsServerSnapshot(): PageColors {
  return serverSnapshot;
}

export function subscribeToPageColors(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Publish a new background+foreground pair. No-op if nothing changed. */
export function setPageColors(next: PageColors): void {
  if (
    next.background === snapshot.background &&
    next.foreground === snapshot.foreground
  ) {
    return;
  }
  snapshot = next;
  listeners.forEach((listener) => listener());
}

/**
 * Set only the background and reset the foreground to the default maroon.
 * Used by sub-pages that have no scroll-driven palette of their own.
 */
export function setPageBackgroundColor(background: string): void {
  setPageColors({ background, foreground: DEFAULT_FOREGROUND });
}
