import { ShoppingBag, Heart, Clock, Wallet } from "lucide-react";

const CustomerDashboard = () => {
    const stats = [
        { title: "My Orders", value: "6", icon: ShoppingBag },
        { title: "Wishlist", value: "12", icon: Heart },
        { title: "Pending Deliveries", value: "2", icon: Clock },
        { title: "Wallet Balance", value: "$180", icon: Wallet },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Welcome Back 👋</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(({ title, value, icon: Icon }) => (
                    <div
                        key={title}
                        className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition-shadow border border-gray-100 flex items-center gap-4"
                    >
                        <div className="p-3 bg-yellow-50 rounded-xl">
                            <Icon className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">{title}</h3>
                            <p className="text-xl font-semibold text-gray-800">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 bg-white p-6 rounded-2xl shadow border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                <p className="text-gray-500">🛍️ Your recent activity will show here soon.</p>
            </div>
        </div>
    );
};

export default CustomerDashboard;
