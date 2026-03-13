'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider, FirebaseContext } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase/init';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    // Returns null during build/SSR when API key is missing
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  // If Firebase is not initialized (e.g., during build/SSR or missing API key),
  // provide a mock empty context so `useFirebase` hooks don't throw during SSR
  if (!firebaseServices) {
    return (
      <FirebaseContext.Provider
        value={{
          areServicesAvailable: false,
          firebaseApp: null,
          firestore: null,
          auth: null,
          user: null,
          isUserLoading: false,
          userError: null
        }}
      >
        {children}
      </FirebaseContext.Provider>
    );
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
