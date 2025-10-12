import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

// Create axios instance for admin API calls
const adminAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    is_active: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e) => {
      // Ctrl+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="Search"]'
        );
        if (searchInput) {
          searchInput.focus();
        }
      }
      // Escape to clear search
      if (e.key === "Escape" && searchTerm) {
        setSearchTerm("");
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.get("/product");
      // Backend returns products with pagination info
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminAPI.get("/category");
      // Backend returns categories array directly
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("stock", formData.stock);
      submitData.append("category_id", formData.category_id);
      submitData.append("is_active", formData.is_active);

      if (imageFile) {
        submitData.append("image", imageFile);
      }

      if (editProduct) {
        // Update product
        await adminAPI.put(`/product/${editProduct.id}`, submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Create product
        await adminAPI.post("/product", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      fetchProducts();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.response?.data?.message || "Error saving product");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      is_active: product.is_active,
    });
    setImageFile(null);
    // Set existing image preview
    if (product.images && product.images.length > 0) {
      setImagePreview(`http://localhost:5000${product.images[0].url}`);
    } else {
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await adminAPI.delete(`/product/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }
  };

  const toggleProductStatus = async (id, currentStatus) => {
    try {
      await adminAPI.put(`/product/${id}`, {
        is_active: !currentStatus,
      });
      fetchProducts();
    } catch (error) {
      console.error("Error updating product status:", error);
      alert("Error updating product status");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      is_active: true,
    });
    setEditProduct(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      return `http://localhost:5000${product.images[0].url}`;
    }
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.id.toString().includes(searchTerm);

    // Category filter
    const matchesCategory =
      categoryFilter === "all" ||
      product.category_id.toString() === categoryFilter;

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.is_active) ||
      (statusFilter === "inactive" && !product.is_active);

    // Stock filter
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && product.stock <= 10) ||
      (stockFilter === "normal" && product.stock > 10);

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setStockFilter("all");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 8rem)" }}>
      {/* Fixed Header Section */}
      <div className="flex-shrink-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn btn-primary"
          >
            <FaPlus className="mr-2" />
            Add Product
          </button>
        </div>
        <div className="mb-1">
          <p className="text-gray-600 text-sm">
            Manage all products in the system
          </p>
        </div>

        {/* Search and Filter Section with Stats in One Row */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-lg shadow-sm p-3 mb-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left Side - Search */}
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered input-xs w-48 pl-7 text-xs"
                />
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-3 h-3"
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
              </div>
            </div>

            {/* Middle - Filters with Active Filter Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="select select-bordered select-xs w-32 text-xs"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select select-bordered select-xs w-24 text-xs"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="select select-bordered select-xs w-24 text-xs"
              >
                <option value="all">All Stock</option>
                <option value="low">Low Stock</option>
                <option value="normal">Normal</option>
              </select>

              {/* Active Filter Badges */}
              {categoryFilter !== "all" && (
                <span className="badge badge-success badge-sm">
                  📂{" "}
                  {
                    categories.find((c) => c.id.toString() === categoryFilter)
                      ?.name
                  }
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="badge badge-secondary badge-sm">
                  🏷️ {statusFilter === "active" ? "Active" : "Inactive"}
                </span>
              )}
              {stockFilter !== "all" && (
                <span className="badge badge-warning badge-sm">
                  📦 {stockFilter === "low" ? "Low Stock" : "Normal Stock"}
                </span>
              )}
            </div>

            {/* Right Side - Stats and Clear Button */}
            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    📦 {filteredProducts.length}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-success">
                    ✅ {filteredProducts.filter((p) => p.is_active).length}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Active
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-warning">
                    ⚠️ {filteredProducts.filter((p) => p.stock <= 10).length}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Low</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-info">
                    🏷️ {categories.length}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Cat</div>
                </div>
              </div>

              {/* Clear All Button - Show only when filters are active */}
              {(searchTerm ||
                categoryFilter !== "all" ||
                statusFilter !== "all" ||
                stockFilter !== "all") && (
                <button
                  onClick={clearAllFilters}
                  className="btn btn-xs btn-outline btn-error"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Table Section */}
      <div className="flex-1 overflow-hidden">
        <div className="card bg-base-100 shadow-xl h-full overflow-y-auto">
          <table className="table table-zebra w-full">
            <thead className="sticky top-0 z-10">
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="avatar">
                      <div className="w-12 h-12 rounded">
                        <img src={getImageUrl(product)} alt={product.name} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="font-bold">{product.name}</div>
                      <div className="text-sm opacity-50">ID: {product.id}</div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm max-w-xs">
                      {product.description ? (
                        product.description.length > 50 ? (
                          `${product.description.substring(0, 50)}...`
                        ) : (
                          product.description
                        )
                      ) : (
                        <span className="text-gray-400 italic">
                          No description
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline">
                      {product.category?.name || "No Category"}
                    </span>
                  </td>
                  <td className="font-semibold">
                    {formatCurrency(product.price)}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        product.stock <= 10 ? "badge-warning" : "badge-success"
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        toggleProductStatus(product.id, product.is_active)
                      }
                      className={`btn btn-sm w-24 ${
                        product.is_active ? "btn-success" : "btn-error"
                      }`}
                    >
                      {product.is_active ? (
                        <>
                          <FaToggleOn className="mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <FaToggleOff className="mr-1" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Enhanced No Products Found Message */}
          {filteredProducts.length === 0 && products.length > 0 && (
            <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <svg
                  className="w-10 h-10 text-blue-600"
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
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No products found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any products matching your search criteria. Try
                adjusting your filters or search terms.
              </p>
              <div className="space-y-3">
                <button
                  onClick={clearAllFilters}
                  className="btn btn-primary btn-lg hover:shadow-lg transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Clear All Filters
                </button>
                <div className="text-sm text-gray-500">
                  or try a different search term
                </div>
              </div>
            </div>
          )}

          {/* Enhanced No Products at All Message */}
          {products.length === 0 && (
            <div className="text-center py-20 bg-gradient-to-b from-gray-50 to-white">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to Product Management
              </h3>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
                Start building your inventory by adding your first product. You
                can add images, descriptions, and organize them into categories.
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="btn btn-primary btn-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <FaPlus className="mr-2" />
                Add Your First Product
              </button>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <span className="mr-2">📸</span>
                  Upload product images
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">📝</span>
                  Add detailed descriptions
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">🏷️</span>
                  Organize by categories
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Product */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-6">
              {editProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Product Name *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                  rows="3"
                  placeholder="Enter product description..."
                />
              </div>

              {/* Image Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Product Image</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered w-full"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Price *</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Stock *</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  min="0"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Category *</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text font-medium">Active Status</span>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>

              <div className="modal-action mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editProduct ? "Update" : "Create"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
