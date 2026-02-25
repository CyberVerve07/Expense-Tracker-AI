'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
// Updated to prevent initialization during build/SSR when API key is missing
export function initializeFirebase() {
  // Check if we're in browser environment and have a valid API key
  const isBrowser = typeof window !== 'undefined';
  const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0;

  // Only initialize Firebase in the browser with a valid API key
  if (!isBrowser || !hasValidConfig) {
    // Return null values during build/SSR or when config is missing
    return null;
  }

  if (!getApps().length) {
    // For Vercel and other platforms, direct initialization is more reliable.
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
