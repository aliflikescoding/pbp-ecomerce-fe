const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret";
const COOKIE_NAME = "admin_session";

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "Not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid or expired token" });
    }

    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.is_admin) {
      return res.status(403).json({ status: "error", message: "Admins only" });
    }

    req.admin = user; // attach admin to request
    next();
  } catch (err) {
    console.error("verifyAdmin error:", err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

module.exports = verifyAdmin;
