// src/pages/CartPage.jsx
import React from "react";
import { getUserCart, deleteCartItem } from "../api";

const currency = (n) => Number(n || 0).toFixed(2);

const CartPage = () => {
  const [cart, setCart] = React.useState(null);

  React.useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getUserCart();
        setCart(res);
      } catch (error) {
        console.error("Get user cart error:", error);
      }
    };
    fetchCart();
  }, []);

  const handleDeleteCartItem = async (id) => {
    try {
      await deleteCartItem(id);
      const fetchCart = async () => {
        try {
          const res = await getUserCart();
          setCart(res);
        } catch (error) {
          console.error("Get user cart error:", error);
        }
      };
      fetchCart();
    } catch (error) {
      console.error("Delete cart item error:", error);
    }
  };

  if (!cart) return <div>Loading...</div>;

  const items = cart.cart_items || [];

  const clampQty = (qty, stock) => {
    const n = Math.max(1, Math.floor(Number(qty) || 1));
    return Math.min(n, Math.max(1, Number(stock) || 1));
  };

  const updateQty = (id, nextQty) => {
    setCart((prev) => {
      if (!prev) return prev;
      const nextItems = prev.cart_items.map((it) => {
        if (it.id !== id) return it;
        const stock = Number(it.product?.stock || 1);
        return { ...it, qty: clampQty(nextQty, stock) };
      });
      return { ...prev, cart_items: nextItems };
    });
  };

  const inc = (id, current, stock) =>
    updateQty(id, Math.min(stock, current + 1));
  const dec = (id, current) => updateQty(id, Math.max(1, current - 1));

  const lineTotal = (item) => item.qty * Number(item.product.price || 0);
  const subtotal = items.reduce((sum, it) => sum + lineTotal(it), 0);

  const base = import.meta.env.VITE_IMAGE_URL || "";

  return (
    <div className="custom-container py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>

      <div className="flex lg:flex-row flex-col gap-8 items-start">
        <div className="flex-1 w-full">
          {items.length > 0 ? (
            <div>
              {items.map((item) => {
                const stock = Number(item.product?.stock || 1);
                const unitPrice = Number(item.product.price || 0);
                const maxed = item.qty >= stock;

                return (
                  <div
                    key={item.id}
                    className="border-b pb-4 border-base-content/30"
                  >
                    <div className="flex items-center gap-4 my-2 w-full ">
                      <img
                        src={`${base}${item.product.images?.[0]?.url || ""}`}
                        alt={item.product.name}
                        className="w-28 h-28 md:w-40 md:h-40 object-cover object-center rounded"
                      />

                      <div className="ml-2 md:ml-4 w-full">
                        <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                          <h2 className="font-bold font-playfair text-xl md:text-2xl">
                            {item.product.name}
                          </h2>
                          <p className="text-xl md:text-2xl font-bold font-playfair">
                            ${currency(lineTotal(item))}
                          </p>
                        </div>

                        {/* Quantity controls */}
                        <div className="mt-3 flex items-center gap-3">
                          <span className="opacity-70">Quantity</span>
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => dec(item.id, item.qty)}
                              disabled={item.qty <= 1}
                              aria-label="Decrease quantity"
                            >
                              –
                            </button>

                            <input
                              type="number"
                              min={1}
                              max={stock}
                              value={item.qty}
                              onChange={(e) =>
                                updateQty(item.id, e.target.value)
                              }
                              className="input input-bordered input-sm w-16 text-center"
                            />

                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => inc(item.id, item.qty, stock)}
                              disabled={maxed}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <span
                            className={`text-xs ${
                              maxed ? "text-error" : "opacity-70"
                            }`}
                          >
                            {stock > 0 ? `In stock: ${stock}` : "Out of stock"}
                          </span>
                        </div>

                        <div className="mt-2 text-sm opacity-70">
                          Unit: ${currency(unitPrice)}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-error btn-sm"
                      onClick={() => handleDeleteCartItem(item.id)}
                    >
                      Remove From Cart
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        {/* Summary */}
        <aside className="w-full max-w-sm sticky top-6 border p-4">
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
          <div className="flex justify-between py-3">
            <span className="font-medium">Subtotal</span>
            <span className="text-xl font-bold">${currency(subtotal)}</span>
          </div>
          <button
            className="btn btn-accent w-full"
            disabled={items.length === 0}
            onClick={() => {
              console.log("Proceed to checkout with all items:", items);
            }}
          >
            Checkout
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
