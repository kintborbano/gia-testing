'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  type Auth,
} from 'firebase/auth';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function app(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(config);
}

function auth(): Auth {
  return getAuth(app());
}

// Popup failures that mean the environment can't show one (in-app browsers,
// blocked popups) — fall back to a full-page redirect. User-initiated closes
// (popup-closed-by-user, cancelled-popup-request) are NOT in this set: those
// are deliberate cancels, so we re-throw instead of redirecting.
const REDIRECT_FALLBACK_CODES = new Set([
  'auth/popup-blocked',
  'auth/operation-not-supported-in-this-environment',
  'auth/web-storage-unsupported',
]);

export async function signInWithGoogle(): Promise<string> {
  const provider = new GoogleAuthProvider();
  try {
    const cred = await signInWithPopup(auth(), provider);
    return cred.user.getIdToken();
  } catch (err) {
    const code = (err as { code?: string }).code ?? '';
    if (REDIRECT_FALLBACK_CODES.has(code)) {
      // Navigates away; this promise never resolves. The caller's pending
      // analysis is recovered from the form draft on return (see AnalyzeForm).
      await signInWithRedirect(auth(), provider);
      return new Promise<string>(() => {});
    }
    throw err;
  }
}

export async function getRedirectIdToken(): Promise<string | null> {
  const result = await getRedirectResult(auth());
  return result ? result.user.getIdToken() : null;
}
