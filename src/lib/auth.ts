import { DEV_BYPASS } from './devBypass';

const TOKEN_KEY = 'gia_token';
const USER_KEY = 'gia_user';

export interface GiaUser {
  name: string;
  email: string;
}

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

export function setSession(token: string, user: GiaUser): void {
  setToken(token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): GiaUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GiaUser;
  } catch {
    return null;
  }
}

export function signOut(): void {
  clearToken();
  localStorage.removeItem(USER_KEY);
}
