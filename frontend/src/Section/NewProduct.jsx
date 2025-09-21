import React from "react";
import ProductCard from "../components/ProductCard";

const NewProduct = () => {
  // Dummy data for products
  const newProducts = [
    {
      id: 1,
      title: "Premium Wireless Headphones",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      hoverImageSrc:
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop",
      previewText:
        "Experience crystal-clear audio with our latest wireless headphones featuring noise cancellation and 30-hour battery life.",
      price: "299.99",
      link: "/products/wireless-headphones",
    },
    {
      id: 2,
      title: "Smart Fitness Watch",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
      hoverImageSrc:
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop",
      previewText:
        "Track your health and fitness goals with advanced sensors, GPS, and week-long battery life in a sleek design.",
      price: "199.99",
      link: "/products/fitness-watch",
    },
    {
      id: 3,
      title: "Eco-Friendly Water Bottle",
      thumbnailSrc:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
      hoverImageSrc:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      previewText:
        "Stay hydrated with our sustainable stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
      price: "24.99",
      link: "/products/water-bottle",
    },
  ];

  return (
    <div className="py-12 custom-container">
      <h1 className="text-5xl font-bold font-playfair text-center mb-8">
        New Arrivals
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newProducts.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            thumbnailSrc={product.thumbnailSrc}
            hoverImageSrc={product.hoverImageSrc}
            previewText={product.previewText}
            price={product.price}
            link={product.link}
          />
        ))}
      </div>
    </div>
  );
};

export default NewProduct;
