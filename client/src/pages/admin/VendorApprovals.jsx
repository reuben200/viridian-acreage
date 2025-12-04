// src/pages/admin/VendorApprovals.jsx
import { useEffect, useState } from "react";
import {
  writeBatch,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { fetchCollection } from "../../services/firestoreHelpers";
import { Loader2, CheckCircle, XCircle, PauseCircle } from "lucide-react";

/**
 * Vendor Approval Page (Admin Only)
 * - Fetches vendors with status "pending_approval"
 * - Approve / Reject / Suspend
 * - Updates BOTH vendors/{uid} and users/{uid}
 */
const VendorApprovals = () => {
  const { currentUser } = useAuth(); // Admin
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  // ------------------------------------------------------
  // LOAD PENDING VENDORS
  // ------------------------------------------------------
  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await fetchCollection({
        path: "vendors",
        filters: [{ field: "status", operator: "==", value: "pending_approval" }],
        sort: { field: "createdAt", direction: "desc" },
      });

      setVendors(data);
    } catch (err) {
      console.error("Vendor fetch failed:", err);
      setError("Failed to load pending vendors.");
    }

    setLoading(false);
  };

  // ------------------------------------------------------
  // INTERNAL: Write vendor and user in one batch
  // ------------------------------------------------------
  const updateVendorAndUser = async (uid, vendorPayload, userPayload) => {
    const batch = writeBatch(db);
    const vendorRef = doc(db, "vendors", uid);
    const userRef = doc(db, "users", uid);

    batch.set(vendorRef, vendorPayload, { merge: true });
    batch.set(userRef, userPayload, { merge: true });

    await batch.commit();
  };

  // ------------------------------------------------------
  // APPROVE VENDOR
  // ------------------------------------------------------
  const handleApprove = async (vendor) => {
    if (!window.confirm(`Approve vendor "${vendor.businessName}"?`)) return;

    setProcessingId(vendor.uid);

    try {
      await updateVendorAndUser(
        vendor.uid,
        {
          status: "approved",
          approvedAt: serverTimestamp(),
          moderatorId: currentUser.uid,
          moderatorName:
            currentUser.displayName || currentUser.email || "Admin",
        },
        {
          role: "partner",
          status: "approved",
          approvedAt: serverTimestamp(),
        }
      );

      setVendors((prev) => prev.filter((v) => v.uid !== vendor.uid));
      alert("Vendor approved successfully!");
    } catch (err) {
      console.error("Approve error:", err);
      setError("Failed to approve vendor.");
    }

    setProcessingId(null);
  };

  // ------------------------------------------------------
  // REJECT VENDOR
  // ------------------------------------------------------
  const handleReject = async (vendor) => {
    const reason = window.prompt(
      `Reject vendor "${vendor.businessName}". Enter reason (optional):`
    );
    if (reason === null) return;

    if (!window.confirm(`Confirm rejection?`)) return;

    setProcessingId(vendor.uid);

    try {
      await updateVendorAndUser(
        vendor.uid,
        {
          status: "rejected",
          rejectedAt: serverTimestamp(),
          moderatorId: currentUser.uid,
          rejectionReason: reason || null,
        },
        {
          status: "rejected",
          rejectedAt: serverTimestamp(),
        }
      );

      setVendors((prev) => prev.filter((v) => v.uid !== vendor.uid));
      alert("Vendor rejected.");
    } catch (err) {
      console.error("Reject error:", err);
      setError("Failed to reject vendor.");
    }

    setProcessingId(null);
  };

  // ------------------------------------------------------
  // SUSPEND VENDOR
  // ------------------------------------------------------
  const handleSuspend = async (vendor) => {
    const reason = window.prompt(
      `Suspend "${vendor.businessName}". Enter reason (optional):`
    );
    if (reason === null) return;

    if (!window.confirm(`Confirm suspension?`)) return;

    setProcessingId(vendor.uid);

    try {
      await updateVendorAndUser(
        vendor.uid,
        {
          status: "suspended",
          suspendedAt: serverTimestamp(),
          suspensionReason: reason || null,
          moderatorId: currentUser.uid,
        },
        {
          status: "suspended",
          suspendedAt: serverTimestamp(),
        }
      );

      setVendors((prev) => prev.filter((v) => v.uid !== vendor.uid));
      alert("Vendor suspended.");
    } catch (err) {
      console.error("Suspend error:", err);
      setError("Failed to suspend vendor.");
    }

    setProcessingId(null);
  };

  // ------------------------------------------------------
  // UI RENDER
  // ------------------------------------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Vendor Approvals</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading pending vendors...
        </div>
      ) : vendors.length === 0 ? (
        <p className="text-gray-500">No pending vendors at the moment.</p>
      ) : (
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <div
              key={vendor.uid}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
              {/* Vendor Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
                    {vendor.businessName?.[0] || "V"}
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {vendor.businessName}
                    </div>

                    <div className="text-sm text-gray-500">
                      {vendor.contactPerson} • {vendor.email}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      {vendor.businessType} • Categories:{" "}
                      {(vendor.categories || []).join(", ")}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      Requested:{" "}
                      {vendor.createdAt?.toDate
                        ? vendor.createdAt.toDate().toLocaleString()
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(vendor)}
                  disabled={processingId === vendor.uid}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>

                <button
                  onClick={() => handleReject(vendor)}
                  disabled={processingId === vendor.uid}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>

                <button
                  onClick={() => handleSuspend(vendor)}
                  disabled={processingId === vendor.uid}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                >
                  <PauseCircle className="w-4 h-4" /> Suspend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VendorApprovals;