// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // 🔹 While still checking user state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Checking permissions...
      </div>
    );
  }

  // 🔹 Not signed in → redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = currentUser.role || "customer"; // fallback for safety

  // 🔹 If user exists but role not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect based on user role
    switch (userRole) {
      case "admin":
      case "super_admin":
        return <Navigate to="/admin" replace />;
      case "manager":
        return <Navigate to="/manager" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;
