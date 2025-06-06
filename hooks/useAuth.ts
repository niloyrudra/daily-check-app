import { auth, db } from "@/config/firebase";
import { UserData } from "@/types";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", firebaseUser.uid);
      const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
        setUser(docSnap.exists() ? (docSnap.data() as UserData) : null);
        setLoading(false);
      });

      // Cleanup Firestore listener
      return () => unsubscribeSnapshot();
    });

    // Cleanup Auth listener
    return () => unsubscribeAuth();
  }, []);

  return { user, loading };
};