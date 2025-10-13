const express = require("express");
const {
  adminLogin,
  adminLogout,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/admin.controller");
const verifyAdmin = require("../middleware/verify.admin");

const router = express.Router();

// Public admin routes
router.post("/login", adminLogin);
router.post("/logout", adminLogout);

// Protected admin routes
router.get("/me", verifyAdmin, (req, res) => {
  res.json({
    status: "success",
    message: "Admin authenticated",
    admin: {
      id: req.admin.id,
      name: req.admin.name,
      email: req.admin.email,
    },
  });
});

// User management
router.get("/users", verifyAdmin, getAllUsers);
router.get("/users/:id", verifyAdmin, getUserById);
router.post("/users", verifyAdmin, createUser);
router.put("/users/:id", verifyAdmin, updateUser);
router.delete("/users/:id", verifyAdmin, deleteUser);

// Dashboard
router.get("/dashboard", verifyAdmin, getDashboardStats);

// Orders management
router.get("/orders", verifyAdmin, getAllOrders);
router.put("/orders/:id/status", verifyAdmin, updateOrderStatus);

module.exports = router;
