// src/pages/CartPage.jsx
import React from "react";
import { getUserCart, deleteCartItem, updateCartQty } from "../api";

const currency = (n) => Number(n || 0).toFixed(2);

const CartPage = () => {
  const [cart, setCart] = React.useState(null);

  // track which cart_item ids are updating to disable controls
  const [updatingIds, setUpdatingIds] = React.useState(() => new Set());
  // hold per-item debounce timers for input typing
  const debounceRef = React.useRef({});

  const addUpdating = (id) =>
    setUpdatingIds((s) => new Set([...Array.from(s), id]));
  const removeUpdating = (id) =>
    setUpdatingIds((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });

  const fetchCart = React.useCallback(async () => {
    try {
      const res = await getUserCart();
      setCart(res);
    } catch (error) {
      console.error("Get user cart error:", error);
    }
  }, []);

  React.useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleDeleteCartItem = async (id) => {
    try {
      await deleteCartItem(id);
      await fetchCart();
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

  // Optimistically set qty in state
  const setLocalQty = (id, nextQty) => {
    setCart((prev) => {
      if (!prev) return prev;
      const nextItems = prev.cart_items.map((it) =>
        it.id === id ? { ...it, qty: nextQty } : it
      );
      return { ...prev, cart_items: nextItems };
    });
  };

  // Persist qty to API; rollback on failure
  const persistQty = async (id, nextQty, prevQty) => {
    try {
      addUpdating(id);
      await updateCartQty(id, Number(nextQty));
      // Optional: trust optimistic state; if you prefer re-fetch uncomment:
      // await fetchCart();
    } catch (err) {
      console.error("Update Cart Qty error:", err);
      // rollback
      setLocalQty(id, prevQty);
    } finally {
      removeUpdating(id);
    }
  };

  // For +/- buttons: update immediately (no debounce)
  const inc = (id, current, stock) => {
    const next = clampQty(current + 1, stock);
    if (next === current) return;
    const prev = current;
    setLocalQty(id, next);
    void persistQty(id, next, prev);
  };
  const dec = (id, current) => {
    const next = clampQty(current - 1, Infinity);
    if (next === current) return;
    const prev = current;
    setLocalQty(id, next);
    void persistQty(id, next, prev);
  };

  // For input typing: debounce the API call per row (400ms)
  const onInputChange = (item, raw) => {
    const stock = Number(item.product?.stock || 1);
    const prev = item.qty;
    const next = clampQty(raw, stock);

    setLocalQty(item.id, next);

    // clear previous timer for this row
    const timers = debounceRef.current;
    if (timers[item.id]) clearTimeout(timers[item.id]);

    timers[item.id] = setTimeout(() => {
      // read the very latest qty from state to persist
      const latest =
        (cart.cart_items.find((i) => i.id === item.id) || {}).qty ?? next;
      void persistQty(item.id, latest, prev);
    }, 400);
  };

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
                const isUpdating = updatingIds.has(item.id);

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
                              disabled={item.qty <= 1 || isUpdating}
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
                                onInputChange(item, e.target.value)
                              }
                              className="input input-bordered input-sm w-16 text-center"
                              disabled={isUpdating}
                            />

                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => inc(item.id, item.qty, stock)}
                              disabled={maxed || isUpdating}
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
                          {isUpdating && (
                            <span className="text-xs opacity-70 ml-2">
                              Updating…
                            </span>
                          )}
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
                      disabled={updatingIds.has(item.id)}
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
          <label
            className={`btn btn-accent w-full ${
              items.length === 0 ? "btn-disabled" : ""
            }`}
            htmlFor={"checkout_modal"}
          >
            Checkout
          </label>
          <input
            type="checkbox"
            id={"checkout_modal"}
            className="modal-toggle"
          />
          <div className="modal" role="dialog">
            <div className="modal-box text-base-content">
              <div className="flex gap-2 flex-col items-center justify-center">
                <p className="text-lg capitalize font-bold text-center">
                  Check out these products
                </p>
                <p className="text-lg text-center">
                  put in your address to checkout this product
                </p>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend text-lg">Address</legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Address"
                  />
                  <p className="label"></p>
                </fieldset>
                <div className="flex gap-2 items-center justify-center">
                  <label htmlFor={"checkout_modal"} className="btn btn-neutral">
                    Close
                  </label>
                  <button className="btn btn-accent">Checkout</button>
                </div>
              </div>
            </div>
            <label className="modal-backdrop" htmlFor={"checkout_modal"}>
              Close
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
