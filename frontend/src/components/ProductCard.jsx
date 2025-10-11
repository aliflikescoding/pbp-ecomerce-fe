import React from "react";
import { NavLink } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const ProductCard = ({
  title = "",
  thumbnailSrc,
  hoverImageSrc,
  categoryText,
  link,
  price,
  stock,
}) => {
  const placeholder = "/dummy/placeholder-product.svg";
  const thumb = thumbnailSrc || placeholder;
  const hoverImg = hoverImageSrc || null;
  return (
    <NavLink
      to={link}
      className="flex flex-col h-full bg-white overflow-hidden shadow-sm hover:shadow-md cursor-pointer group relative transition-shadow duration-300"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral">
        <img
          src={thumb}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hoverImageSrc && (
          <img
            src={hoverImageSrc}
            alt={`${title} hover`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-4 top-4">
          <span className="inline-block bg-white/90 text-neutral px-3 py-1 rounded-full text-xs font-medium shadow-sm">{categoryText}</span>
        </div>

        {/* overlay removed: move price/add-to-cart into details area below */}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold capitalize mb-2 line-clamp-2">{title || "Untitled"}</h3>
        <div className="mt-auto flex items-center justify-between text-sm text-neutral/80 gap-3">
          <div>
            {stock !== undefined && <span>Stock: {stock}</span>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base font-medium">${price}</span>
            <button
              className="btn btn-sm btn-primary btn-square"
              aria-label={`Add ${title} to cart`}
              title={`Add ${title} to cart`}
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>

      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
    </NavLink>
  );
};

export default ProductCard;
