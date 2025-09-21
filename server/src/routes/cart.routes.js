const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cart.controller");
const verifyUser = require("../middleware/verify.user");

// CRUD Routes
router.get("/", verifyUser, getCart);
router.post("/", verifyUser, addToCart);
router.put("/:id", verifyUser, updateCartItem);
router.delete("/:id", verifyUser, removeFromCart);

module.exports = router;

