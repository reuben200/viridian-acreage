import { Link, Outlet, useNavigate } from "react-router-dom";
import { Home, Users, LogOut, Package, NotebookPenIcon } from "lucide-react";

const ManagerLayout = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const links = [
        { name: "Dashboard", path: "/manager", icon: Home },
        { name: "Customers", path: "/manager/customers", icon: Users },
        { name: "Orders", path: "/manager/order", icon: Package },
        { name: "Inventory", path: "/manager/inventory", icon: NotebookPenIcon },
    ];

    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-white border-r p-6">
                <h2 className="text-xl font-bold mb-6">Manager Panel</h2>
                <nav className="space-y-3">
                    {links.map(({ name, path, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2"
                        >
                            <Icon className="w-4 h-4" /> {name}
                        </Link>
                    ))}
                </nav>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 mt-6 text-red-600 hover:bg-red-100 w-full rounded-lg px-3 py-2"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </aside>
            <main className="flex-1 p-6 bg-gray-50 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default ManagerLayout;
