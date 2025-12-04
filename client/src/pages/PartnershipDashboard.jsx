import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { Loader2, CheckCircle, XCircle, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";

const PartnerDashboard = () => {
  const { role } = useAuth();
  const [partnerships, setPartnerships] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 10;

  // Fetch partnerships (with search, filter, and pagination)
  const fetchPartnerships = async (reset = true) => {
    setLoading(true);
    try {
      let q = query(
        collection(db, "partnerships"),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      // Apply filter
      if (filter !== "All") {
        q = query(
          collection(db, "partnerships"),
          where("status", "==", filter),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      // Apply search (Firestore only allows one "where" per field)
      if (searchTerm.trim()) {
        q = query(
          collection(db, "partnerships"),
          where("businessName", ">=", searchTerm),
          where("businessName", "<=", searchTerm + "\uf8ff"),
          orderBy("businessName"),
          limit(pageSize)
        );
      }

      if (!reset && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      setPartnerships((prev) => (reset ? docs : [...prev, ...docs]));
      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === pageSize);
    } catch (err) {
      console.error("Error fetching partnerships:", err);
      setError("Failed to load partnership inquiries.");
    } finally {
      setLoading(false);
    }
  };

  // Initial + search/filter trigger
  useEffect(() => {
    fetchPartnerships(true);
  }, [filter, searchTerm]);

  // Status update
  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, "partnerships", id), { status: newStatus });
      setPartnerships((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update status. Try again.");
    } finally {
      setUpdating(null);
    }
  };

  // Delete record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setUpdating(id);
    try {
      await deleteDoc(doc(db, "partnerships", id));
      setPartnerships((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete record:", err);
      setError("Delete failed. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  // Filter + Search + Pagination UI
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Partnership Inquiries
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Top Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full font-medium text-sm ${
                  filter === status
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search business name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Business Name</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Tier</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && partnerships.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    <p>Loading partnerships...</p>
                  </td>
                </tr>
              ) : partnerships.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    No partnerships found.
                  </td>
                </tr>
              ) : (
                partnerships.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {p.businessName}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      <div>
                        <p>{p.contactPerson}</p>
                        <p className="text-xs text-gray-500">{p.email}</p>
                        <p className="text-xs text-gray-500">{p.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-green-600 dark:text-green-400 font-semibold">
                      {p.tier || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.status === "Approved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : p.status === "Rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {p.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                      {p.createdAt?.toDate
                        ? p.createdAt.toDate().toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      {p.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(p.id, "Approved")}
                            disabled={updating === p.id}
                            className="text-green-600 hover:text-green-800 dark:text-green-400"
                          >
                            {updating === p.id ? (
                              <Loader2 className="w-4 h-4 animate-spin inline" />
                            ) : (
                              <CheckCircle className="w-5 h-5 inline" />
                            )}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(p.id, "Rejected")}
                            disabled={updating === p.id}
                            className="text-red-600 hover:text-red-800 dark:text-red-400"
                          >
                            <XCircle className="w-5 h-5 inline" />
                          </button>
                        </>
                      )}
                      {role === "admin" && (
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={updating === p.id}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                        >
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          {hasMore && !loading && (
            <button
              onClick={() => fetchPartnerships(false)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
