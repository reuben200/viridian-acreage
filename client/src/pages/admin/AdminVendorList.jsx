// src/pages/admin/AdminVendorList.jsx
import { useEffect, useState } from "react";
import { fetchCollection } from "../../services/firestoreHelpers";
import { Link } from "react-router-dom";
import {
  Search,
  Grid2x2,
  List,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  Plus,
} from "lucide-react";

const AdminVendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lastDoc, setLastDoc] = useState(null);

  // Load Vendors
  const loadVendors = async (reset = false) => {
    setLoading(true);

    const response = await fetchCollection({
      path: "vendors",
      sort: { field: "createdAt", direction: "desc" },
      pageSize: 10,
      cursor: reset ? null : lastDoc,
      search:
        searchTerm.trim() !== ""
          ? { field: "businessName", value: searchTerm.toLowerCase() }
          : null,
      filters:
        statusFilter === "all"
          ? []
          : [{ field: "status", operator: "==", value: statusFilter }],
    });

    if (reset) setVendors(response.data);
    else setVendors((prev) => [...prev, ...response.data]);

    setLastDoc(response.lastDoc);
    setLoading(false);
  };

  useEffect(() => {
    loadVendors(true);
  }, [searchTerm, statusFilter]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          label: "Approved",
        };
      case "pending_approval":
        return {
          icon: Clock,
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          label: "Pending",
        };
      case "suspended":
        return {
          icon: XCircle,
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          label: "Suspended",
        };
      default:
        return {
          icon: Clock,
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          label: status,
        };
    }
  };

  const statusCounts = {
    all: vendors.length,
    approved: vendors.filter((v) => v.status === "approved").length,
    pending_approval: vendors.filter((v) => v.status === "pending_approval")
      .length,
    suspended: vendors.filter((v) => v.status === "suspended").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Vendors
              </h1>
              <p className="text-gray-600">
                Manage and review vendor applications
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <Plus size={18} />
                <span className="hidden sm:inline">Add Vendor</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total",
                count: statusCounts.all,
                color: "blue",
                icon: Grid2x2,
              },
              {
                label: "Approved",
                count: statusCounts.approved,
                color: "emerald",
                icon: CheckCircle,
              },
              {
                label: "Pending",
                count: statusCounts.pending_approval,
                color: "amber",
                icon: Clock,
              },
              {
                label: "Suspended",
                count: statusCounts.suspended,
                color: "red",
                icon: XCircle,
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </span>
                    <Icon
                      size={18}
                      className={`text-${stat.color}-600 opacity-60`}
                    />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.count}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter & View Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 min-w-[250px] max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
                <select
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  value={statusFilter}
                >
                  <option value="all">All Status</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-md transition-all ${
                  view === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Grid view"
              >
                <Grid2x2 size={18} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md transition-all ${
                  view === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!loading && vendors.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No vendors found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* GRID VIEW */}
        {view === "grid" && vendors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vendors.map((v) => {
              const statusConfig = getStatusConfig(v.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Link
                  key={v.id}
                  to={`/admin/vendors/${v.id}`}
                  className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {v.businessName}
                      </h3>
                      <p className="text-sm text-gray-600">{v.businessType}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </span>
                    <span className="text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* LIST VIEW */}
        {view === "list" && vendors.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Business Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vendors.map((v) => {
                    const statusConfig = getStatusConfig(v.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr
                        key={v.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {v.businessName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {v.businessType}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                          >
                            <StatusIcon size={14} />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/admin/vendors/${v.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            View Details
                            <span>→</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LOAD MORE BUTTON */}
        {lastDoc && !loading && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => loadVendors(false)}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
            >
              Load More Vendors
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading vendors...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVendorList;