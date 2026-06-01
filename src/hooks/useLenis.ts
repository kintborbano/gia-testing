'use client';

import { useSyncExternalStore } from 'react';
import type Lenis from 'lenis';
import {
  getLenisServerSnapshot,
  getLenisSnapshot,
  subscribeToLenis,
} from '@/stores/lenisStore';

export function useLenis(): Lenis | null {
  return useSyncExternalStore(
    subscribeToLenis,
    getLenisSnapshot,
    getLenisServerSnapshot
  );
}
