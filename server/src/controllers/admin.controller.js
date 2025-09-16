const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret";
const COOKIE_NAME = "admin_session";
const SESSION_EXPIRY_DAYS = 7;

// ADMIN LOGIN
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Email and password required" });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user || !user.is_admin) {
      return res.status(403).json({ status: "error", message: "Admins only" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: true },
      JWT_SECRET,
      { expiresIn: `${SESSION_EXPIRY_DAYS}d` }
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 86400000, // 7 days
      path: "/",
    });

    res.status(200).json({
      status: "success",
      message: "Admin login successful",
      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// ADMIN LOGOUT
const adminLogout = async (req, res) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({
      status: "success",
      message: "Admin logged out successfully",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

module.exports = {
  adminLogin,
  adminLogout,
};
