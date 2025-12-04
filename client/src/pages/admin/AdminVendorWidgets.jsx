import { useEffect, useState } from "react";
import { fetchCollection } from "../../services/firestoreHelpers";

const AdminVendorWidgets = () => {
  const [counts, setCounts] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    suspended: 0,
  });

  useEffect(() => {
    let mounted = true;
    const loadCounts = async () => {
      try {
        // it's cheaper to use aggregated counters (Cloud Function / increment) in production.
        const all = await fetchCollection({ path: "vendors", pageSize: 1000 }); // small apps ok
        if (!mounted) return;
        const data = all.data || [];
        const approved = data.filter((v) => v.status === "approved").length;
        const pending = data.filter(
          (v) => v.status === "pending_approval"
        ).length;
        const suspended = data.filter((v) => v.status === "suspended").length;
        setCounts({
          total: data.length,
          approved,
          pending,
          suspended,
        });
      } catch (err) {
        console.error("Failed to load vendor counts:", err);
      }
    };

    loadCounts();
    return () => (mounted = false);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Total Vendors</div>
        <div className="text-2xl font-bold">{counts.total}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Approved</div>
        <div className="text-2xl font-bold text-green-600">
          {counts.approved}
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Pending</div>
        <div className="text-2xl font-bold text-yellow-600">
          {counts.pending}
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Suspended</div>
        <div className="text-2xl font-bold text-red-600">
          {counts.suspended}
        </div>
      </div>
    </div>
  );
};

export default AdminVendorWidgets;
