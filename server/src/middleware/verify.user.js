const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret";
const COOKIE_NAME = "user_session";

const verifyUser = async (req, res, next) => {
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

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("verifyUser error:", err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

module.exports = verifyUser;
