const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ✅ Create Category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const category = await prisma.categories.create({
      data: { name },
    });

    res.status(201).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create category", error: error.message });
  }
};

// ✅ Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
      include: { products: true },
    });
    res.json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: error.message });
  }
};

// ✅ Get Category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.categories.findUnique({
      where: { id: parseInt(id) },
      include: { products: true },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch category", error: error.message });
  }
};

// ✅ Update Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await prisma.categories.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update category", error: error.message });
  }
};

// ✅ Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.categories.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete category", error: error.message });
  }
};

// Export individually
module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
