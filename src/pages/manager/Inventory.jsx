import { useEffect, useState } from "react";
import { Package, TrendingUp, AlertTriangle } from "lucide-react";

const Inventory = () => {
    const [activeTab, setActiveTab] = useState("stocks");
    const [products, setProducts] = useState([]);

    // --- Simulated data (replace this with backend fetch later) ---
    useEffect(() => {
        const dummyData = [
            {
                id: 1,
                name: "Laptop",
                originalStock: 120,
                totalSales: 95,
                unitPrice: 450000,
            },
            {
                id: 2,
                name: "Keyboard",
                originalStock: 300,
                totalSales: 260,
                unitPrice: 15000,
            },
            {
                id: 3,
                name: "Mouse",
                originalStock: 400,
                totalSales: 392,
                unitPrice: 7000,
            },
            {
                id: 4,
                name: "Monitor",
                originalStock: 60,
                totalSales: 22,
                unitPrice: 125000,
            },
        ];

        setProducts(dummyData);
    }, []);

    const lowStockThreshold = 10;

    const calculateCurrentStock = (p) => p.originalStock - p.totalSales;
    const calculateRevenue = (p) => p.totalSales * p.unitPrice;

    const stocks = products.map((p) => ({
        ...p,
        currentStock: calculateCurrentStock(p),
        isLowStock: calculateCurrentStock(p) <= lowStockThreshold,
    }));

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-600" />
                Inventory Management
            </h1>

            {/* Tabs */}
            <div className="flex gap-4 border-b mb-6">
                {["stocks", "sales"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 px-4 font-medium capitalize border-b-2 transition-all ${activeTab === tab
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-600 hover:text-blue-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* --- Stocks Tab --- */}
            {activeTab === "stocks" && (
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Original Stock
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Current Stock
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stocks.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-6 py-3 text-gray-800 font-medium">
                                        {p.name}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700">{p.originalStock}</td>
                                    <td
                                        className={`px-6 py-3 font-semibold ${p.isLowStock ? "text-red-600" : "text-green-700"
                                            }`}
                                    >
                                        {p.currentStock}
                                    </td>
                                    <td className="px-6 py-3">
                                        {p.isLowStock ? (
                                            <span className="flex items-center gap-1 text-red-600 font-medium">
                                                <AlertTriangle className="w-4 h-4" />
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                                <TrendingUp className="w-4 h-4" />
                                                In Stock
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- Sales Tab --- */}
            {activeTab === "sales" && (
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Units Sold
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Revenue (₦)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stocks.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-6 py-3 text-gray-800 font-medium">
                                        {p.name}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700">{p.totalSales}</td>
                                    <td className="px-6 py-3 text-gray-800 font-semibold">
                                        ₦{calculateRevenue(p).toLocaleString()}
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

export default Inventory;
