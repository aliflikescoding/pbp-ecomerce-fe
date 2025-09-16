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
    const products = await prisma.products.findMany({
      include: { images: true, category: true },
    });
    res.json(products);
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

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
