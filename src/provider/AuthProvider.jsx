import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Create/Register user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ✅ Sign in user (login)
  const signInUser = async (email, password) => {
  setLoading(true);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken(true); // Firebase token
    localStorage.setItem("fbToken", token); // Save token for Axios requests
    setUser(userCredential.user); // Update user state
    return userCredential.user;
  } finally {
    setLoading(false);
  }
};

  // ✅ Sign out user (logout)
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("fbToken");
    } catch (err) {
      console.error("Logout Error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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

const githubSignIn = async () => {
  setLoading(true);
  try {
    const provider = new GithubAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const token = await userCredential.user.getIdToken(true);
    localStorage.setItem("fbToken", token);
    setUser(userCredential.user);
    return userCredential.user;
  } finally {
    setLoading(false);
  }
};


  // ✅ Update Firebase profile
  const updateUserProfiles = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };


  // ✅ Send email verification
  const sendVerificationEmail = () => {
    if (auth.currentUser) {
      return sendEmailVerification(auth.currentUser);
    }
    return Promise.reject("No user logged in");
  };

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    if (currentUser) {
      const token = await currentUser.getIdToken(true);
      localStorage.setItem("fbToken", token); // ✅ Save token
    } else {
      localStorage.removeItem("fbToken");
    }
    setLoading(false);
  });
  return () => unsubscribe();
}, []);


  // Auth context
  const authInfo = {
    user,
    loading,
    setUser,
    createUser,
    signInUser,
    logOut,
    signInGoogleUser,
    githubSignIn,
    updateUserProfiles,
    sendVerificationEmail,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
