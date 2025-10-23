// src/sections/NewProduct.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ArrowText from "../components/ArrowText";
import { getProducts } from "../api";

const NewProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewProducts();
  }, []);

  const fetchNewProducts = async () => {
    try {
      setLoading(true);
      // Fetch only 3 products from your backend (limit=3)
      const data = await getProducts(1, "", "newest", null, 3);
      // Ensure compatibility with your backend response structure
      setProducts(data.products ? data.products.slice(0, 3) : []);
    } catch (error) {
      console.error("Error fetching new products:", error);
    } finally {
      setLoading(false);
    }
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
    <section className="custom-container py-16">
      <div className="bg-white rounded-2xl px-8 py-12 shadow-lg border border-gray-200">
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="text-sm font-medium tracking-wide text-blue-600 uppercase">
              New Arrivals
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Latest Products
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="loading loading-spinner loading-lg text-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.name}
                  categoryText={product.category?.name || "Uncategorized"}
                  thumbnailSrc={getImageUrl(product)}
                  hoverImageSrc={getHoverImageUrl(product)}
                  stock={product.stock}
                  price={product.price}
                  link={`/products/${product.id}`}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
                No products available.
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <ArrowText text="Go to store" link="/store" />
        </div>
      </div>
    </section>
  );
};

export default NewProduct;
