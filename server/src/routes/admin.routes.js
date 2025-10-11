const express = require("express");
const {
  adminLogin,
  adminLogout,
} = require("../controllers/admin.controller");
const verifyAdmin = require("../middleware/verify.admin");

const router = express.Router();

// Public admin routes
router.post("/login", adminLogin);
router.post("/logout", adminLogout);

// Example protected route (admins only)
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

module.exports = router;
