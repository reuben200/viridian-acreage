import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useFormValidation from "../../hooks/useFormValidation";
import useRateLimit from "../../hooks/useRateLimit";

const Signup = () => {
  const { signup } = useAuth();
  const { errors, validate, clearError } = useFormValidation();
  const { isBlocked, blockTimeRemaining, recordAttempt, resetAttempts } =
    useRateLimit(5, 300000); // 5 tries per 5 min

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      alert(`Too many attempts. Try again in ${blockTimeRemaining}s.`);
      return;
    }

    if (!validate(form)) return;

    setLoading(true);
    try {
      await signup(form);
      resetAttempts(); // reset on success
    } catch (err) {
      console.error("Signup failed:", err.message);
      recordAttempt();
      alert("Signup failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-green-600 mb-2">
          Create Your Business Account
        </h2>
        <p className="text-center text-gray-500 text-sm mb-4">
          Register to manage quotations and bulk orders easily.
        </p>

        {/* BUSINESS NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Business Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* CONTACT PERSON */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contact Person
          </label>
          <input
            type="text"
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>

        {/* BUSINESS TYPE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Business Type
          </label>
          <select
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Type</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Distributor">Distributor</option>
          </select>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading || isBlocked}
          className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition ${
            (loading || isBlocked) && "opacity-60 cursor-not-allowed"
          }`}
        >
          {loading
            ? "Creating Account..."
            : isBlocked
            ? `Try again in ${blockTimeRemaining}s`
            : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
