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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all users in the system</p>
        </div>
        <button
          onClick={handleCreateUser}
          className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg font-medium transition duration-200"
        >
          Add User
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
              roleFilter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter("admin")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
              roleFilter === "admin"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            👑 Admins ({users.filter((user) => user.is_admin).length})
          </button>
          <button
            onClick={() => setRoleFilter("user")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
              roleFilter === "user"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                >
                  Clear role filter
                </button>
              )}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 underline"
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
                  className="text-sm text-red-600 hover:text-red-800 underline font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statistics
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_admin
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.is_admin ? "Admin" : "User"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div>🛒 {user._count?.carts || 0} carts</div>
                    <div>📦 {user._count?.orders || 0} orders</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded text-xs font-semibold transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      user.is_admin
                        ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    } transition duration-200`}
                  >
                    {user.is_admin ? "Remove Admin" : "Make Admin"}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-xs font-semibold transition duration-200"
                  >
                    Delete
                  </button>
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
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition duration-200"
                >
                  Clear search
                </button>
              )}
              {roleFilter !== "all" && (
                <button
                  onClick={() => setRoleFilter("all")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
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
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">👑</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((user) => user.is_admin).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🛒</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Shoppers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((user) => user._count?.orders > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editUser ? "Edit User" : "Add New User"}
              </h3>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {editUser && "(leave blank to keep current)"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editUser}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_admin"
                      checked={formData.is_admin}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Admin privileges
                    </span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent transition duration-200"
                  >
                    {editUser ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
