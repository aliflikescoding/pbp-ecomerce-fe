const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const verifyAdmin = require("../middleware/verify.admin");

// CRUD Routes
router.post("/", verifyAdmin, createCategory);
router.get("/", getCategories);
router.get("/:id", verifyAdmin, getCategoryById);
router.put("/:id", verifyAdmin, updateCategory);
router.delete("/:id", verifyAdmin, deleteCategory);

module.exports = router;
