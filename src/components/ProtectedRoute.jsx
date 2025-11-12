// src/components/ProtectedRoute.jsx
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // 🔹 While still checking user state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Checking permissions...
      </div>
    );
  }

  // 🔹 If no user → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔹 If user exists but role not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // this redirect safely to user’s default dashboard
    if (role === "admin" || role === "super_admin")
      return <Navigate to="/admin" replace />;
    if (role === "manager") return <Navigate to="/manager" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;
