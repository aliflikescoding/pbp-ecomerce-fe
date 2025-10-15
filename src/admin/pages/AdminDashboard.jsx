import React, { useState, useEffect } from "react";
import axios from "axios";

// Create axios instance for admin API calls
const adminAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.get("/admin/dashboard");
      if (response.data.status === "success") {
        setStats(response.data.data.stats);
        setRecentOrders(response.data.data.recentOrders);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="stat bg-base-100 shadow">
      <div className="stat-figure text-primary">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="stat-title">{title}</div>
      <div className="stat-value text-primary">{value}</div>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "badge-warning",
      processing: "badge-info",
      shipped: "badge-secondary",
      delivered: "badge-success",
      cancelled: "badge-error",
    };

    return (
      <span className={`badge ${statusColors[status] || "badge-neutral"}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
            color="border-blue-500"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="📦"
            color="border-green-500"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="🛒"
            color="border-purple-500"
          />
          <StatCard
            title="Categories"
            value={stats.totalCategories}
            icon="📂"
            color="border-orange-500"
          />
        </div>
      )}

      {/* Recent Orders */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-bold">#{order.id}</td>
                      <td>
                        <div>
                          <div className="font-bold">{order.user.name}</div>
                          <div className="text-sm opacity-50">
                            {order.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="font-bold">${order.total}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>
                        {order.order_items.length > 0 && (
                          <div className="max-w-xs">
                            {order.order_items
                              .slice(0, 2)
                              .map((item, index) => (
                                <div key={index} className="text-xs">
                                  {item.qty}x {item.product.name}
                                </div>
                              ))}
                            {order.order_items.length > 2 && (
                              <div className="text-xs opacity-50">
                                +{order.order_items.length - 2} more items
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Quick Actions</h3>
            <div className="space-y-3">
              <button className="btn btn-primary btn-sm w-full justify-start">
                ➕ Add New Product
              </button>
              <button className="btn btn-accent btn-sm w-full justify-start">
                📂 Add New Category
              </button>
              <button className="btn btn-secondary btn-sm w-full justify-start">
                👥 View All Users
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">API Status</span>
                <span className="badge badge-success">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <span className="badge badge-success">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Last Backup</span>
                <span className="text-sm opacity-70">Today</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div>🛒 New order received</div>
              <div>📦 Product updated</div>
              <div>👤 New user registered</div>
              <div>📂 Category added</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
