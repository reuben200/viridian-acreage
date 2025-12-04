import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Loader2,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Lock,
  CheckCircle,
} from "lucide-react";

const VendorSignup = () => {
  const [form, setForm] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    businessType: "",
    categories: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!form.businessName || !form.email || !form.password) {
      return "Please fill all required fields.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  // Inside component:
  const { signupVendor } = useAuth();

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      await signupVendor(form); // Your actual AuthContext method
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed. Try again.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-10 px-4">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Welcome to the Viridian Vendor Network. Your application is being
            reviewed.
          </p>
          <a
            href="/login"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Viridian</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Become a Vendor Partner
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our growing network of trusted suppliers and expand your
            business reach
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Steps */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">
                    1
                  </span>
                </div>
                <span className="text-white font-medium hidden sm:inline">
                  Business Info
                </span>
              </div>
              <div className="flex-1 h-1 bg-white bg-opacity-30 mx-4"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <span className="text-white text-opacity-70 font-medium hidden sm:inline">
                  Review
                </span>
              </div>
              <div className="flex-1 h-1 bg-white bg-opacity-30 mx-4"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">3</span>
                </div>
                <span className="text-white text-opacity-70 font-medium hidden sm:inline">
                  Complete
                </span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 md:p-10">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Business Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Business Name"
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  icon={Building2}
                  required
                  placeholder="Enter your business name"
                />
                <InputField
                  label="Contact Person"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  icon={User}
                  required
                  placeholder="Full name of contact person"
                />
                <InputField
                  label="Business Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  icon={Mail}
                  required
                  placeholder="your@business.com"
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  icon={Phone}
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Business Location
              </h3>
              <div className="grid grid-cols-1 gap-5">
                <InputField
                  label="Business Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  icon={MapPin}
                  placeholder="Street address"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                  <InputField
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                Products & Services
              </h3>
              <div className="grid grid-cols-1 gap-5">
                <InputField
                  label="Business Type"
                  name="businessType"
                  value={form.businessType}
                  onChange={handleChange}
                  icon={Package}
                  placeholder="E.g. Vegetable supplier, palm oil distributor"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Categories
                  </label>
                  <textarea
                    name="categories"
                    value={form.categories}
                    onChange={handleChange}
                    rows="3"
                    placeholder="List the product categories you offer (e.g., Spices, Vegetables, Grains)"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Account Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  icon={Lock}
                  required
                  placeholder="Minimum 6 characters"
                />
                <InputField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  icon={Lock}
                  required
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="text-green-600 hover:underline font-medium"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-green-600 hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Building2 className="w-5 h-5" />
                  Register as Vendor Partner
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-600 hover:text-green-700 font-semibold hover:underline"
            >
              Sign in here
            </a>
          </p>
          <p className="text-gray-600 mt-2">
            Are you a customer?{" "}
            <a
              href="/join"
              className="text-green-600 hover:text-green-700 font-semibold hover:underline"
            >
              Customer registration
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  icon: Icon,
  required = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${
          Icon ? "pl-11" : "pl-4"
        } pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none`}
      />
    </div>
  </div>
);

export default VendorSignup;
