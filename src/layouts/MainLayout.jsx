import { Menu, X, Tag, Bell, TrendingUp, Gift } from "lucide-react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const Logo = "/images/V.webp";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/contact", label: "Contact" },
    { to: "/quotation", label: "Request Quote" },
    { to: "/join", label: "Join" },
  ];

  const promotionalContent = [
    {
      id: 1,
      title: "Summer Sale!",
      desc: "Get 20% off all organic produce",
      icon: Tag,
      color: "emerald",
      badge: "20% OFF",
    },
    {
      id: 2,
      title: "New Arrivals",
      desc: "Fresh strawberries just in",
      icon: TrendingUp,
      color: "blue",
      badge: "NEW",
    },
    {
      id: 3,
      title: "Farm Fresh Eggs",
      desc: "Direct from our henhouse",
      icon: Gift,
      color: "amber",
      badge: "FRESH",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: {
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
        badge: "bg-emerald-600 text-white",
        button: "bg-emerald-600 hover:bg-emerald-700 text-white",
      },
      blue: {
        bg: "bg-blue-50 dark:bg-blue-950/30",
        icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
        badge: "bg-blue-600 text-white",
        button: "bg-blue-600 hover:bg-blue-700 text-white",
      },
      amber: {
        bg: "bg-amber-50 dark:bg-amber-950/30",
        icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
        badge: "bg-amber-600 text-white",
        button: "bg-amber-600 hover:bg-amber-700 text-white",
      },
    };
    return colors[color];
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src={Logo}
                alt="Viridian Acreage"
                className="w-10 h-10 rounded-lg border-2 border-green-600 dark:border-green-500"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white hidden sm:block">
                Viridian Acreage
              </h1>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400 transition-all font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-1 border-t border-gray-200 dark:border-gray-700 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400 rounded-lg transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="mx-auto mb-20">
            <Outlet />
          </div>
        </main>

        {/* Right Sidebar - Desktop Only, Separately Scrollable */}
        <aside className="hidden xl:block w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto scrollbar-hide">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-600 dark:text-green-500" />
                Special Offers
              </h2>
              <span className="text-xs font-semibold text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">
                3 ACTIVE
              </span>
            </div>

            {promotionalContent.map((promo) => {
              const colors = getColorClasses(promo.color);
              const IconComponent = promo.icon;

              return (
                <div
                  key={promo.id}
                  className={`${colors.bg} rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`${colors.icon} w-12 h-12 rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span
                      className={`${colors.badge} text-xs font-bold px-2.5 py-1 rounded-full`}
                    >
                      {promo.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 text-base">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {promo.desc}
                  </p>
                  <button
                    className={`w-full ${colors.button} py-2.5 rounded-lg transition-colors text-sm font-semibold`}
                  >
                    Learn More
                  </button>
                </div>
              );
            })}

            {/* Newsletter Subscription */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-5 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-600 dark:text-green-500" />
                Subscribe & Save 15%
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get regular deliveries of your favorites
              </p>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition-colors text-sm font-semibold shadow-sm">
                Subscribe Now
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* CSS for hiding scrollbars */}
      <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
    </div>
  );
};

export default MainLayout;
