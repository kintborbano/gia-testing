'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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

export async function signInWithGoogle(): Promise<string> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth(), provider);
  return cred.user.getIdToken();
}
