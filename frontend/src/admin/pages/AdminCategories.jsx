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
      const response = await adminAPI.get("/admin/categories");
      if (response.data.status === "success") {
        setCategories(response.data.data || []);
      }
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
        await adminAPI.put(`/admin/categories/${editCategory.id}`, formData);
        setCategories(
          categories.map((cat) =>
            cat.id === editCategory.id ? { ...cat, ...formData } : cat
          )
        );
        alert("Category updated successfully");
      } else {
        // Create new category
        const response = await adminAPI.post("/admin/categories", formData);
        if (response.data.status === "success") {
          setCategories([...categories, response.data.data]);
          alert("Category created successfully");
        }
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
        await adminAPI.delete(`/admin/categories/${categoryId}`);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition duration-200"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-md transition duration-200"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>

            {category.description && (
              <p className="text-gray-600 text-sm mb-4">
                {category.description}
              </p>
            )}

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{category._count?.products || 0} products</span>
              <span>
                Created: {new Date(category.created_at).toLocaleDateString()}
              </span>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter category name"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter category description"
                  />
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
                    {editCategory ? "Update" : "Create"}
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

export default AdminCategories;
