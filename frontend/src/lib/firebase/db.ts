import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot
} from "firebase/firestore";
import { db } from "./config";
import { Expense, Goal } from "@/store/quantum-store";

const USER_DATA_COLLECTION = "users";

export const saveUserData = async (uid: string, data: { expenses: Expense[], goals: Goal[] }) => {
  if (!db) return;
  try {
    const userDocRef = doc(db, USER_DATA_COLLECTION, uid);
    await setDoc(userDocRef, {
      ...data,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving user data to Firestore", error);
    throw error;
  }
};

export const getUserData = async (uid: string) => {
  if (!db) return null;
  try {
    const userDocRef = doc(db, USER_DATA_COLLECTION, uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as { expenses: Expense[], goals: Goal[] };
    }
    return null;
  } catch (error) {
    console.error("Error getting user data from Firestore", error);
    throw error;
  }
};

export const subscribeToUserData = (uid: string, callback: (data: { expenses: Expense[], goals: Goal[] }) => void) => {
  if (!db) return () => {};
  const userDocRef = doc(db, USER_DATA_COLLECTION, uid);
  return onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as { expenses: Expense[], goals: Goal[] });
    }
  });
};
