// src/pages/auth/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import useFormValidation from "../../hooks/useFormValidation";
import useRateLimit from "../../hooks/useRateLimit";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { errors, validate, setErrors } = useFormValidation();
  const { isBlocked, blockTimeRemaining, recordAttempt } = useRateLimit();

  // Load remembered email on mount
  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe");
    const savedEmail = localStorage.getItem("userEmail");
    if (remembered && savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  // Generic Firebase error map
  const getFirebaseErrorMessage = (err) => {
    const errorCode = err?.code || err?.message || "";
    const messages = {
      "auth/invalid-credential": "Invalid email or password",
      "auth/user-not-found": "No account found with this email",
      "auth/wrong-password": "Incorrect password",
      "auth/too-many-requests":
        "Too many failed attempts. Please try again later",
      "auth/user-disabled": "This account has been disabled",
      "auth/network-request-failed":
        "Network error. Please check your connection",
      "auth/invalid-email": "Invalid email format",
      "auth/invalid-login-credentials": "Invalid email or password",
      "auth/missing-password": "Please enter your password",
      "auth/weak-password": "Password should be at least 6 characters",
    };
    return messages[errorCode] || "Login failed. Please try again";
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  // Submit login form
  const handleSubmit = async () => {
    setError("");
    if (!validate(form)) return;
    if (isBlocked) {
      setError(`Too many attempts. Please wait ${blockTimeRemaining} seconds`);
      return;
    }

    setLoading(true);
    try {
      // Remember Me
      if (form.rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("userEmail", form.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("userEmail");
      }

      await login(form.email, form.password); // 🔹 handled in AuthContext
    } catch (err) {
      recordAttempt();
      console.error("Login error:", err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading && !isBlocked) handleSubmit();
  };

  // Navigate helpers
  const handleForgotPassword = () => navigate("/forgot-password");
  const handleSignUp = () => navigate("/signup");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/public/images/V.webp"
              alt="Logo"
              className="rounded-full w-20 h-20 object-cover ring-4 ring-green-100 dark:ring-green-900"
            />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Sign in to continue
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
              disabled={loading || isBlocked}
              className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : focusedInput === "email"
                  ? "border-green-500 focus:ring-green-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-green-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                disabled={loading || isBlocked}
                className={`w-full px-4 py-3 pr-12 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : focusedInput === "password"
                    ? "border-green-500 focus:ring-green-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-green-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || isBlocked}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me + Forgot */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                disabled={loading || isBlocked}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-green-600 hover:text-green-700 dark:text-green-400"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || isBlocked}
            aria-busy={loading || isBlocked}
            className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              loading || isBlocked
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : isBlocked ? (
              `Wait ${blockTimeRemaining}s`
            ) : (
              "Sign In"
            )}
          </button>

          {/* Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={handleSignUp}
                className="text-green-600 hover:text-green-700 dark:text-green-400"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
};

export default Login;
