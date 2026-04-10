"use client";

import { useEffect } from "react";
import { subscribeToAuthChanges } from "@/lib/firebase/auth";
import { subscribeToUserData } from "@/lib/firebase/db";
import { useQuantumStore } from "@/store/quantum-store";

export default function AuthSync() {
  const setUser = useQuantumStore(state => state.setUser);
  const setCloudData = useQuantumStore(state => state.setCloudData);

  useEffect(() => {
    let unsubscribeDb: (() => void) | undefined;

    const unsubscribeAuth = subscribeToAuthChanges((user) => {
      setUser(user);
      
      if (user) {
        // When user logs in, subscribe to their Firestore data
        unsubscribeDb = subscribeToUserData(user.uid, (data) => {
          setCloudData(data);
        });
      } else {
        // When user logs out, stop listening to DB
        if (unsubscribeDb) {
           unsubscribeDb();
           unsubscribeDb = undefined;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDb) unsubscribeDb();
    };
  }, [setUser, setCloudData]);

  return null; // This is a headless logic component
}
