const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} = require("../controllers/product.controller");
const verifyAdmin = require("../middleware/verify.admin");

// CRUD Routes
router.post("/", verifyAdmin, upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", verifyAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

// Route to upload multiple images to a specific product
router.post(
  "/:id/images",
  verifyAdmin,
  upload.array("images", 10),
  uploadProductImages
);

module.exports = router;
