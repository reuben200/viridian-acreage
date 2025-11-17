import { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import useFormValidation from "../../hooks/useFormValidation";
import useRateLimit from "../../hooks/useRateLimit";

const Signup = () => {
  const { signup, signupWithGoogle } = useAuth();
  const { errors, validate, clearError } = useFormValidation();
  const { isBlocked, blockTimeRemaining, recordAttempt, resetAttempts } =
    useRateLimit(5, 300000); // 5 attempts / 5 minutes

  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    businessType: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  // Handle email/password signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      setMessage(`⏳ Too many attempts. Try again in ${blockTimeRemaining}s.`);
      return;
    }

    if (!validate(form)) {
      setMessage("❌ Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await signup(form.email, form.password, form);
      resetAttempts();
      setMessage("✅ Account created successfully!");
    } catch (err) {
      console.error("Signup failed:", err.message);
      recordAttempt();
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      await signupWithGoogle();
      setMessage("✅ Signed up successfully with Google!");
    } catch (err) {
      console.error("Google signup failed:", err.message);
      setMessage("❌ Google signup failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl lg:max-w-2xl"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <img
              src="/images/V.webp"
              alt="Logo"
              className="rounded-full w-20 h-20 mx-auto mb-3 ring-4 ring-emerald-100 dark:ring-emerald-900/30"
            />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Create Your Account
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Manage quotations and bulk orders effortlessly.
            </p>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50"
          >
            <FcGoogle size={24} />
            {googleLoading ? "Signing in..." : "Sign up with Google"}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium">
                or
              </span>
            </div>
          </div>

          {/* --- FORM START --- */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business Name + Type */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Business Type
                </label>
                <select
                  name="businessType"
                  value={form.businessType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Type</option>
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
            </div>

            {/* Contact + Phone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:text-gray-200"
                />
              </div>
            </div>

            {/* Email + Password */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:text-gray-200"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-none dark:text-gray-200"
              />
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading || isBlocked}
              className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-500/30 ${
                (loading || isBlocked) && "opacity-60 cursor-not-allowed"
              }`}
            >
              {loading
                ? "Creating Account..."
                : isBlocked
                ? `Try again in ${blockTimeRemaining}s`
                : "Sign Up"}
            </motion.button>
          </form>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center text-sm font-medium py-3 px-4 rounded-lg ${
                message.includes("✅")
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                  : message.includes("⏳")
                  ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Footer */}
          <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
