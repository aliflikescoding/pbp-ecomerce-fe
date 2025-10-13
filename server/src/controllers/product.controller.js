const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
  try {
    const { name, price, stock, is_active, category_id } = req.body;

    const product = await prisma.products.create({
      data: {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        is_active: is_active === "true" || is_active === true,
        category_id: parseInt(category_id),
      },
    });

    // If image uploaded, save it
    if (req.file) {
      await prisma.product_images.create({
        data: {
          url: `/uploads/${req.file.filename}`,
          product_id: product.id,
        },
      });
    }

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "newest"; // newest, oldest, price_asc, price_desc
    const category = req.query.category ? parseInt(req.query.category) : null;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause = {};

    // Search filter - searches in product name
    if (search) {
      whereClause.name = {
        contains: search,
        mode: "insensitive", // Case insensitive search
      };
    }

    // Category filter
    if (category) {
      whereClause.category_id = category;
    }

    // Build orderBy clause for sorting
    let orderBy = {};
    switch (sortBy) {
      case "newest":
        orderBy = { created_at: "desc" };
        break;
      case "oldest":
        orderBy = { created_at: "asc" };
        break;
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      default:
        orderBy = { created_at: "desc" };
    }

    // Get total count for pagination info
    const totalProducts = await prisma.products.count({
      where: whereClause,
    });

    // Get products with filters, sorting and pagination
    const products = await prisma.products.findMany({
      where: whereClause,
      orderBy: orderBy,
      skip: skip,
      take: limit,
      include: {
        images: true,
        category: true,
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Return products with pagination metadata
    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage,
        hasPreviousPage,
        limit,
      },
      filters: {
        search,
        sortBy,
        category,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await prisma.products.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { images: true, category: true },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, stock, is_active, category_id } = req.body;

    const product = await prisma.products.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        is_active: is_active === "true" || is_active === true,
        category_id: parseInt(category_id),
      },
    });

    // Add new image if uploaded
    if (req.file) {
      await prisma.product_images.create({
        data: {
          url: `/uploads/${req.file.filename}`,
          product_id: product.id,
        },
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await prisma.product_images.deleteMany({
      where: { product_id: parseInt(req.params.id) },
    });

    await prisma.products.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New function to upload multiple images to a specific product
const uploadProductImages = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    // Check if product exists
    const product = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    // Create image records for all uploaded files
    const imagePromises = req.files.map((file) =>
      prisma.product_images.create({
        data: {
          url: `/uploads/${file.filename}`,
          product_id: productId,
        },
      })
    );

    const createdImages = await Promise.all(imagePromises);

    res.status(201).json({
      message: `${createdImages.length} images uploaded successfully`,
      images: createdImages,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages, // Export the new function
};
