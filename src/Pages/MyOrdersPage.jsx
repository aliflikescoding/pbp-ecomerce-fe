import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { getUserOrders, getUserOrdersByStatus } from "../api";
import { FaClipboardList, FaShippingFast, FaCheckCircle } from "react-icons/fa";
import { PiHourglassHighFill } from "react-icons/pi";

const statusFilters = [
  {
    key: "all",
    label: "Semua",
    description: "Semua pesanan terbaru kamu",
    icon: <FaClipboardList className="w-5 h-5" />,
  },
  {
    key: "pending",
    label: "Menunggu",
    description: "Pesanan yang sedang diproses",
    icon: <PiHourglassHighFill className="w-5 h-5" />,
  },
  {
    key: "shipped",
    label: "Dikirim",
    description: "Pesanan yang sedang dikirim",
    icon: <FaShippingFast className="w-5 h-5" />,
  },
  {
    key: "received",
    label: "Selesai",
    description: "Pesanan yang sudah diterima",
    icon: <FaCheckCircle className="w-5 h-5" />,
  },
];

const statusStyles = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  shipped: "bg-blue-100 text-blue-700 border-blue-200",
  received: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const formatCurrency = (value) => {
  if (typeof value !== "number") return "-";
  return value.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          activeFilter === "all"
            ? await getUserOrders()
            : await getUserOrdersByStatus(activeFilter);

        if (!isMounted) return;
        setOrders(Array.isArray(response) ? response : []);
      } catch (err) {
        if (!isMounted) return;
        const status = err?.response?.status;
        const message =
          err?.response?.data?.message || "Gagal memuat data pesanan.";
        setError(message);

        if (status === 401) {
          navigate("/login", { replace: true, state: { from: location } });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [activeFilter, location, navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative h-[320px] w-full overflow-hidden">
        <img
          src="/hero-image.png"
          alt="Aurora & Co My Orders"
          className="absolute inset-0 h-full w-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center text-white">
          <div className="max-w-2xl">
            <span className="inline-flex items-center justify-center rounded-full border border-amber-300/50 bg-amber-400/10 px-5 py-2 text-amber-200">
              <FaClipboardList className="h-5 w-5" />
            </span>
            <h1 className="mt-6 text-4xl font-light tracking-wide md:text-5xl">
              Riwayat Pesanan Kamu
            </h1>
            <p className="mt-3 text-sm font-light text-amber-100/80 md:text-base">
              Pantau setiap pesanan dari Aurora &amp; Co dalam satu tempat.
              Gunakan filter untuk melihat progres pengirimanmu.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl border border-white/40 bg-white/95 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-sm">
            <div className="grid gap-10">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {statusFilters.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveFilter(item.key)}
                    className={`group rounded-xl border px-5 py-4 text-left transition-all duration-300 ${
                      activeFilter === item.key
                        ? "border-amber-400 bg-white shadow-lg shadow-amber-500/10 -translate-y-1"
                        : "border-slate-200 bg-white/70 hover:border-amber-200 hover:-translate-y-1"
                    }`}
                  >
                    <div
                      className={`mb-3 inline-flex items-center justify-center rounded-lg border px-3 py-2 transition-colors ${
                        activeFilter === item.key
                          ? "border-amber-300 bg-amber-50 text-amber-600"
                          : "border-slate-200 bg-white text-slate-600 group-hover:border-amber-200 group-hover:text-amber-600"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <p className="text-base font-medium text-slate-800">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-amber-300 border-t-transparent"></div>
                    <p className="mt-4 text-sm text-slate-500">
                      Memuat data pesanan...
                    </p>
                  </div>
                ) : error ? (
                  <div className="p-12 text-center">
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-sm text-slate-500">
                      Belum ada pesanan pada kategori ini. Yuk lanjut belanja di
                      Store kami!
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <li key={order.id} className="p-6 lg:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-sm font-medium uppercase tracking-wide text-slate-500">
                                Order #{order.id}
                              </span>
                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                                  statusStyles[order.status] ||
                                  "bg-slate-100 text-slate-600 border-slate-200"
                                }`}
                              >
                                <span className="block h-2 w-2 rounded-full bg-current"></span>
                                {order.status}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">
                              {formatDate(order.created_at)}
                            </p>
                            {order.address_text && (
                              <p className="mt-3 text-sm text-slate-600">
                                <span className="font-medium text-slate-700">
                                  Alamat Pengiriman:
                                </span>{" "}
                                {order.address_text}
                              </p>
                            )}
                          </div>
                          <div className="text-left lg:text-right">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Total Pembayaran
                            </p>
                            <p className="text-2xl font-semibold text-slate-900">
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Item Pesanan
                          </p>
                          <div className="mt-3 space-y-3">
                            {order.order_items?.map((item) => (
                              <div
                                key={`${order.id}-${item.id}`}
                                className="flex flex-col gap-3 rounded-lg border border-white bg-white/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                  <p className="text-sm font-medium text-slate-800">
                                    {item.product?.name || "Produk"}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Qty: {item.qty} &middot; Harga:{" "}
                                    {formatCurrency(item.price)}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {formatCurrency(item.subtotal)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyOrdersPage;
