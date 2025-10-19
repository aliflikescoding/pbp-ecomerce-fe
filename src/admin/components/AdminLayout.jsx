import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { verifyAdmin, /* add this */ logoutAdmin } from "../../api";

// OPTIONAL: only needed if you also store readable (non-httpOnly) helper cookies like "admin_name"
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // 1) Quick gate by cookie presence (client-visible only if NOT httpOnly)
        //    This is just a fast-path; httpOnly cookies won't be visible here.
        const hasClientVisibleAdminCookie =
          !!getCookie("admin_session") || // only works if NOT httpOnly
          document.cookie.includes("admin_session="); // cautious check

        // 2) Definitive check via API (uses httpOnly cookie server-side)
        const res = await verifyAdmin(); // GET /admin/me withCredentials
        if (!alive) return;

        const ok =
          (res?.status && String(res.status).toLowerCase() === "success") ||
          !!res?.id ||
          !!res?.email ||
          !!res?.is_admin;

        if (!ok) {
          setIsAuthenticated(false);
          setAdmin(null);
          setLoading(false);
          navigate("/admin/login", {
            replace: true,
            state: { from: location },
          });
          return;
        }

        // Try to show a name:
        // - Prefer readable cookie "admin_name" if you set it (non-httpOnly)
        // - Otherwise use the API response fields
        const nameFromCookie = getCookie("admin_name");
        const hydratedAdmin = {
          name:
            nameFromCookie ||
            res?.name ||
            res?.full_name ||
            res?.email ||
            "Admin",
          email: res?.email,
          ...res,
        };

        setIsAuthenticated(true);
        setAdmin(hydratedAdmin);
        setLoading(false);
      } catch (e) {
        if (!alive) return;
        setIsAuthenticated(false);
        setAdmin(null);
        setLoading(false);
        navigate("/admin/login", { replace: true, state: { from: location } });
      }
    })();

    return () => {
      alive = false;
    };
    // re-run when path changes (optional)
  }, [location.pathname, navigate, location]);

  const handleLogout = async () => {
    try {
      await logoutAdmin(); // POST /admin/logout (httpOnly cookie cleared server-side)
    } catch (e) {
      // ignore; still redirect
    } finally {
      // clear any client-visible helper cookies you may have set
      // (only affects non-httpOnly cookies)
      document.cookie = "admin_session=; Max-Age=0; path=/";
      document.cookie = "admin_name=; Max-Age=0; path=/";
      navigate("/admin/login", { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/users", label: "Users", icon: "👥" },
    { path: "/admin/products", label: "Products", icon: "📦" },
    { path: "/admin/categories", label: "Categories", icon: "📂" },
    { path: "/admin/orders", label: "Orders", icon: "🛒" },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <nav className="bg-white shadow-lg border-b fixed top-0 left-0 right-0 z-50 h-16">
        <div className="w-full pl-4 pr-4">
          <div className="flex justify-between h-16">
            {/* Left */}
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <img
                  src="/logo-vertical.svg"
                  className="h-10 w-auto mr-3"
                  alt="Aurora & Co"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-800 font-playfair">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Control Center</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden ml-4"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome,{" "}
                <span className="font-semibold">{admin?.name || "Admin"}</span>
              </div>
              <Link
                to="/"
                className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 mr-2"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block md:w-64 bg-white shadow-lg fixed left-0 top-16 bottom-0 z-40 overflow-hidden`}
        >
          <nav className="h-full overflow-y-auto px-2 py-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? "bg-indigo-100 border-r-4 border-indigo-500 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-4 py-3 text-sm font-medium rounded-md transition duration-200`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Main */}
        <div className="flex-1 md:ml-64 overflow-y-auto">
          <div className="p-6 min-h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
