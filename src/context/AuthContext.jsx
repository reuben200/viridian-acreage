// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 SIGNUP
  const signup = async (formData) => {
    const { email, password, name, contactPerson, phone, address, businessType } = formData;

    try {
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Step 2: Store business info in Firestore
      await setDoc(doc(db, "users", uid), {
        name,
        contactPerson,
        email,
        phone,
        address,
        businessType,
        role: "customer", // default role
        status: "Active", // default status
        createdAt: new Date().toISOString(),
      });

      setUser(userCredential.user);
      setRole("customer");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error.message);
      alert("Signup failed: " + error.message);
    }
  };

  // 🔹 LOGIN
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userSnap = await getDoc(doc(db, "users", uid));
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userCredential.user);
        setRole(userData.role);

        if (userData.role === "admin" || userData.role === "super_admin") {
          navigate("/admin");
        } else if (userData.role === "manager") {
          navigate("/manager");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  // 🔹 LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    navigate("/login");
  };

  // 🔹 RESET PASSWORD
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent to your email.");
    } catch (error) {
      console.error("Password reset failed:", error.message);
      alert("Error: " + error.message);
    }
  };

  // 🔹 LISTEN TO AUTH CHANGES
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        const userSnap = await getDoc(doc(db, "users", uid));
        const userData = userSnap.exists() ? userSnap.data() : {};
        setUser(currentUser);
        setRole(userData.role || "customer");
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, signup, login, logout, resetPassword, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
