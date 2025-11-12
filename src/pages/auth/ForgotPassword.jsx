import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Mail, Loader2, ArrowLeft } from "lucide-react";
import useFormValidation from "../../hooks/useFormValidation";
import { useAuth } from "../../context/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { validateEmail } = useFormValidation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      setMessage("✅ Password reset link sent to your email.");
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">
            Reset Your Password
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Enter your email address to receive a reset link
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2">
              <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 dark:text-green-300 text-sm">
                {message}
              </p>
            </div>
          )}

          {/* Email Input */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  disabled={loading}
                  aria-invalid={!!error}
                  aria-describedby={error ? "email-error" : undefined}
                  className={`w-full px-4 py-3 pl-11 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : focused
                      ? "border-green-500 focus:ring-green-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-green-500"
                  }`}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          If you didn’t receive an email, check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
