import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaSort } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaSortAmountUp, FaSortAmountDown } from "react-icons/fa";
import { FaSortNumericDown, FaSortNumericUp } from "react-icons/fa";
import { getCategories, getProducts } from "../api";

const StorePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 6,
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, search, sortBy, pagination.currentPage]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories([{ id: null, name: "All" }, ...data]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(
        pagination.currentPage,
        search,
        sortBy,
        selectedCategory
      );
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchProducts();
  };

  const handleSort = (sortValue) => {
    setSortBy(sortValue);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      return `${import.meta.env.VITE_IMAGE_URL}${product.images[0].url}`;
    }
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop";
  };

  const getHoverImageUrl = (product) => {
    if (product.images && product.images.length > 1) {
      return `${import.meta.env.VITE_IMAGE_URL}${product.images[1].url}`;
    }
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop";
  };

  return (
    <section
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        backgroundImage: "url(/hero-image.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-amber-950/85 to-slate-900/90"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[28rem] h-[28rem] bg-amber-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[26rem] h-[26rem] bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 right-0 w-[20rem] h-[20rem] bg-white/5 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative custom-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4 mx-auto"></div>
            <span className="text-xs font-light tracking-[0.3em] text-amber-200 uppercase">
              Discover The Collection
            </span>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-4 mx-auto"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-neutral-content font-playfair mb-6">
            Curated Pieces For{" "}
            <span className="italic text-amber-200">Every Story</span>
          </h1>
          <p className="text-neutral-content/70 font-light leading-relaxed">
            Explore our handpicked selection of timeless creations. Filter by
            category, search for specific pieces, and find the design that
            complements your personal narrative.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-10">
          <aside className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg shadow-slate-900/25">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-[0.4em] text-amber-200">
                  Categories
                </p>
                <span className="text-[0.7rem] font-light text-neutral-content/60">
                  {categories.length} options
                </span>
              </div>
              <div className="space-y-2">
                {categories.map((category) => {
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-500 font-light tracking-wide ${
                        isActive
                          ? "bg-amber-400/20 border border-amber-300/60 text-amber-100 shadow-lg shadow-amber-500/25"
                          : "bg-white/5 border border-white/10 text-neutral-content/75 hover:bg-white/10 hover:border-amber-300/40 hover:text-amber-100"
                      }`}
                      key={category.id === null ? "all" : category.id}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <span className="uppercase text-xs tracking-[0.25em]">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg shadow-slate-900/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="join w-full md:max-w-md">
                  <input
                    type="text"
                    className="input join-item w-full bg-white/10 border border-white/20 text-neutral-content placeholder:text-neutral-content/60"
                    placeholder="Search by product name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <button
                    className="btn join-item bg-amber-400/20 border border-amber-300/60 text-amber-100 hover:bg-amber-400/30"
                    onClick={handleSearch}
                  >
                    <IoIosSearch />
                  </button>
                </div>

                <div className="dropdown dropdown-bottom dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn bg-white/10 border border-white/20 text-neutral-content hover:bg-white/20 hover:border-amber-300/40"
                  >
                    Sort <FaSort className="ml-2" />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-slate-900/90 backdrop-blur-xl rounded-box z-10 w-52 p-2 shadow-2xl border border-white/10 text-neutral-content"
                  >
                    <li>
                      <button onClick={() => handleSort("newest")}>
                        <FaSortAmountUp />
                        Newest
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleSort("oldest")}>
                        <FaSortAmountDown />
                        Oldest
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleSort("price_asc")}>
                        <FaSortNumericUp />
                        Price: Low to High
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleSort("price_desc")}>
                        <FaSortNumericDown />
                        Price: High to Low
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="loading loading-spinner loading-lg text-amber-200"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard
                      key={product.id}
                      title={product.name}
                      categoryText={product.category.name}
                      thumbnailSrc={getImageUrl(product)}
                      hoverImageSrc={getHoverImageUrl(product)}
                      stock={product.stock}
                      price={product.price}
                      link={`/products/${product.id}`}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl text-neutral-content/70">
                    No products found. Try adjusting your filters.
                  </div>
                )}
              </div>
            )}

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 px-4 py-3 rounded-full shadow-lg shadow-slate-900/20 flex items-center justify-center gap-3">
              <button
                className="btn btn-sm bg-white/10 border border-white/20 text-neutral-content hover:bg-white/20 hover:border-amber-300/40"
                disabled={!pagination.hasPreviousPage}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                <FaChevronLeft />
              </button>
              <span className="text-sm font-light uppercase tracking-[0.3em] text-neutral-content/80">
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                className="btn btn-sm bg-white/10 border border-white/20 text-neutral-content hover:bg-white/20 hover:border-amber-300/40"
                disabled={!pagination.hasNextPage}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorePage;
