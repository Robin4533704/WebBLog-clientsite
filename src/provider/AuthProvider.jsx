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

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Environment variable or fallback
  const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  // ✅ Improved API call function
  const apiCall = async (endpoint, options = {}) => {
    try {
      console.log("🔗 API Call to:", `${API_BASE_URL}${endpoint}`);

      const finalOptions = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      };

      // Get Firebase token for authenticated requests
      const currentUser = auth.currentUser;
      if (currentUser && !endpoint.includes('/auth/public')) {
        try {
          const token = await currentUser.getIdToken();
          finalOptions.headers.Authorization = `Bearer ${token}`;
        } catch (tokenError) {
          console.warn("Token not available:", tokenError);
        }
      }

      if (finalOptions.body && typeof finalOptions.body === "object") {
        finalOptions.body = JSON.stringify(finalOptions.body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ API call failed:", error);
      throw error;
    }
  };

  // ✅ Create user with proper data structure
  const createUser = async (email, password, userData = {}) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Prepare user data for database
      const dbUserData = {
        _id: user.uid, // ✅ Server expects _id as primary key
        uid: user.uid,
        email: user.email,
        name: userData.name || "",
        displayName: userData.displayName || userData.name || "",
        photoURL: userData.photoURL || "",
        role: "user",
        created_at: new Date(),
        emailVerified: user.emailVerified,
      };

      // Save to MongoDB
      try {
        await apiCall("/users", {
          method: "POST",
          body: dbUserData,
        });
        console.log("✅ User created in database successfully");
      } catch (dbError) {
        console.warn("⚠️ Failed to create user in database:", dbError);
        // Don't throw error - user can still use the app
      }

      // Update local state
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: dbUserData.displayName,
        photoURL: dbUserData.photoURL,
        emailVerified: user.emailVerified,
      });

      return user;
    } catch (error) {
      console.error("❌ Create user error:", error);
      
      // Better error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already exists. Please try logging in.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      }
      
      throw new Error(error.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sign in user
  const signInUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get fresh token
      const token = await user.getIdToken(true);
      localStorage.setItem("fbToken", token);

      // Update user state
      const userState = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      };

      setUser(userState);

      // Sync with database if needed
      if (user.displayName) {
        try {
          await apiCall("/users", {
            method: "POST",
            body: {
              _id: user.uid,
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role: "user",
              last_login: new Date(),
            },
          });
        } catch (dbError) {
          console.warn("⚠️ Failed to sync user with database:", dbError);
        }
      }

      return user;
    } catch (error) {
      console.error("❌ Sign in error:", error);
      
      // Better error messages
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      }
      
      throw new Error(error.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login - FIXED for server compatibility
  const signInGoogleUser = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Get token
      const token = await user.getIdToken(true);
      localStorage.setItem("fbToken", token);

      // Prepare user data for server
      const userData = {
        _id: user.uid, // ✅ Server expects _id
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: "user",
        created_at: new Date(),
        emailVerified: user.emailVerified,
        provider: "google",
      };

      // Save/update user in DB - using POST as server expects
      try {
        await apiCall("/users", {
          method: "POST",
          body: userData,
        });
        console.log("✅ Google user saved to database successfully");
      } catch (dbError) {
        console.warn("⚠️ Failed to save Google user to database:", dbError);
        // Don't throw - user can still proceed
      }

      // Update local state
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      });

      return user;
    } catch (error) {
      console.error("❌ Google login error:", error);
      throw new Error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update user profile - FIXED for server routes
  const updateUserProfiles = async (profileInfo) => {
    if (!auth.currentUser) throw new Error("No user logged in");
    
    setLoading(true);
    try {
      // Firebase profile update
      await updateProfile(auth.currentUser, profileInfo);
      await reload(auth.currentUser);

      const updatedUser = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: profileInfo.displayName || auth.currentUser.displayName,
        photoURL: profileInfo.photoURL || auth.currentUser.photoURL,
        emailVerified: auth.currentUser.emailVerified,
      };

      setUser(updatedUser);

      // ✅ Update in DB using correct endpoint
      try {
        await apiCall(`/users/${auth.currentUser.uid}`, {
          method: "PATCH",
          body: {
            displayName: profileInfo.displayName,
            photoURL: profileInfo.photoURL,
            last_updated: new Date(),
          },
        });
        console.log("✅ User updated in DB successfully");
      } catch (dbError) {
        console.warn("⚠️ Failed to update user in database:", dbError);
      }

      return updatedUser;
    } catch (error) {
      console.error("❌ Profile update failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send verification email
  const sendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error("No user logged in");
    try {
      await sendEmailVerification(auth.currentUser);
      return true;
    } catch (error) {
      console.error("❌ Verification email error:", error);
      throw error;
    }
  };

  // ✅ Logout
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("fbToken");
      setUser(null);
    } catch (error) {
      console.error("❌ Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auth state listener - IMPROVED
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Get fresh token
          const token = await currentUser.getIdToken(true);
          localStorage.setItem("fbToken", token);

          const userState = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            emailVerified: currentUser.emailVerified,
          };

          setUser(userState);

          // Sync with database if user has basic info
          if (currentUser.displayName || currentUser.photoURL) {
            try {
              await apiCall("/users", {
                method: "POST",
                body: {
                  _id: currentUser.uid,
                  uid: currentUser.uid,
                  email: currentUser.email,
                  displayName: currentUser.displayName,
                  photoURL: currentUser.photoURL,
                  role: "user",
                  last_login: new Date(),
                },
              });
            } catch (dbError) {
              console.warn("⚠️ Failed to sync user with database:", dbError);
            }
          }
        } catch (err) {
          console.error("❌ Token Refresh Error:", err);
          localStorage.removeItem("fbToken");
          setUser(null);
        }
      } else {
        localStorage.removeItem("fbToken");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    apiCall, // ✅ Export apiCall for other components
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;