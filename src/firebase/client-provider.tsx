'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider, FirebaseContext } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase/init';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []);

  if (!firebaseServices) {
    return (
      <FirebaseContext.Provider
        value={{
          areServicesAvailable: false,
          firebaseApp: null,
          firestore: null,
        }}
      >
        {children}
      </FirebaseContext.Provider>
    );
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
