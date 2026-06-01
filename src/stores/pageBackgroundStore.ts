type Listener = () => void;

const listeners = new Set<Listener>();
let snapshot = 'rgb(255, 255, 255)';

export function getPageBackgroundSnapshot(): string {
  return snapshot;
}

export function getPageBackgroundServerSnapshot(): string {
  return 'rgb(255, 255, 255)';
}

export function subscribeToPageBackground(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setPageBackgroundColor(color: string): void {
  if (color === snapshot) return;
  snapshot = color;
  listeners.forEach((listener) => listener());
}
