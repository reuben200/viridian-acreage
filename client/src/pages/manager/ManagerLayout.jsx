import { useState, useRef, useEffect } from "react";
import {
  Home,
  Users,
  LogOut,
  Package,
  Notebook,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  ChevronDown,
  UserCircle,
  Search,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link, Outlet, useNavigate } from "react-router-dom";

const ManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeRoute, setActiveRoute] = useState("/manager");
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Get user details from th e auth context
  const { currentUser } = useAuth();
  const user = {
    username: currentUser?.name || "Manager",
    email: currentUser?.email || "",
  };

  useEffect(() => {
    setNotifications([
      { id: 1, message: "New order #ORD-1234 received", time: "10m ago" },
      { id: 2, message: "Low stock alert: Product A", time: "1h ago" },
      { id: 3, message: "Customer inquiry pending", time: "3h ago" },
    ]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token")
    console.log("Logging out...");
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  const links = [
    { name: "Dashboard", path: "/manager", icon: Home },
    { name: "Customers", path: "/manager/customers", icon: Users },
    { name: "Orders", path: "/manager/order", icon: Package },
    { name: "Products", icon: Package, path: "/manager/products" },
    { name: "Reports", icon: BarChart3, path: "/manager/reports" },
    { name: "Partners", icon: Users, path: "/manager/partnership" },
    { name: "Inventory", path: "/manager/inventory", icon: Notebook },
    { name: "Settings", path: "/manager/settings", icon: Settings },
  ];

  const handleNavClick = (path) => {
    setActiveRoute(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-xl transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-purple-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Manager Panel</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-purple-800 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map(({ name, icon: Icon, path }) => (
            <Link
              key={name}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                location.pathname === path
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-purple-700 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {name}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-950 hover:text-red-300 font-medium w-full transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Bar */}
        <header className="bg-gray shadow-sm px-6 py-4 border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex flex-row gap-2 items-center">
                <p className="font-semibold italic text-gray-900">
                  Welcome back,
                </p>
                <p className="text-lg text-gray-500 mt-0.5">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar - Hidden on mobile */}
              <div className="hidden lg:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm text-gray-700 w-48"
                />
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-20">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors"
                        >
                          <p className="text-sm text-gray-800 font-medium">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notif.time}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="text-sm text-purple-600 hover:text-purple-700 font-medium w-full text-center">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                >
                  <UserCircle className="w-7 h-7 text-gray-700" />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-20">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => handleNavClick("/manager/profile")}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 transition-colors font-medium"
                      >
                        <UserCircle className="w-4 h-4 inline mr-2" />
                        Profile
                      </button>
                      <button
                        onClick={() => handleNavClick("/manager/settings")}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 transition-colors font-medium"
                      >
                        <Settings className="w-4 h-4 inline mr-2" />
                        Settings
                      </button>
                    </div>
                    <div className="border-t border-gray-200 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 dark:bg-gray-900 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
