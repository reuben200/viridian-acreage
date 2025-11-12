// src/pages/admin/PartnershipsDashboard.jsx
import { useState } from "react";
import usePartnerships from "../../hooks/usePartnerships";
import { Loader2, Search } from "lucide-react";

export default function PartnershipsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const { partnerships, fetchPartnerships, loading, hasMore } = usePartnerships(searchTerm);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Partnerships
        </h1>

        <div className="relative w-full md:w-1/3 mt-4 md:mt-0">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by business name..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
              <th className="p-4">Business Name</th>
              <th className="p-4">Contact Person</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600" />
                </td>
              </tr>
            ) : partnerships.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No partnerships found.
                </td>
              </tr>
            ) : (
              partnerships.map((partner) => (
                <tr
                  key={partner.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-4 font-medium">{partner.businessName}</td>
                  <td className="p-4">{partner.contactPerson}</td>
                  <td className="p-4">{partner.email}</td>
                  <td className="p-4">{partner.phone}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(partner.createdAt?.seconds * 1000).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => fetchPartnerships("next")}
          disabled={!hasMore || loading}
          className={`px-5 py-2 rounded-lg font-medium text-white ${
            hasMore
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Loading..." : hasMore ? "Load More" : "No More Results"}
        </button>
      </div>
    </div>
  );
}
