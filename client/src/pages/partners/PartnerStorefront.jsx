import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { Loader2, PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PartnerStorefront = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Fetch vendor-owned products */
  useEffect(() => {
    if (!currentUser?.uid) return; // prevent crash if user loads slowly

    const loadProducts = async () => {
      try {
        const q = query(
          collection(db, "products"),
          where("ownerId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(list);
      } catch (err) {
        console.error("Failed to fetch vendor products:", err);
      }

      setLoading(false);
    };

    loadProducts();
  }, [currentUser]);

  /** Delete product */
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "This product will be permanently deleted. Continue?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "products", productId));

      // Animate removal
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  /** Loading State */
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-600 dark:text-gray-300">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading your products...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Storefront
        </h1>

        <Link
          to="/partner/products/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Add Product
        </Link>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <PackageSearch className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">You haven&apos;t added any products yet.</p>
          <Link
            to="/partner/products/create"
            className="text-green-600 font-semibold hover:underline mt-2 inline-block"
          >
            Add your first product →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                {/* Image */}
                <div className="h-40 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={product.images?.[0] || "/no-image.png"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                    {product.name}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {product.category}
                  </p>

                  <p className="text-green-600 dark:text-green-400 font-bold mt-3">
                    ₦{Number(product.currentPrice).toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Min Order: {product.minOrder || "—"}
                  </p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full ${
                      product.stockStatus === "In stock"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {product.stockStatus}
                  </span>

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-5 text-sm">
                    <Link
                      to={`/partner/products/${product.id}`}
                      className="text-green-600 hover:text-green-700 font-semibold"
                    >
                      View
                    </Link>

                    <Link
                      to={`/partner/products/${product.id}/edit`}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PartnerStorefront;
