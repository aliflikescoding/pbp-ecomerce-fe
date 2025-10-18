// src/admin/pages/AdminOrders.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaEye,
  FaTruck,
  FaCheckCircle,
  FaBan,
  FaSpinner,
} from "react-icons/fa";
import { getAllOrders } from "../../api"; // adjust if needed

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaSpinner className="text-yellow-500" />;
      case "shipped":
        return <FaTruck className="text-purple-500" />;
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaBan className="text-red-500" />;
      default:
        return <FaTruck className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "badge-warning";
      case "shipped":
        return "badge-secondary";
      case "completed":
        return "badge-success";
      case "cancelled":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const formatCurrency = (amount) => {
    const n = Number(amount) || 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">
          View customer orders (layout only — no admin actions)
        </p>
      </div>

      {/* Stats (Processing removed) */}
      <div className="stats stats-vertical lg:stats-horizontal shadow mb-8">
        <div className="stat">
          <div className="stat-figure text-primary">
            <span className="text-2xl">📋</span>
          </div>
          <div className="stat-title">Total Orders</div>
          <div className="stat-value text-primary">{orders.length}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <FaSpinner className="text-2xl" />
          </div>
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">
            {orders.filter((o) => o.status === "pending").length}
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <FaTruck className="text-2xl" />
          </div>
          <div className="stat-title">Shipped</div>
          <div className="stat-value text-secondary">
            {orders.filter((o) => o.status === "shipped").length}
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <FaCheckCircle className="text-2xl" />
          </div>
          <div className="stat-title">Completed</div>
          <div className="stat-value text-success">
            {orders.filter((o) => o.status === "completed").length}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card bg-base-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-gray-50">
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th className="w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const firstThree =
                  order.order_items
                    ?.slice(0, 3)
                    .map((it) => it.product?.name) || [];
                return (
                  <tr key={order.id}>
                    <td className="font-bold">#{order.id}</td>
                    <td>
                      <div>
                        <div className="font-semibold">
                          {order.user?.name || "N/A"}
                        </div>
                        <div className="text-sm opacity-50">
                          {order.user?.email || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2 items-center">
                        {firstThree.map((name, idx) => (
                          <span
                            key={idx}
                            className="badge badge-outline whitespace-nowrap"
                            title={name}
                          >
                            {name || "Product"}
                          </span>
                        ))}
                        {order.order_items?.length > 3 && (
                          <span className="text-sm text-gray-500">
                            +{order.order_items.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.order_items?.length || 0} items
                      </div>
                    </td>
                    <td className="font-bold">{formatCurrency(order.total)}</td>
                    <td>
                      <div
                        className={`badge ${getStatusColor(
                          order.status
                        )} gap-2`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>
                      <button
                        onClick={() =>
                          setSelectedOrder(
                            selectedOrder?.id === order.id ? null : order
                          )
                        }
                        className="btn btn-sm btn-outline btn-info gap-2 w-full"
                      >
                        <FaEye />
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl">
                Order Details - #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-sm btn-circle"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedOrder.user?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedOrder.user?.email || "N/A"}
                    </p>
                    <p>
                      <strong>Order Date:</strong>{" "}
                      {formatDate(selectedOrder.created_at)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Delivery Address</h4>
                  <p className="text-sm">{selectedOrder.address_text}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Order Status</h4>
                  <div
                    className={`badge ${getStatusColor(
                      selectedOrder.status
                    )} gap-2`}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    <span className="capitalize">{selectedOrder.status}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">
                    Order Items ({selectedOrder.order_items?.length || 0})
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedOrder.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 p-2 bg-white rounded"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {item.qty} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-bold text-sm">
                          {formatCurrency(Number(item.price) * item.qty)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
