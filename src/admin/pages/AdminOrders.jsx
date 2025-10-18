import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaEye,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaBan,
  FaSpinner,
  FaEdit,
} from "react-icons/fa";

// Create axios instance for admin API calls
const adminAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [orderToUpdate, setOrderToUpdate] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.get("/admin/orders");
      if (response.data.status === "success") {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmStatusUpdate = (orderId, newStatus) => {
    setOrderToUpdate(orderId);
    setStatusToUpdate(newStatus);
    setShowConfirmModal(true);
  };

  const updateOrderStatus = async () => {
    try {
      await adminAPI.put(`/admin/orders/${orderToUpdate}/status`, {
        status: statusToUpdate,
      });
      setShowConfirmModal(false);
      setOrderToUpdate(null);
      setStatusToUpdate(null);
      fetchOrders(); // Refresh the list

      // Success toast notification
      toast.success("Order status updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error updating order status:", error);

      // Error toast notification
      toast.error(
        error.response?.data?.message || "Error updating order status",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaSpinner className="text-yellow-500" />;
      case "processing":
        return <FaBox className="text-blue-500" />;
      case "shipped":
        return <FaTruck className="text-purple-500" />;
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaBan className="text-red-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "badge-warning";
      case "processing":
        return "badge-info";
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      return `http://localhost:5000${product.images[0].url}`;
    }
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop";
  };

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
          Manage customer orders and update status
        </p>
      </div>

      {/* Stats */}
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
          <div className="stat-figure text-info">
            <FaBox className="text-2xl" />
          </div>
          <div className="stat-title">Processing</div>
          <div className="stat-value text-info">
            {orders.filter((o) => o.status === "processing").length}
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="font-bold">#{order.id}</div>
                  </td>
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
                    <div className="flex items-center space-x-2">
                      {order.order_items?.slice(0, 3).map((item, index) => (
                        <div key={index} className="avatar">
                          <div className="w-8 h-8 rounded">
                            <img
                              src={getImageUrl(item.product)}
                              alt={item.product?.name}
                            />
                          </div>
                        </div>
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
                      className={`badge ${getStatusColor(order.status)} gap-2`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <div className="flex flex-col space-y-2">
                      {/* View Button */}
                      <button
                        onClick={() =>
                          setSelectedOrder(
                            selectedOrder?.id === order.id ? null : order
                          )
                        }
                        className="btn btn-sm btn-outline btn-info gap-2"
                      >
                        <FaEye />
                        View Details
                      </button>

                      {/* Change Status Dropdown - Available for All Orders */}
                      <div className="dropdown dropdown-end w-full">
                        <div
                          tabIndex={0}
                          role="button"
                          className={`btn btn-sm w-full gap-2 ${
                            order.status === "pending"
                              ? "btn-warning"
                              : order.status === "processing"
                              ? "btn-info"
                              : order.status === "shipped"
                              ? "btn-secondary"
                              : order.status === "completed"
                              ? "btn-success"
                              : order.status === "cancelled"
                              ? "btn-error"
                              : "btn-primary"
                          }`}
                        >
                          <FaEdit />
                          Change Status
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow"
                        >
                          <li>
                            <button
                              onClick={() =>
                                confirmStatusUpdate(order.id, "processing")
                              }
                              className={`flex items-center space-x-2 ${
                                order.status === "processing"
                                  ? "bg-info text-white"
                                  : ""
                              }`}
                            >
                              <FaBox />
                              <span>Processing</span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() =>
                                confirmStatusUpdate(order.id, "shipped")
                              }
                              className={`flex items-center space-x-2 ${
                                order.status === "shipped"
                                  ? "bg-secondary text-white"
                                  : ""
                              }`}
                            >
                              <FaTruck />
                              <span>Shipped</span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() =>
                                confirmStatusUpdate(order.id, "completed")
                              }
                              className={`flex items-center space-x-2 ${
                                order.status === "completed"
                                  ? "bg-success text-white"
                                  : ""
                              }`}
                            >
                              <FaCheckCircle />
                              <span>Completed</span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() =>
                                confirmStatusUpdate(order.id, "cancelled")
                              }
                              className={`flex items-center space-x-2 ${
                                order.status === "cancelled"
                                  ? "bg-error text-white"
                                  : ""
                              }`}
                            >
                              <FaBan />
                              <span>Cancelled</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              {getStatusIcon(statusToUpdate)}
              Confirm Status Change
            </h3>
            <div className="py-4">
              <p className="mb-4">
                Are you sure you want to change order #{orderToUpdate} status
                to:
              </p>
              <div
                className={`badge ${getStatusColor(
                  statusToUpdate
                )} badge-lg gap-2 p-4`}
              >
                {getStatusIcon(statusToUpdate)}
                <span className="text-lg font-semibold">
                  {getStatusLabel(statusToUpdate)}
                </span>
              </div>
            </div>
            <div className="modal-action">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setOrderToUpdate(null);
                  setStatusToUpdate(null);
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button onClick={updateOrderStatus} className="btn btn-primary">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

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
                        className="flex items-center space-x-3 p-2 bg-white rounded"
                      >
                        <img
                          src={getImageUrl(item.product)}
                          alt={item.product?.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {item.qty} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-bold text-sm">
                          {formatCurrency(item.price * item.qty)}
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
