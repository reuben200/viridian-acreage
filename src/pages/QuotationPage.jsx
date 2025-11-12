import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Send } from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const QuotationPage = () => {
  const [user, setUser] = useState(null);
  const [productsList, setProductsList] = useState([]); // 🔹 Live Firestore products
  const [formData, setFormData] = useState({
    products: [],
    deliveryLocation: "",
    preferredSchedule: "",
    monthlyVolume: "",
    additionalInfo: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Listen for auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // 🔹 Fetch live product data from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id, // document ID
          ...docSnap.data(),
        }));
        setProductsList(products);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Add new product selection row
  const addProductRow = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { productId: "", productName: "", quantity: 1, unit: "" },
      ],
    }));
  };

  const updateProductRow = (index, patch) => {
    setFormData((prev) => {
      const products = [...prev.products];
      products[index] = { ...products[index], ...patch };
      return { ...prev, products };
    });
  };

  const removeProductRow = (index) => {
    setFormData((prev) => {
      const products = [...prev.products];
      products.splice(index, 1);
      return { ...prev, products };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to submit a quotation.");
      return;
    }

    if (!formData.products.length) {
      setError("Please add at least one product to the quotation.");
      return;
    }

    setSaving(true);
    try {
      const customerRef = doc(db, "customers", user.uid);

      const products = formData.products.map((p) => ({
        productId: p.productId,
        productName: p.productName || p.productId,
        quantity: Number(p.quantity),
        unit: p.unit || "",
      }));

      await addDoc(collection(db, "quotations"), {
        customerId: user.uid,
        customerRef: customerRef,
        products,
        deliveryLocation: formData.deliveryLocation || "",
        preferredSchedule: formData.preferredSchedule || "",
        monthlyVolume: formData.monthlyVolume || "",
        additionalInfo: formData.additionalInfo || "",
        status: "Pending",
        reviewedBy: null,
        createdAt: Timestamp.now(),
      });

      setSubmitted(true);
      setFormData({
        products: [],
        deliveryLocation: "",
        preferredSchedule: "",
        monthlyVolume: "",
        additionalInfo: "",
      });
    } catch (err) {
      console.error("Error creating quotation:", err);
      setError("Failed to submit quotation. Try again.");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Confirmation UI after submit
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md text-center shadow-xl"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Request Submitted!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you — your quotation has been submitted. We will review and
            get back to you.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Submit Another Request
          </button>
        </motion.div>
      </div>
    );
  }

  // 🔹 Form UI
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Request a Quote
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Fill out the form below and we'll get back to you with a customized
            quote
          </p>

          {!user && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded mb-6">
              You must be logged in to submit a quotation.{" "}
              <a href="/login" className="font-semibold underline">
                Log in
              </a>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 🔹 Products selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Products Interested In *
                </h3>

                <div className="space-y-3">
                  {formData.products.map((row, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      <select
                        value={row.productId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const product = productsList.find(
                            (p) => p.id === selectedId
                          );
                          updateProductRow(idx, {
                            productId: selectedId,
                            productName: product?.name || selectedId,
                          });
                        }}
                        className="col-span-6 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select product</option>
                        {productsList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name || p.id}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={row.quantity}
                        onChange={(e) =>
                          updateProductRow(idx, { quantity: e.target.value })
                        }
                        className="col-span-3 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Unit (kg, litres)"
                        value={row.unit}
                        onChange={(e) =>
                          updateProductRow(idx, { unit: e.target.value })
                        }
                        className="col-span-2 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeProductRow(idx)}
                        className="col-span-1 text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addProductRow}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Add product
                  </button>
                </div>
              </div>

              {/* Delivery & Schedule */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Delivery Location
                  </label>
                  <input
                    type="text"
                    name="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Preferred Delivery Schedule
                  </label>
                  <select
                    name="preferredSchedule"
                    value={formData.preferredSchedule}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select schedule</option>
                    <option value="weekly">Weekly</option>
                    <option value="twice-weekly">Twice Weekly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Delivery Volume
                </label>
                <select
                  name="monthlyVolume"
                  value={formData.monthlyVolume}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select volume</option>
                  <option value="0-50">Less than 50 kg</option>
                  <option value="50-100">50-100 kg</option>
                  <option value="100-500">100-500 kg</option>
                  <option value="500-1000">500-1000 kg</option>
                  <option value="1000+">1000+ kg</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={saving || !user}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {saving ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuotationPage;
