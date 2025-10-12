const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret";
const SESSION_EXPIRY_DAYS = 7;
const COOKIE_NAME = "user_session";

// REGISTER USER (default is_admin = false)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }

    // Change from prisma.user to prisma.users
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Change from prisma.user to prisma.users
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        is_admin: false, // always false for normal users
      },
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// LOGIN USER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Change from prisma.user to prisma.users
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }

    const tokenPayload = { userId: user.id, email: user.email };
    if (user.is_admin) {
      tokenPayload.isAdmin = true;
    }

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: `${SESSION_EXPIRY_DAYS}d`,
    });

    // Note: userSession table doesn't exist in your schema
    // Remove or create the userSession model if you need this
    // await prisma.userSession
    //   ?.create({
    //     data: {
    //       userId: user.id,
    //       token,
    //       expiresAt: new Date(Date.now() + SESSION_EXPIRY_DAYS * 86400000),
    //     },
    //   })
    //   .catch(() => {});

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 86400000,
      path: "/",
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// LOGOUT USER
const logout = async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];

    // Note: userSession table doesn't exist in your schema
    // Remove or create the userSession model if you need this
    // if (token) {
    //   await prisma.userSession
    //     ?.deleteMany({ where: { token } })
    //     .catch(() => {});
    // }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// GET SESSION (me)
const me = async (req, res) => {
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
    } catch (e) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid or expired token" });
    }

    // Change from prisma.user to prisma.users
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
};
