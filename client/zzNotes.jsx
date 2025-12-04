// src/pages/admin/VendorDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  fetchDoc,
  fetchCollection,
  updateDocument,
  createDoc,
} from "../../services/firestoreHelpers";

import {
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Package,
  Clock,
  FileText,
  Archive,
  Activity,
  ExternalLink,
  Download,
} from "lucide-react";

const VendorDetails = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------------------------------------
  // LOAD VENDOR DETAILS
  // -----------------------------------------------------------
  useEffect(() => {
    loadVendorDetails();
  }, [vendorId]);

  async function loadVendorDetails() {
    try {
      setLoading(true);

      // Fetch vendor doc
      const vendorData = await fetchDoc("vendors", vendorId);
      if (!vendorData) {
        setVendor(null);
        return;
      }
      setVendor(vendorData);

      // Fetch products owned by vendor
      const productResp = await fetchCollection({
        path: "products",
        filters: [{ field: "ownerId", operator: "==", value: vendorId }],
        sort: { field: "createdAt", direction: "desc" },
      });
      setProducts(productResp?.data || []);

      // Fetch vendor activity log
      const actResp = await fetchCollection({
        path: "vendor_activity",
        filters: [{ field: "vendorId", operator: "==", value: vendorId }],
        sort: { field: "createdAt", direction: "desc" },
      });

      setActivity(actResp?.data || []);
    } catch (err) {
      console.error("Load vendor failed:", err);
      setError("Failed to load vendor details. Check console.");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------------------------
  // RECORD ACTIVITY
  // -----------------------------------------------------------
  async function recordActivity(type, note) {
    const entry = {
      vendorId,
      type,
      note,
      adminId: currentUser.uid,
      createdAt: new Date().toISOString(),
    };

    try {
      // Save to central activity collection
      await createDoc("vendor_activity", null, entry);

      // Update UI
      setActivity((prev) => [entry, ...prev]);
    } catch (err) {
      console.warn("Failed to record activity:", err);
    }
  }

  // -----------------------------------------------------------
  // STATUS UPDATE (approve / suspend / reject)
  // -----------------------------------------------------------
  async function handleStatusChange(newStatus) {
    if (!window.confirm(`Change vendor status to "${newStatus}"?`)) return;

    setActionLoading(true);

    try {
      // Update vendors/{id}
      await updateDocument("vendors", vendorId, {
        status: newStatus,
        lastStatusChangedAt: new Date().toISOString(),
        lastStatusChangedBy: currentUser.uid,
      });

      // Update users/{id}
      await updateDocument("users", vendorId, {
        role: "partner",
        status: newStatus,
      });

      await recordActivity(
        "status_change",
        `Vendor status updated to ${newStatus}`
      );

      // Reload vendor data
      const updated = await fetchDoc("vendors", vendorId);
      setVendor(updated);
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update vendor status.");
    } finally {
      setActionLoading(false);
    }
  }

  // -----------------------------------------------------------
  // STATUS STYLING
  // -----------------------------------------------------------
  function getStatusConfig(status) {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          color: "text-emerald-700",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: CheckCircle2,
        };
      case "pending_approval":
        return {
          label: "Pending Approval",
          color: "text-amber-700",
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: Clock,
        };
      case "suspended":
        return {
          label: "Suspended",
          color: "text-red-700",
          bg: "bg-red-50",
          border: "border-red-200",
          icon: XCircle,
        };
      default:
        return {
          label: status,
          color: "text-gray-700",
          bg: "bg-gray-100",
          border: "border-gray-300",
          icon: Clock,
        };
    }
  }

  const statusConfig = getStatusConfig(vendor?.status ?? "loading");
  const StatusIcon = statusConfig.icon;

  // -----------------------------------------------------------
  // LOADING / NOT FOUND
  // -----------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <Loader2 className="w-6 h-6 animate-spin" />
        &nbsp; Loading vendor...
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <XCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Vendor Not Found</h2>
        <p className="text-gray-600 mb-4">
          The vendor you're looking for does not exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  // -----------------------------------------------------------
  // UI RENDER
  // -----------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} /> Back to Vendors
      </button>

      {/* HEADER */}
      <div className="bg-white rounded-xl p-6 border shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row justify-between">
          <div>
            <h1 className="text-3xl font-bold">{vendor.businessName}</h1>
            <p className="text-gray-600">{vendor.businessType}</p>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User size={16} />
                {vendor.contactPerson}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href={`mailto:${vendor.email}`} className="text-blue-600">
                  {vendor.email}
                </a>
              </div>
              {vendor.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  {vendor.phone}
                </div>
              )}
            </div>
          </div>

          {/* STATUS + ACTIONS */}
          <div className="flex flex-col items-start lg:items-end mt-4 lg:mt-0 gap-3">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
            >
              <StatusIcon size={18} />
              {statusConfig.label}
            </span>

            <div className="flex gap-2 flex-wrap">
              {vendor.status !== "approved" && (
                <button
                  onClick={() => handleStatusChange("approved")}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                >
                  {actionLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  Approve
                </button>
              )}

              {vendor.status !== "suspended" && (
                <button
                  onClick={() => handleStatusChange("suspended")}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  {actionLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  Suspend
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <InfoCard
          icon={<MapPin size={20} className="text-blue-600" />}
          title="Address"
          value={vendor.address || "No address provided"}
        />

        <InfoCard
          icon={<Phone size={20} className="text-purple-600" />}
          title="Phone"
          value={vendor.phone || "No phone number"}
        />

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Package className="text-emerald-600" size={20} />
            </div>
            <h4 className="font-semibold text-gray-900">Products</h4>
          </div>

          <p className="text-3xl font-bold">{products.length}</p>

          <Link
            to={`/admin/vendors/${vendorId}/products`}
            className="flex items-center gap-1 text-blue-600 mt-2"
          >
            View all <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* DOCUMENTS */}
      <DocumentsSection vendor={vendor} />

      {/* ACTIVITY */}
      <ActivitySection activity={activity} />
    </div>
  );
};

// -----------------------------------------------------------
// SUB COMPONENTS
// -----------------------------------------------------------
function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}

function DocumentsSection({ vendor }) {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <FileText className="text-indigo-600" size={20} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Documents</h3>
        </div>
      </div>

      {!vendor.documents?.length ? (
        <div className="text-center text-gray-600 py-10">
          <Archive size={32} className="mx-auto mb-3 text-gray-400" />
          No documents uploaded
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendor.documents.map((d, i) => (
            <a
              href={d.url}
              target="_blank"
              rel="noreferrer"
              key={i}
              className="p-4 border rounded-lg hover:shadow-md transition flex items-start gap-3"
            >
              <Archive size={20} className="text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">{d.name}</div>
                <div className="text-xs text-gray-500">{d.type}</div>
              </div>
              <Download size={16} className="ml-auto text-gray-400" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ActivitySection({ activity }) {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm mb-20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <Activity className="text-orange-600" size={20} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Activity Log</h3>
      </div>

      {!activity.length ? (
        <p className="text-gray-600 text-center py-10">
          No activity recorded yet.
        </p>
      ) : (
        <div className="space-y-3">
          {activity.map((event, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg hover:shadow transition flex gap-4"
            >
              <Activity size={20} className="text-blue-600" />

              <div className="flex-1">
                <div className="font-semibold text-gray-900 capitalize">
                  {event.type.replace(/_/g, " ")}
                </div>
                <p className="text-sm text-gray-600">{event.note}</p>
              </div>

              <div className="text-xs text-gray-500 whitespace-nowrap">
                {new Date(event.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VendorDetails;
