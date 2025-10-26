import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  reload,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { AuthContext } from "./AuthContext";
import useUserAxios from "../hook/useUserAxios"; // ✅ তোমার কাস্টম axios hook

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosIntals = useUserAxios(); // ✅ custom axios instance

  // ✅ Create user
  const createUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  // ✅ Sign in user
  const signInUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(true);
      localStorage.setItem("fbToken", token);
      setUser(userCredential.user);
      return userCredential.user;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google sign-in
  const signInGoogleUser = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken(true);
      localStorage.setItem("fbToken", token);
      setUser(userCredential.user);
      return userCredential.user;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update profile (Firebase + MongoDB)
  const updateUserProfiles = async (profileInfo) => {
    if (auth.currentUser) {
      try {
        // 🔹 Firebase profile update
        await updateProfile(auth.currentUser, profileInfo);
        await reload(auth.currentUser);
        setUser(auth.currentUser);

        // 🔹 MongoDB update
        await axiosIntals.patch(`/users/${auth.currentUser.email}`, {
          displayName: profileInfo.displayName,
          photoURL: profileInfo.photoURL,
        });

        console.log("✅ Profile updated successfully!");
      } catch (err) {
        console.error("❌ Profile update failed:", err);
      }
    }
  };

  // ✅ Send verification email
  const sendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error("No user logged in");
    return sendEmailVerification(auth.currentUser);
  };

  // ✅ Logout
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("fbToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true);
          localStorage.setItem("fbToken", token);
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || "Anonymous",
            photoURL: currentUser.photoURL || "",
          });
        } catch (err) {
          console.error("Token Refresh Error:", err);
        }
      } else {
        localStorage.removeItem("fbToken");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Provide all auth methods
  const authInfo = {
    user,
    loading,
    setUser,
    createUser,
    signInUser,
    logOut,
    signInGoogleUser,
    updateUserProfiles,
    sendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
