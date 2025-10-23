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
    <section className="min-h-screen py-8 bg-gray-50">
      <div className="custom-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="mb-4">
            <span className="text-sm font-medium tracking-wide text-blue-600 uppercase">
              Browse Our Products
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find What You <span className="text-blue-600">Love</span>
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Explore our collection. Filter by category, search for specific items, 
            and find exactly what you're looking for.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-900 uppercase">
                  Categories
                </p>
                <span className="text-xs text-gray-500">
                  {categories.length} options
                </span>
              </div>
              <div className="space-y-2">
                {categories.map((category) => {
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                      key={category.id === null ? "all" : category.id}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="join w-full md:max-w-md">
                  <input
                    type="text"
                    className="input join-item w-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400"
                    placeholder="Search by product name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <button
                    className="btn join-item bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                    onClick={handleSearch}
                  >
                    <IoIosSearch />
                  </button>
                </div>

                <div className="dropdown dropdown-bottom dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Sort <FaSort className="ml-2" />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-white rounded-lg z-10 w-52 p-2 shadow-lg border border-gray-200"
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
                <div className="loading loading-spinner loading-lg text-blue-600"></div>
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
                  <div className="col-span-full text-center py-16 bg-white border border-gray-200 rounded-lg text-gray-500">
                    No products found. Try adjusting your filters.
                  </div>
                )}
              </div>
            )}

            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm flex items-center justify-center gap-3">
              <button
                className="btn btn-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={!pagination.hasPreviousPage}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                <FaChevronLeft />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                className="btn btn-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
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
