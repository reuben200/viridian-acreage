import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, updateDoc, doc, Timestamp } from "firebase/firestore";
import { db, auth } from "../../services/firebaseConfig";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

const QuotationsList = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "quotations"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setQuotations(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateStatus = async (quoteId, status) => {
        const admin = auth.currentUser;
        if (!admin) return alert("You must be logged in as admin");

        await updateDoc(doc(db, "quotations", quoteId), {
            status,
            reviewedBy: admin.uid,
            reviewedAt: Timestamp.now(),
        });
    };

    if (loading)
        return <div className="text-center text-gray-500 dark:text-gray-300">Loading quotations...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Quotations</h2>

            {quotations.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No quotations yet.</p>
            ) : (
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-left">
                            <tr>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Products
                                </th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotations.map((q) => (
                                <tr key={q.id} className="border-t dark:border-gray-700">
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                                        {q.customerName || q.customerId}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {q.products &&
                                            q.products.map((p, i) => (
                                                <div key={i}>
                                                    {p.productName} ({p.quantity} {p.unit})
                                                </div>
                                            ))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${q.status === "Approved"
                                                ? "bg-green-100 text-green-700"
                                                : q.status === "Declined"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {q.status || "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {q.createdAt?.toDate
                                            ? q.createdAt.toDate().toLocaleString()
                                            : "—"}
                                    </td>
                                    <td className="px-6 py-4 space-x-2 flex items-center">
                                        {q.status === "Pending" ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(q.id, "Approved")}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1"
                                                >
                                                    <CheckCircle2 size={16} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(q.id, "Declined")}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1"
                                                >
                                                    <XCircle size={16} /> Decline
                                                </button>
                                            </>
                                        ) : (
                                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <Clock size={14} />
                                                {q.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default QuotationsList;
