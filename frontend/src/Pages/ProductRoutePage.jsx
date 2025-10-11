import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { getProductById, checkUserAuth } from "../api";
import { toast } from "react-toastify";

const ProductRoutePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentAmount, setCurrentAmount] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        // Set the first image as the selected image by default
        if (data?.images && data.images.length > 0) {
          setSelectedImage(
            `${import.meta.env.VITE_IMAGE_URL}${data.images[0].url}`
          );
        }
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleThumbnailClick = (imageUrl) => {
    setSelectedImage(`${import.meta.env.VITE_IMAGE_URL}${imageUrl}`);
  };

  const handleMinClick = () => {
    if (currentAmount !== 1) {
      setCurrentAmount(currentAmount - 1);
    }
  };

  const handleAddClick = () => {
    setCurrentAmount(currentAmount + 1);
  };

  const handleAddToCart = async () => {
    try {
      const res = await checkUserAuth();
      if (res.status === "success") {
        toast.success("Product added to cart");
      } else {
        toast.error("Please login to add product to cart");
      }
    } catch (error) {
      // Catch the axios error when user is not authenticated
      console.log(error);
      toast.error("Please login to add product to cart");
    }
  };

  return (
    <div className="custom-container py-10">
      <button onClick={handleGoBack} className="btn btn-primary">
        <FaArrowLeft />
        Go Back
      </button>

      <div className="mt-8">
        {loading && <p>Loading product...</p>}

        {error && (
          <div className="text-red-600">
            <p>Error: {error}</p>
          </div>
        )}

        {product && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Image Gallery Section */}
            <div className="space-y-4">
              {/* Main Large Image */}
              <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto">
                  {product.images.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => handleThumbnailClick(image.url)}
                      className={`flex-shrink-0 w-20 h-20 cursor-pointer overflow-hidden border-[1px] transition-all ${
                        selectedImage ===
                        `${import.meta.env.VITE_IMAGE_URL}${image.url}`
                          ? "border-accent"
                          : "border-base-300 hover:border-accent"
                      }`}
                    >
                      <img
                        src={`${import.meta.env.VITE_IMAGE_URL}${image.url}`}
                        alt={`${product.name} thumbnail`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                  ${product.price}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Category:{" "}
                  <span className="font-medium">{product.category?.name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Stock: <span className="font-medium">{product.stock}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      product.is_active ? "text-success" : "text-red-600"
                    }`}
                  >
                    {product.is_active ? "Available" : "Unavailable"}
                  </span>
                </p>
              </div>

              {product.description && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="border-primary border-[1px] p-4">
                <h1 className="font-semibold font-playfair underline mb-4 text-lg">
                  Change amount and Purchase
                </h1>
                <div className="flex items-center gap-4">
                  <button className="btn btn-primary" onClick={handleMinClick}>
                    -
                  </button>
                  <p className="text-xl">{currentAmount}</p>
                  <button
                    disabled={currentAmount === product.stock}
                    className="btn btn-primary"
                    onClick={handleAddClick}
                  >
                    +
                  </button>
                </div>
                <div className="flex justify-between items-end mb-4">
                  <h1 className="font-semibold font-playfair underline">
                    Subtotal
                  </h1>
                  <h1 className="text-2xl font-bold">
                    $ {product.price * currentAmount}
                  </h1>
                </div>
                <button onClick={handleAddToCart} className="btn btn-primary btn-block">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRoutePage;
