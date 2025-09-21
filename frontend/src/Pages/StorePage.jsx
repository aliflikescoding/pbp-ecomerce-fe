import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaSort } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaSortAmountUp, FaSortAmountDown } from "react-icons/fa";
import { FaSortNumericDown, FaSortNumericUp } from "react-icons/fa";

const StorePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to "All"

  const categories = [
    {
      id: 1,
      name: "All",
    },
    {
      id: 2,
      name: "Men",
    },
    {
      id: 3,
      name: "Women",
    },
    {
      id: 4,
      name: "Kids",
    },
  ];

  const newProducts = [
    {
      id: 1,
      title: "Premium Wireless Headphones",
      categoryText: "Electronics",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      hoverImageSrc:
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop",
      price: "299.99",
      link: "/products/wireless-headphones",
      stock: 8
    },
    {
      id: 2,
      title: "Smart Fitness Watch",
      categoryText: "Health & Fitness",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
      hoverImageSrc:
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop",
      price: "199.99",
      link: "/products/fitness-watch",
      stock: 12
    },
    {
      id: 3,
      title: "Eco-Friendly Water Bottle",
      categoryText: "Health & Fitness",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
      hoverImageSrc:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      price: "24.99",
      link: "/products/water-bottle",
      stock: 15
    },
    {
      id: 4,
      title: "Premium Wireless Headphones",
      categoryText: "Electronics",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      hoverImageSrc:
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop",
      price: "299.99",
      link: "/products/wireless-headphones",
      stock: 8
    },
    {
      id: 5,
      title: "Smart Fitness Watch",
      categoryText: "Health & Fitness",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
      hoverImageSrc:
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop",
      price: "199.99",
      link: "/products/fitness-watch",
      stock: 12
    },
    {
      id: 6,
      title: "Eco-Friendly Water Bottle",
      categoryText: "Health & Fitness",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
      hoverImageSrc:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      price: "24.99",
      link: "/products/water-bottle",
      stock: 15
    },
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
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
              />
              <button className="btn join-item">
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
                  <a>
                    <FaSortAmountUp />
                    Newest
                  </a>
                </li>
                <li>
                  <a>
                    <FaSortAmountDown />
                    Oldest
                  </a>
                </li>
                <li>
                  <a>
                    <FaSortNumericUp />
                    Price: Low to High
                  </a>
                </li>
                <li>
                  <a>
                    <FaSortNumericDown />
                    Price: High to Low
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid mt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                categoryText={product.categoryText}
                thumbnailSrc={product.thumbnailSrc}
                hoverImageSrc={product.hoverImageSrc}
                previewText={product.previewText}
                stock={product.stock}
                price={product.price}
                link={product.link}
              />
            ))}
          </div>
          <div className="join mt-6 gap-2">
            <button className="btn btn-primary join-item">
              <FaChevronLeft />
            </button>
            <button className="join-item px-4">1</button>
            <button className="btn btn-primary join-item">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
