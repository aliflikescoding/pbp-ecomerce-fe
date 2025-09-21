const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    let cart = await prisma.carts.findFirst({
      where: { user_id: userId },
      include: {
        cart_items: {
          include: { product: { include: { images: true } } },
        },
      },
    });

    if (!cart) {
      cart = await prisma.carts.create({
        data: { user_id: userId },
        include: { cart_items: true },
      });
    }

    res.json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: err.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    let cart = await prisma.carts.findFirst({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await prisma.carts.create({ data: { user_id: userId } });
    }

    const existingItem = await prisma.cart_items.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (existingItem) {
      const updatedItem = await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { qty: existingItem.qty + qty },
      });
      return res.json(updatedItem);
    }

    const newItem = await prisma.cart_items.create({
      data: {
        qty,
        cart_id: cart.id,
        product_id: productId,
      },
    });

    res.json(newItem);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding to cart", error: err.message });
  }
};

// Update item quantity
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params; // must match ":id" from route
    const { qty } = req.body;

    const updatedItem = await prisma.cart_items.update({
      where: { id: parseInt(id) },
      data: { qty },
    });

    res.json(updatedItem);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating cart item", error: err.message });
  }
};


// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.cart_items.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing cart item", error: err.message });
  }
};

// Export individually
module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
