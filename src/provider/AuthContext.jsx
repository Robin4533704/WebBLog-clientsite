// src/provider/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ✅ fresh Firebase token নাও
        const token = await user.getIdToken(true);
        localStorage.setItem("fbToken", token);

        setCurrentUser({
          email: user.email,
          displayName: user.displayName || "Anonymous",
          uid: user.uid,
          photoURL: user.photoURL || "",
        });
      } else {
        // 🔒 Logout হলে সব clear করো
        localStorage.removeItem("fbToken");
        setCurrentUser(null);
      }

      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, loadingAuth, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
