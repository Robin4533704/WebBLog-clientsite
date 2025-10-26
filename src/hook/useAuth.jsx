// hooks/useAuth.js
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ add loading

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
        setUser(null);
      }
      setLoading(false); // ✅ done loading
    });

    return () => unsubscribe();
  }, []);

  return {
    ...authContext,
    user,
    loading, // ✅ return loading
  };
};

export default useAuth;
