'use client';

import { firebaseConfig } from '@/firebase/config';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    firestore: getFirestore(firebaseApp),
  };
}

export function initializeFirebase() {
  const isBrowser = typeof window !== 'undefined';
  const hasValidConfig = firebaseConfig.apiKey.length > 0;

  if (!isBrowser || !hasValidConfig) {
    return null;
  }

  if (!getApps().length) {
    return getSdks(initializeApp(firebaseConfig));
  }

  return getSdks(getApp());
}
