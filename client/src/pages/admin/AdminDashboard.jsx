import { BarChart2, Users, Package, DollarSign, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
    const stats = [
        { title: "Total Users", value: "1,245", icon: Users },
        { title: "Total Products", value: "328", icon: Package },
        { title: "Total Sales", value: "$58,900", icon: DollarSign },
        { title: "Growth Rate", value: "12.5%", icon: TrendingUp },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Admin Overview</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(({ title, value, icon: Icon }) => (
                    <div
                        key={title}
                        className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition-shadow border border-gray-100 flex items-center gap-4"
                    >
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">{title}</h3>
                            <p className="text-xl font-semibold text-gray-800">{value}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 bg-white p-6 rounded-2xl shadow border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                <p className="text-gray-500">📊 Graphs and analytics section coming soon.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
