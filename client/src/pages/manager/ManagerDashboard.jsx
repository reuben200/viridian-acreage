import { Users, ClipboardList, CheckCircle2, BarChart3 } from "lucide-react";

const ManagerDashboard = () => {
    const stats = [
        { title: "Team Members", value: "14", icon: Users },
        { title: "Pending Approvals", value: "5", icon: ClipboardList },
        { title: "Completed Projects", value: "27", icon: CheckCircle2 },
        { title: "Performance Index", value: "89%", icon: BarChart3 },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Manager Dashboard</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(({ title, value, icon: Icon }) => (
                    <div
                        key={title}
                        className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition-shadow border border-gray-100 flex items-center gap-4"
                    >
                        <div className="p-3 bg-green-50 rounded-xl">
                            <Icon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">{title}</h3>
                            <p className="text-xl font-semibold text-gray-800">{value}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 bg-white p-6 rounded-2xl shadow border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Team Progress</h3>
                <p className="text-gray-500">📈 Performance and team analytics will appear here soon.</p>
            </div>
        </div>
    );
};

export default ManagerDashboard;
