const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getUserOrdersByStatus,
} = require("../controllers/order.controller");
const verifyUser = require("../middleware/verify.user");
const verifyAdmin = require("../middleware/verify.admin"); // create this if not already

// User routes
router.post("/", verifyUser, createOrder);
router.get("/", verifyUser, getUserOrders);
router.get("/all", verifyAdmin, getAllOrders);
router.get("/:status", verifyUser, getUserOrdersByStatus);
router.get("/:id", verifyUser, getOrderById);

// Admin route
router.put("/:id/status", verifyAdmin, updateOrderStatus);

module.exports = router;
