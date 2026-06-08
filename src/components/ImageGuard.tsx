'use client';

import { useEffect } from 'react';

/**
 * Site-wide casual download deterrence. Blocks right-click on images/canvases and
 * the Ctrl/⌘+S (save page) and Ctrl/⌘+U (view source) shortcuts. These are
 * deterrents only — DevTools, the Network tab, canvas.toDataURL(), and screenshots
 * still bypass them. Mounted once in the root layout; renders nothing.
 */
export default function ImageGuard(): null {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLImageElement ||
        e.target instanceof HTMLCanvasElement
      ) {
        e.preventDefault();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      if (key === 's' || key === 'u') e.preventDefault();
    };

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return null;
}
