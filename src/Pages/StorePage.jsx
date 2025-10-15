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
    <div className="py-12 custom-container">
      <div className="flex gap-4 min-h-screen">
        <div className="w-1/5">
          <div className="flex flex-col gap-4">
            {categories.map((category) => (
              <button
                className={`btn btn-block ${
                  selectedCategory === category.id
                    ? "btn-accent"
                    : "btn-primary"
                }`}
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="w-4/5">
          <div className="flex justify-between items-center">
            <div className="join">
              <input
                type="text"
                className="input join-item"
                placeholder="Product name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="btn join-item" onClick={handleSearch}>
                <IoIosSearch />
              </button>
            </div>
            <div className="dropdown dropdown-bottom dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-primary m-1">
                sort <FaSort />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li>
                  <a onClick={() => handleSort("newest")}>
                    <FaSortAmountUp />
                    Newest
                  </a>
                </li>
                <li>
                  <a onClick={() => handleSort("oldest")}>
                    <FaSortAmountDown />
                    Oldest
                  </a>
                </li>
                <li>
                  <a onClick={() => handleSort("price_asc")}>
                    <FaSortNumericUp />
                    Price: Low to High
                  </a>
                </li>
                <li>
                  <a onClick={() => handleSort("price_desc")}>
                    <FaSortNumericDown />
                    Price: High to Low
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center mt-6 h-64">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          ) : (
            <div className="grid mt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
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
              ))}
            </div>
          )}

          <div className="join mt-6 gap-2">
            <button
              className="btn btn-primary join-item"
              disabled={!pagination.hasPreviousPage}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              <FaChevronLeft />
            </button>
            <button className="join-item px-4">
              {pagination.currentPage} / {pagination.totalPages}
            </button>
            <button
              className="btn btn-primary join-item"
              disabled={!pagination.hasNextPage}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
