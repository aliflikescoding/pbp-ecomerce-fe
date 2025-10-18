import React from "react";
import ProductCard from "../components/ProductCard";
import ArrowText from "../components/ArrowText";

const NewProduct = () => {
  // Dummy data for products
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
  ];

  return (
    <section className="custom-container">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] px-8 py-12 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.9)]">
        <div className="text-center text-neutral-content mb-12">
          <div className="inline-block mb-6">
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4 mx-auto"></div>
            <span className="text-xs font-light tracking-[0.3em] text-amber-200 uppercase">
              Freshly Curated
            </span>
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-4 mx-auto"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-light font-playfair">
            New Arrivals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="mt-10 flex justify-center">
          <ArrowText text="Go to store" link="/store" />
        </div>
      </div>
    </section>
  );
};

export default NewProduct;
