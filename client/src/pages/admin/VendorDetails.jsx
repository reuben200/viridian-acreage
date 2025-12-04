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
  ShieldCheck,
  AlertCircle,
  Calendar,
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
  // ACTIVITY ICON HELPER
  // -----------------------------------------------------------
  function getActivityIcon(type) {
    switch (type) {
      case "status_change":
        return ShieldCheck;
      case "document_uploaded":
        return FileText;
      case "product_added":
        return Package;
      default:
        return Activity;
    }
  }

  // -----------------------------------------------------------
  // LOADING / NOT FOUND
  // -----------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading vendor details...</span>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Vendor Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The vendor you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // UI RENDER
  // -----------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Vendors</span>
        </button>

        {/* HEADER */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Vendor Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                  {vendor.businessName?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {vendor.businessName}
                  </h1>
                  <p className="text-gray-600 mb-3 font-bold text-xl">
                    {vendor.businessType}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={16} className="text-gray-400" />
                      <span>{vendor.contactPerson || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} className="text-gray-400" />
                      <a
                        href={`mailto:${vendor.email}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {vendor.email}
                      </a>
                    </div>
                    {vendor.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} className="text-gray-400" />
                        <a
                          href={`tel:${vendor.phone}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {vendor.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS + ACTIONS */}
            <div className="flex flex-col items-start lg:items-end gap-4">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
              >
                <StatusIcon size={18} />
                {statusConfig.label}
              </span>

              <div className="flex flex-wrap gap-2">
                {vendor.status !== "approved" && (
                  <button
                    onClick={() => handleStatusChange("approved")}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    {actionLoading ? (
                      <Loader2 size={16} className="animate-spin" />
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    {actionLoading ? (
                      <Loader2 size={16} className="animate-spin" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InfoCard
            icon={<MapPin className="text-blue-600" size={20} />}
            bgColor="bg-blue-100"
            title="Address"
            value={vendor.address || "No address provided"}
          />

          <InfoCard
            icon={<Phone className="text-purple-600" size={20} />}
            bgColor="bg-purple-100"
            title="Phone"
            value={vendor.phone || "No phone number"}
          />

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Package className="text-emerald-600" size={20} />
              </div>
              <h4 className="font-semibold text-gray-900">Products</h4>
            </div>

            <p className="text-3xl font-bold text-gray-900 mb-2">
              {products.length}
            </p>

            <Link
              to={`/admin/vendors/${vendorId}/products`}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View all products
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* DOCUMENTS */}
        <DocumentsSection vendor={vendor} />

        {/* ACTIVITY */}
        <ActivitySection
          activity={activity}
          getActivityIcon={getActivityIcon}
        />
      </div>
    </div>
  );
};

// -----------------------------------------------------------
// SUB COMPONENTS
// -----------------------------------------------------------
function InfoCard({ icon, bgColor, title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}
        >
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
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <FileText className="text-indigo-600" size={20} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Documents</h3>
        </div>
        {vendor.documents && vendor.documents.length > 0 && (
          <span className="text-sm text-gray-600">
            {vendor.documents.length} file(s)
          </span>
        )}
      </div>

      {!vendor.documents?.length ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-600">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendor.documents.map((d, i) => (
            <a
              href={d.url}
              target="_blank"
              rel="noreferrer"
              key={i}
              className="group flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <Archive
                  className="text-gray-600 group-hover:text-blue-600 transition-colors"
                  size={20}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {d.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">{d.type}</div>
              </div>
              <Download
                className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0"
                size={16}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ActivitySection({ activity, getActivityIcon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <Activity className="text-orange-600" size={20} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Activity Log</h3>
      </div>

      {!activity.length ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Activity className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-600">No activity recorded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activity.map((event, i) => {
            const ActivityIcon = getActivityIcon(event.type);
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ActivityIcon className="text-blue-600" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 capitalize">
                      {event.type.replace(/_/g, " ")}
                    </h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(event.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{event.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VendorDetails;
