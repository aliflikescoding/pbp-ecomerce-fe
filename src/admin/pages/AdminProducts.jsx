import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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
      const response = await adminAPI.get("/product/all");
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

      // Only append first image for main product create/update (backend uses single upload)
      if (imageFiles.length > 0) {
        submitData.append("image", imageFiles[0]);
      }

      let productId;
      if (editProduct) {
        // Update product
        const response = await adminAPI.put(
          `/product/${editProduct.id}`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        productId = editProduct.id;
      } else {
        // Create product
        const response = await adminAPI.post("/product", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        productId = response.data.id;
      }

      // If there are additional images (more than 1), upload them separately
      if (imageFiles.length > 1) {
        const additionalImages = new FormData();
        for (let i = 1; i < imageFiles.length; i++) {
          additionalImages.append("images", imageFiles[i]);
        }

        await adminAPI.post(`/product/${productId}/images`, additionalImages, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      fetchProducts();
      resetForm();
      setShowModal(false);

      toast.success(
        editProduct
          ? "Product updated successfully!"
          : "Product created successfully!",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Error saving product", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
    setImageFiles([]);
    // Set existing images preview
    if (product.images && product.images.length > 0) {
      const existingPreviews = product.images.map(
        (img) => `http://localhost:5000${img.url}`
      );
      setImagePreviews(existingPreviews);
    } else {
      setImagePreviews([]);
    }
    setShowModal(true);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await adminAPI.delete(`/product/${productToDelete.id}`);
      fetchProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);

      toast.success("Product deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Error deleting product", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const toggleProductStatus = async (id, currentStatus) => {
    try {
      await adminAPI.put(`/product/${id}`, {
        is_active: !currentStatus,
      });
      fetchProducts();

      toast.success(
        `Product ${!currentStatus ? "activated" : "deactivated"} successfully!`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error(
        error.response?.data?.message || "Error updating product status",
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
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Check if adding new files would exceed limit
    const totalImages = imageFiles.length + files.length;
    if (totalImages > 3) {
      toast.warning(
        `You can only upload ${
          3 - imageFiles.length
        } more image(s). Maximum 3 images allowed.`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      e.target.value = ""; // Reset input
      return;
    }

    // Append new files to existing ones
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    // Create previews for new files only
    const newPreviews = [...imagePreviews];
    let loadedCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        loadedCount++;

        // Update state only when all new files are loaded
        if (loadedCount === files.length) {
          setImagePreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input to allow selecting same file again if needed
    e.target.value = "";
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      return `http://localhost:5000${product.images[0].url}`;
    }
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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

        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  className="w-5 h-5"
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
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              {/* Category Filter */}
              <div className="form-control">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="select select-bordered w-40"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="form-control">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select select-bordered w-32"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Stock Filter */}
              <div className="form-control">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="select select-bordered w-32"
                >
                  <option value="all">All Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {products.length}
                  </span>{" "}
                  products
                </span>
                {/* Clear All Button */}
                {(searchTerm ||
                  categoryFilter !== "all" ||
                  statusFilter !== "all" ||
                  stockFilter !== "all") && (
                  <button
                    onClick={clearAllFilters}
                    className="btn btn-xs btn-ghost gap-1 text-error hover:text-error"
                    title="Clear all filters"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear filters
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <span className="text-gray-600">
                  Active:{" "}
                  <span className="font-semibold text-success">
                    {filteredProducts.filter((p) => p.is_active).length}
                  </span>
                </span>
                <span className="text-gray-600">
                  Low Stock:{" "}
                  <span className="font-semibold text-warning">
                    {filteredProducts.filter((p) => p.stock <= 10).length}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Table Section */}
      <div className="flex-1 overflow-hidden">
        <div className="card bg-base-100 shadow-xl h-full overflow-y-auto">
          <table className="table table-zebra w-full">
            <thead className="sticky top-0 z-10 bg-base-200">
              <tr>
                <th className="w-24">Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="p-2">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(product)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="font-bold">{product.name}</div>
                      <div className="text-sm opacity-50">ID: {product.id}</div>
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(product)}
                        className="btn btn-sm btn-outline btn-info"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="btn btn-sm btn-outline btn-primary"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="btn btn-sm btn-outline btn-error"
                        title="Delete"
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

              {/* Image Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Product Images ({imagePreviews.length}/3)
                  </span>
                </label>

                {/* Image Preview Grid with Add Button */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 btn btn-circle btn-xs btn-error"
                        title="Remove image"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}

                  {/* Add Image Button - Show only if less than 3 images */}
                  {imagePreviews.length < 3 && (
                    <label className="relative cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all">
                        <svg
                          className="w-8 h-8 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="text-xs text-gray-500 font-medium">
                          Add Image
                        </span>
                      </div>
                    </label>
                  )}
                </div>

                <div className="label">
                  <span className="label-text-alt text-gray-500">
                    {imagePreviews.length === 0
                      ? "Click + to add images (max 3)"
                      : `${
                          3 - imagePreviews.length
                        } more image(s) can be added`}
                  </span>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Price (USD) *</span>
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
                  placeholder="0.00"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error mb-4">
              🗑️ Delete Product
            </h3>
            <p className="py-4">
              Are you sure you want to delete{" "}
              <strong className="text-primary">"{productToDelete.name}"</strong>
              ? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-error">
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedProduct && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl">Product Details</h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedProduct(null);
                }}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Images */}
              <div>
                <h4 className="font-semibold mb-3">Product Images</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedProduct.images &&
                  selectedProduct.images.length > 0 ? (
                    selectedProduct.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={`http://localhost:5000${image.url}`}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg border"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex items-center justify-center h-40 bg-gray-100 rounded-lg">
                      <span className="text-gray-400">No images</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Product Name
                  </label>
                  <p className="text-lg font-bold">{selectedProduct.name}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Product ID
                  </label>
                  <p className="text-gray-800">#{selectedProduct.id}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Category
                  </label>
                  <p>
                    <span className="badge badge-outline badge-lg">
                      {selectedProduct.category?.name || "No Category"}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Price
                    </label>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(selectedProduct.price)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Stock
                    </label>
                    <p>
                      <span
                        className={`badge badge-lg ${
                          selectedProduct.stock <= 10
                            ? "badge-warning"
                            : "badge-success"
                        }`}
                      >
                        {selectedProduct.stock} units
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Status
                  </label>
                  <p>
                    <span
                      className={`badge badge-lg ${
                        selectedProduct.is_active
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {selectedProduct.is_active ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Created At
                  </label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedProduct.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-action mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedProduct(null);
                }}
                className="btn btn-outline"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEdit(selectedProduct);
                }}
                className="btn btn-primary"
              >
                <FaEdit className="mr-2" />
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
