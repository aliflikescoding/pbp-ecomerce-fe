import React, { useState, useEffect } from "react";
import axios from "axios";

// Create axios instance for admin API calls
const adminAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all"); // "all", "admin", "user"
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    is_admin: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.get("/admin/users");
      if (response.data.status === "success") {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminAPI.delete(`/admin/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
        alert("User deleted successfully");
      } catch (error) {
        alert(
          "Error deleting user: " +
            (error.response?.data?.message || "Unknown error")
        );
      }
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      await adminAPI.put(`/admin/users/${userId}`, {
        is_admin: !currentStatus,
      });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, is_admin: !currentStatus } : user
        )
      );
      alert("User status updated successfully");
    } catch (error) {
      alert(
        "Error updating user: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const handleCreateUser = () => {
    setEditUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      is_admin: false,
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      is_admin: user.is_admin,
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        // Update existing user
        const updateData = {
          name: formData.name,
          email: formData.email,
          is_admin: formData.is_admin,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }

        await adminAPI.put(`/admin/users/${editUser.id}`, updateData);
        setUsers(
          users.map((user) =>
            user.id === editUser.id ? { ...user, ...updateData } : user
          )
        );
        alert("User updated successfully");
      } else {
        // Create new user
        const response = await adminAPI.post("/admin/users", formData);
        if (response.data.status === "success") {
          setUsers([...users, response.data.data]);
          alert("User created successfully");
        }
      }

      setShowModal(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        is_admin: false,
      });
    } catch (error) {
      alert(
        "Error saving user: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter users based on role and search term
  const filteredUsers = users.filter((user) => {
    // Role filter
    const roleMatch =
      roleFilter === "all" ||
      (roleFilter === "admin" && user.is_admin) ||
      (roleFilter === "user" && !user.is_admin);

    // Search filter
    const searchMatch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    return roleMatch && searchMatch;
  });

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all users in the system</p>
        </div>
        <button onClick={handleCreateUser} className="btn btn-primary">
          Add User
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="card bg-base-100 shadow-xl p-6 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="input input-bordered w-full pl-10 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 mr-3">
            Filter by Role:
          </span>
          <button
            onClick={() => setRoleFilter("all")}
            className={`btn btn-sm ${
              roleFilter === "all" ? "btn-primary" : "btn-outline"
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter("admin")}
            className={`btn btn-sm ${
              roleFilter === "admin" ? "btn-secondary" : "btn-outline"
            }`}
          >
            👑 Admins ({users.filter((user) => user.is_admin).length})
          </button>
          <button
            onClick={() => setRoleFilter("user")}
            className={`btn btn-sm ${
              roleFilter === "user" ? "btn-accent" : "btn-outline"
            }`}
          >
            👤 Users ({users.filter((user) => !user.is_admin).length})
          </button>
        </div>

        {/* Active Filter Indicators */}
        {(roleFilter !== "all" || searchTerm) && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {roleFilter !== "all" && (
                <span className="text-sm text-gray-600">
                  Showing:{" "}
                  {roleFilter === "admin"
                    ? "👑 Admin users only"
                    : "👤 Regular users only"}
                </span>
              )}
              {searchTerm && (
                <span className="text-sm text-gray-600">
                  🔍 Search: "{searchTerm}"
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {roleFilter !== "all" && (
                <button
                  onClick={() => setRoleFilter("all")}
                  className="btn btn-xs btn-outline"
                >
                  Clear role filter
                </button>
              )}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="btn btn-xs btn-outline"
                >
                  Clear search
                </button>
              )}
              {(roleFilter !== "all" || searchTerm) && (
                <button
                  onClick={() => {
                    setRoleFilter("all");
                    setSearchTerm("");
                  }}
                  className="btn btn-xs btn-outline btn-error"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 shadow-xl overflow-hidden">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Statistics</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-sm opacity-50">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${
                      user.is_admin ? "badge-secondary" : "badge-accent"
                    }`}
                  >
                    {user.is_admin ? "👑 Admin" : "👤 User"}
                  </span>
                </td>
                <td>
                  <div className="text-sm">
                    <div>🛒 {user._count?.carts || 0} carts</div>
                    <div>📦 {user._count?.orders || 0} orders</div>
                  </div>
                </td>
                <td>{formatDate(user.created_at)}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="btn btn-xs btn-outline btn-info"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                      className={`btn btn-xs ${
                        user.is_admin
                          ? "btn-outline btn-warning"
                          : "btn-primary text-white"
                      }`}
                    >
                      {user.is_admin ? "Remove Admin" : "Make Admin"}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="btn btn-xs btn-outline btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && users.length > 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm && roleFilter !== "all"
                ? `No ${roleFilter} users match "${searchTerm}"`
                : searchTerm
                ? `No users match "${searchTerm}"`
                : `No ${roleFilter} users found`}
            </p>
            <div className="flex justify-center space-x-3">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="btn btn-outline btn-primary"
                >
                  Clear search
                </button>
              )}
              {roleFilter !== "all" && (
                <button
                  onClick={() => setRoleFilter("all")}
                  className="btn btn-outline"
                >
                  Show all users
                </button>
              )}
            </div>
          </div>
        )}

        {users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-blue-600">
            <span className="text-2xl">👥</span>
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-gray-800 font-bold">
            {users.length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-purple-600">
            <span className="text-2xl">👑</span>
          </div>
          <div className="stat-title">Admins</div>
          <div className="stat-value text-gray-800 font-bold">
            {users.filter((user) => user.is_admin).length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-green-600">
            <span className="text-2xl">🛒</span>
          </div>
          <div className="stat-title">Active Shoppers</div>
          <div className="stat-value text-gray-800 font-bold">
            {users.filter((user) => user._count?.orders > 0).length}
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit User */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-6">
              {editUser ? "Edit User" : "Add New User"}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">User Name *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter user name"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Email Address *
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Password {editUser && "(leave blank to keep current)"}
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder={
                    editUser ? "Leave blank to keep current" : "Enter password"
                  }
                  required={!editUser}
                />
              </div>

              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text font-medium">
                    Admin privileges
                  </span>
                  <input
                    type="checkbox"
                    name="is_admin"
                    checked={formData.is_admin}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>

              <div className="modal-action mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editUser ? "Update" : "Create"} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
