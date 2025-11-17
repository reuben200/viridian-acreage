// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// --- CONTEXT CREATION ---
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- HELPER: Redirect user based on role ---
  const redirectByRole = (role) => {
    if (role === "admin" || role === "super_admin") navigate("/admin");
    else if (role === "manager") navigate("/manager");
    else navigate("/dashboard");
  };

  // --- SIGNUP (Email/Password) ---
  const signup = async (formData) => {
    const {
      email,
      password,
      name,
      contactPerson,
      phone,
      address,
      businessType,
    } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const userData = {
        name,
        contactPerson,
        email,
        phone,
        address,
        businessType,
        role: "customer",
        status: "Active",
        provider: "email",
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", uid), userData);
      redirectByRole("customer");
    } catch (error) {
      console.error("Signup failed:", error.message);
      alert("Signup failed: " + error.message);
    }
  };

  // --- GOOGLE SIGNUP / LOGIN ---
  const signupWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      let result;
      try {
        // Try Popup first
        result = await signInWithPopup(auth, provider);
      } catch (popupError) {
        // If popup blocked or closed, fallback to redirect
        if (
          popupError.code === "auth/popup-blocked" ||
          popupError.code === "auth/popup-closed-by-user"
        ) {
          console.warn(
            "Popup closed by user or blocked. Using redirect flow..."
          );
          await signInWithRedirect(auth, provider);
          return;
        } else {
          throw popupError;
        }
      }

      const googleUser = result.user;
      const userRef = doc(db, "users", googleUser.uid);
      const userSnap = await getDoc(userRef);
      let userData;

      if (!userSnap.exists()) {
        userData = {
          name: googleUser.displayName || "Unnamed User",
          email: googleUser.email,
          role: "customer",
          status: "Active",
          provider: "google",
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, userData);
      } else {
        userData = userSnap.data();
      }

      redirectByRole(userData.role);
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.log("User closed the popup manually — not an error.");
        return;
      }
      console.error("Google Sign-In failed:", error.message);
      alert("Google Sign-In failed: " + error.message);
    }
  };

  // --- Handle Redirect Sign-In (if popup fails) ---
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const googleUser = result.user;
          const userRef = doc(db, "users", googleUser.uid);
          const userSnap = await getDoc(userRef);
          let userData;

          if (!userSnap.exists()) {
            userData = {
              name: googleUser.displayName || "Unnamed User",
              email: googleUser.email,
              role: "customer",
              status: "Active",
              provider: "google",
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, userData);
          } else {
            userData = userSnap.data();
          }

          redirectByRole(userData.role);
        }
      })
      .catch((err) => console.error("Redirect Sign-In Error:", err));
  }, []);

  // --- LOGIN (Email/Password) ---
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      const userSnap = await getDoc(doc(db, "users", uid));
      const userData = userSnap.exists()
        ? userSnap.data()
        : { role: "customer" };

      redirectByRole(userData.role);
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // --- RESET PASSWORD ---
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent to your email.");
    } catch (error) {
      console.error("Password reset failed:", error.message);
      alert("Error: " + error.message);
    }
  };

  // --- ON AUTH STATE CHANGE ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const uid = authUser.uid;
          const userRef = doc(db, "users", uid);
          const userSnap = await getDoc(userRef);

          let firestoreData;
          if (!userSnap.exists()) {
            firestoreData = {
              name: authUser.displayName || "Unnamed User",
              email: authUser.email,
              role: "customer",
              status: "Active",
              provider: authUser.providerData[0]?.providerId || "unknown",
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, firestoreData);
          } else {
            firestoreData = userSnap.data();
          }

          setCurrentUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            ...firestoreData,
          });
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        signup,
        signupWithGoogle,
        login,
        logout,
        resetPassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
