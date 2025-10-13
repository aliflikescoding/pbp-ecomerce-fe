import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Create axios instance for admin API calls
import axios from "axios";
const adminAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.get("/category");
      // Backend returns array directly, not wrapped in status/data
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditCategory(null);
    setFormData({
      name: "",
      description: "",
    });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        // Update existing category
        const response = await adminAPI.put(
          `/category/${editCategory.id}`,
          formData
        );
        setCategories(
          categories.map((cat) =>
            cat.id === editCategory.id ? { ...cat, ...formData } : cat
          )
        );
        alert("Category updated successfully");
      } else {
        // Create new category
        const response = await adminAPI.post("/category", formData);
        // Backend returns category object directly
        setCategories([...categories, response.data]);
        alert("Category created successfully");
      }

      setShowModal(false);
      setFormData({
        name: "",
        description: "",
      });
    } catch (error) {
      alert(
        "Error saving category: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await adminAPI.delete(`/category/${categoryId}`);
        setCategories(categories.filter((cat) => cat.id !== categoryId));
        alert("Category deleted successfully");
      } catch (error) {
        alert(
          "Error deleting category: " +
            (error.response?.data?.message || "Unknown error")
        );
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Category Management
          </h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <button
          onClick={handleCreateCategory}
          className="btn btn-primary flex items-center gap-2"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start mb-4">
                <h3 className="card-title text-lg">{category.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="btn btn-ghost btn-sm text-blue-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="btn btn-ghost btn-sm text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {category.description && (
                <p className="text-base-content/70 text-sm mb-4">
                  {category.description}
                </p>
              )}

              <div className="flex justify-between items-center text-sm opacity-70">
                <span>{category._count?.products || 0} products</span>
                <span>
                  Created: {new Date(category.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No categories found</p>
          <p className="text-gray-400 text-sm mt-2">
            Create your first category to get started
          </p>
        </div>
      )}

      {/* Modal for Create/Edit Category */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-6">
              {editCategory ? "Edit Category" : "Add New Category"}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Category Name *
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered w-full"
                  placeholder="Enter category name"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter category description..."
                />
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
                  {editCategory ? "Update" : "Create"} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
