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

// USER MANAGEMENT FUNCTIONS

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        is_admin: true,
        created_at: true,
        _count: {
          select: {
            carts: true,
            orders: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        is_admin: true,
        created_at: true,
        carts: {
          include: {
            cart_items: {
              include: {
                product: {
                  select: {
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
        orders: {
          include: {
            order_items: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, is_admin } = req.body;

    const user = await prisma.users.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(typeof is_admin === "boolean" && { is_admin }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        is_admin: true,
        created_at: true,
      },
    });

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, is_admin = false } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        is_admin,
      },
      select: {
        id: true,
        name: true,
        email: true,
        is_admin: true,
        created_at: true,
      },
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Don't allow deleting the current admin
    if (req.admin.id === id) {
      return res
        .status(400)
        .json({ status: "error", message: "Cannot delete your own account" });
    }

    await prisma.users.delete({
      where: { id },
    });

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// DASHBOARD ANALYTICS
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      recentOrders,
    ] = await Promise.all([
      prisma.users.count(),
      prisma.products.count(),
      prisma.orders.count(),
      prisma.categories.count(),
      prisma.orders.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          order_items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalCategories,
        },
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// PRODUCT MANAGEMENT FUNCTIONS

// Get all products for admin (including inactive)
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        images: true,
        _count: {
          select: {
            cart_items: true,
            order_items: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Create product (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, is_active, category_id } =
      req.body;

    if (!name || !price || !stock || !category_id) {
      return res.status(400).json({
        status: "error",
        message: "Name, price, stock, and category_id are required",
      });
    }

    const product = await prisma.products.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        stock: parseInt(stock),
        is_active: is_active === "true" || is_active === true,
        category_id: parseInt(category_id),
      },
      include: {
        category: true,
        images: true,
      },
    });

    // Handle image upload if provided
    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      await prisma.product_images.create({
        data: {
          product_id: product.id,
          url: imageUrl,
        },
      });
    }

    // Fetch updated product with images
    const updatedProduct = await prisma.products.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: true,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, is_active, category_id } =
      req.body;

    const product = await prisma.products.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description: description || null }),
        ...(price && { price: parseFloat(price) }),
        ...(stock && { stock: parseInt(stock) }),
        ...(typeof is_active === "boolean" && { is_active }),
        ...(category_id && { category_id: parseInt(category_id) }),
      },
      include: {
        category: true,
        images: true,
      },
    });

    // Handle image upload if provided
    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;

      // Delete existing images for this product
      await prisma.product_images.deleteMany({
        where: { product_id: parseInt(id) },
      });

      // Create new image
      await prisma.product_images.create({
        data: {
          product_id: parseInt(id),
          url: imageUrl,
        },
      });
    }

    // Fetch updated product with images
    const updatedProduct = await prisma.products.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        images: true,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.products.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// CATEGORY MANAGEMENT FUNCTIONS

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    console.error("Get all categories error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Category name is required",
      });
    }

    const category = await prisma.categories.create({
      data: { name },
    });

    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await prisma.categories.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const productsCount = await prisma.products.count({
      where: { category_id: parseInt(id) },
    });

    if (productsCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "Cannot delete category with existing products",
      });
    }

    await prisma.categories.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// ORDER MANAGEMENT FUNCTIONS

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order_items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: "error",
        message: "Status is required",
      });
    }

    const order = await prisma.orders.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        order_items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllOrders,
  updateOrderStatus,
};
