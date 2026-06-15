import { DEV_BYPASS } from './devBypass';

const TOKEN_KEY = 'gia_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  // Dev bypass skips the BetaGate so the form proceeds straight to analysis.
  return DEV_BYPASS || !!getToken();
}
