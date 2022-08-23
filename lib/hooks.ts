import { auth, firestore } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

export function useUserData() {
  const [user] = useAuthState(auth as any);
  // initialized a username
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      // look up user in users collection by uid
      const ref = firestore.collection("users").doc(user.uid);
      // retrieve the username and unsubscribe
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
      });
    } else setUsername(null);
    return unsubscribe;
  }, [user]);
  return { user, username };
}
