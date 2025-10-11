const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 🟢 Create Order (Checkout)
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address } = req.body;

    // find cart + items
    const cart = await prisma.carts.findFirst({
      where: { user_id: userId },
      include: { cart_items: { include: { product: true } } },
    });

    if (!cart || cart.cart_items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // calculate totals
    let total = 0;
    const orderItemsData = cart.cart_items.map((item) => {
      const subtotal = item.product.price * item.qty;
      total += subtotal;
      return {
        product_id: item.product_id,
        qty: item.qty,
        price: item.product.price,
        subtotal,
      };
    });

    // create order
    const order = await prisma.orders.create({
      data: {
        user_id: userId,
        total,
        status: "pending",
        address_text: address,
        order_items: {
          create: orderItemsData,
        },
      },
      include: { order_items: true },
    });

    // decrease stock
    for (const item of cart.cart_items) {
      await prisma.products.update({
        where: { id: item.product_id },
        data: { stock: { decrement: item.qty } },
      });
    }

    // clear cart
    await prisma.cart_items.deleteMany({
      where: { cart_id: cart.id },
    });

    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
};

// 🟢 Get all orders for a user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.orders.findMany({
      where: { user_id: userId },
      include: { order_items: { include: { product: true } } },
      orderBy: { created_at: "desc" },
    });

    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
};

// 🟢 Get user orders by status
const getUserOrdersByStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.params;

    // only allow valid statuses
    const validStatuses = ["pending", "shipped", "received"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const orders = await prisma.orders.findMany({
      where: { user_id: userId, status },
      include: { order_items: { include: { product: true } } },
      orderBy: { created_at: "desc" },
    });

    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching orders by status", error: err.message });
  }
};


// 🟢 Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.orders.findFirst({
      where: { id: parseInt(id), user_id: userId },
      include: { order_items: { include: { product: true } } },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};

// 🟢 Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await prisma.orders.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(updatedOrder);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating order", error: err.message });
  }
};

// 🟢 Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        order_items: {
          include: { product: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching all orders", error: err.message });
  }
};


module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getUserOrdersByStatus,
};
