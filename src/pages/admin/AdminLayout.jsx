import { useState, useContext, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    Package,
    BarChart3,
    ShoppingCart,
    Truck,
    LogOut,
    Menu,
    X,
    Users,
    Settings,
    Bell,
    ChevronDown,
    UserCircle,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [checkingRole, setCheckingRole] = useState(true); // For safe role check
    const dropdownRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { authState, logout } = useContext(AuthContext);

    const user = authState?.user || {};
    const userRole = user?.role || "guest";

    // --- Redirect non-admin users ---
    useEffect(() => {
        if (!authState?.isAuthenticated) {
            navigate("/login");
            return;
        }

        if (authState?.user && userRole !== "admin") {
            navigate("/unauthorized");
            return;
        }

        setCheckingRole(false);
    }, [authState, userRole, navigate]);

    // --- Simulated notifications ---
    useEffect(() => {
        setNotifications([
            { id: 1, message: "New quotation received", time: "2h ago" },
            { id: 2, message: "Stock updated successfully", time: "5h ago" },
        ]);
    }, []);

    // --- Handle outside click for dropdown ---
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout?.();
        localStorage.clear();
        navigate("/login");
    };

    // --- Show loading or unauthorized while checking ---
    if (checkingRole) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-gray-500 text-lg font-medium">Checking access...</p>
            </div>
        );
    }

    if (userRole !== "admin") {
        return (
            <div className="flex h-screen flex-col items-center justify-center">
                <h2 className="text-2xl font-semibold text-red-600 mb-3">Access Denied</h2>
                <p className="text-gray-600 mb-4">
                    You don’t have permission to view this page.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Go Home
                </button>
            </div>
        );
    }

    // --- Admin-only navigation ---
    const adminLinks = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
        { name: "Quotations", icon: FileText, path: "/admin/quotations" },
        { name: "Products", icon: Package, path: "/admin/products" },
        { name: "Reports", icon: BarChart3, path: "/admin/reports" },
        { name: "Restocks", icon: Truck, path: "/admin/restocks" },
        { name: "Sales", icon: ShoppingCart, path: "/admin/sales" },
        { name: "Users", icon: Users, path: "/admin/users" },
        { name: "Settings", icon: Settings, path: "/admin/settings" },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-200 ease-in-out md:translate-x-0`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-blue-700">Admin Panel</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-2 rounded hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {adminLinks.map(({ name, icon: Icon, path }) => (
                        <Link
                            key={name}
                            to={path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${location.pathname === path
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {name}
                        </Link>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 mt-4 font-medium w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-64">
                {/* Top Bar */}
                <header className="flex items-center justify-between bg-white shadow-sm px-4 py-3 border-b">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 rounded hover:bg-gray-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                    {notifications.length}
                                </span>
                            )}
                        </div>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full"
                            >
                                <UserCircle className="w-6 h-6 text-gray-700" />
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-10">
                                    <p className="px-4 py-2 text-sm text-gray-600">
                                        {user?.username || user?.email}
                                    </p>
                                    <hr />
                                    <Link
                                        to="/admin/profile"
                                        className="block px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        to="/admin/settings"
                                        className="block px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
