import React from "react";
import { getUserCart } from "../api";

const currency = (n) => Number(n || 0).toFixed(2);

const CartPage = () => {
  const [cart, setCart] = React.useState(null);
  const [selected, setSelected] = React.useState(new Set()); // item.id set

  React.useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getUserCart();
        setCart(res);
        // preselect all items on load
        const all = new Set((res?.cart_items || []).map((i) => i.id));
        setSelected(all);
      } catch (error) {
        console.error("Get user cart error:", error);
      }
    };
    fetchCart();
  }, []);

  if (!cart) return <div>Loading...</div>;

  const items = cart.cart_items || [];

  const isAllSelected = items.length > 0 && selected.size === items.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateQty = (id, nextQty) => {
    setCart((prev) => {
      if (!prev) return prev;
      const nextItems = prev.cart_items.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, Number(nextQty) || 1) } : it
      );
      return { ...prev, cart_items: nextItems };
    });
  };

  const inc = (id, current) => updateQty(id, current + 1);
  const dec = (id, current) => updateQty(id, Math.max(1, current - 1));

  const lineTotal = (item) => item.qty * Number(item.product.price || 0);

  const selectedSubtotal = items
    .filter((it) => selected.has(it.id))
    .reduce((sum, it) => sum + lineTotal(it), 0);

  return (
    <div className="custom-container py-20">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>

      <div className="flex gap-8 items-start">
        <div className="flex-1">
          {items.length > 0 ? (
            <div>
              {/* Header row */}
              <div className="flex items-center gap-4 py-3 border-b border-base-content/30 mb-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
                <span className="font-medium">
                  Select all ({selected.size}/{items.length})
                </span>
              </div>

              {items.map((item) => (
                <div
                  className="flex items-center gap-4 my-2 w-full border-b pb-4 border-base-content/30"
                  key={item.id}
                >
                  <div>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </div>

                  <img
                    src={`${import.meta.env.VITE_IMAGE_URL}${
                      item.product.images?.[0]?.url || ""
                    }`}
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
                          className="btn btn-sm"
                          onClick={() => dec(item.id, item.qty)}
                          disabled={item.qty <= 1}
                          aria-label="Decrease quantity"
                        >
                          –
                        </button>

                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => updateQty(item.id, e.target.value)}
                          className="input input-bordered input-sm w-16 text-center"
                        />

                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => inc(item.id, item.qty)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 text-sm opacity-70">
                      Unit: ${currency(item.product.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        {/* Summary */}
        <aside className="w-full max-w-sm sticky top-6 border p-4">
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
          <div className="flex justify-between py-2 border-b">
            <span>Selected items</span>
            <span>{selected.size}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="font-medium">Subtotal</span>
            <span className="text-xl font-bold">
              ${currency(selectedSubtotal)}
            </span>
          </div>
          <button
            className="btn btn-accent w-full"
            disabled={selected.size === 0}
            onClick={() => {
              // Later: proceed with only selected item IDs
              const selectedIds = Array.from(selected);
              console.log("Proceed to checkout with IDs:", selectedIds);
            }}
          >
            Checkout ({selected.size})
          </button>
          <p className="text-xs opacity-70 mt-2">
            Only selected items are included in the subtotal and checkout.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
