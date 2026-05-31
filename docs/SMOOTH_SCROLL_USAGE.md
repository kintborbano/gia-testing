# Smooth Scroll Implementation

Smooth scrolling is implemented using **Lenis** (v1.3.23) and is automatically enabled across the entire application.

## Configuration

The `SmoothScroll` component is configured with:

- **autoRaf**: true — handles RAF automatically
- **smoothWheel**: true — smooth wheel scrolling
- **lerp**: 0.06 — smoothing interpolation
- **wheelMultiplier**: 1 — wheel scroll intensity
- **syncTouch**: true — sync touch scrolling
- **syncTouchLerp**: 0.08 — touch scroll smoothing
- **touchMultiplier**: 1 — touch scroll intensity
- **anchorOffset**: 112px — offset for anchor links

## Usage

### Basic Usage

The `SmoothScroll` component wraps your app automatically in the root layout. No configuration needed.

### Accessing the Lenis Instance

Use the `useLenis()` hook in client components to access the Lenis instance:

```tsx
'use client';

import { useLenis } from '@/hooks/useLenis';

export function MyComponent() {
  const lenis = useLenis();

  const handleScroll = () => {
    if (lenis) {
      lenis.scrollTo(0); // Scroll to top
    }
  };

  return <button onClick={handleScroll}>Scroll to Top</button>;
}
```

### Disable Smooth Scroll for Specific Elements

Add the `[data-lenis-prevent]` attribute to elements that should use native scrolling (e.g., modals, scrollable panels):

```tsx
<div data-lenis-prevent>
  {/* This element will use native browser scrolling */}
</div>
```

The global stylesheet also applies `overscroll-behavior: contain` to `[data-lenis-prevent]`.

## CSS Classes

Lenis automatically applies these classes to the HTML element:

- `.lenis` — Lenis is active
- `.lenis-smooth` — Smooth scrolling is enabled
- `.lenis-stopped` — Scrolling is stopped

You can target these classes for styling adjustments if needed.

## Global Access

The Lenis instance is stored globally as `window.__giaLenis` for external access if needed.
