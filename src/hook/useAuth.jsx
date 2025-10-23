// hooks/useAuth.js
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
  const authContext = useContext(AuthContext); // যদি AuthContext থাকে
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          fullName: firebaseUser.displayName || "Anonymous",
          uid: firebaseUser.uid,
        });
      } else {
        setUser(null); // Logged out
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    ...authContext, // AuthContext এ থাকা অন্য info
    user, // এখানে logged-in user info
  };
};

export default useAuth;
