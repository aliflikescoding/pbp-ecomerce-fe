import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/login");
    }
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/users", label: "Users", icon: "👥" },
    { path: "/admin/products", label: "Products", icon: "📦" },
    { path: "/admin/categories", label: "Categories", icon: "📂" },
    { path: "/admin/orders", label: "Orders", icon: "🛒" },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar - Fixed Header */}
      <nav className="bg-white shadow-lg border-b fixed top-0 left-0 right-0 z-50">
        <div className="w-full pl-4 pr-4">
          <div className="flex justify-between h-16">
            {/* Left side - Admin Panel Header */}
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
                onClick={() => setSidebarOpen(!sidebarOpen)}
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

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-semibold">{user?.name}</span>
              </div>
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 mr-2"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area with Top Margin for Fixed Header */}
      <div className="flex flex-1 mt-16">
        {/* Sidebar - Fixed */}
        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block md:w-64 bg-white shadow-lg fixed left-0 top-16 bottom-0 z-40`}
        >
          <nav className="h-full overflow-y-auto mt-5 px-2 pb-6">
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

        {/* Main Content - Scrollable */}
        <div className="flex-1 md:ml-64 overflow-y-auto h-full">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
