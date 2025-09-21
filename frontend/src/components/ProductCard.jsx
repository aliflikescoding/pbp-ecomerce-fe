import React from "react";
import { NavLink } from "react-router-dom";

const ProductCard = ({
  title = "",
  thumbnailSrc,
  hoverImageSrc,
  categoryText,
  link,
  price,
  stock,
}) => {
  return (
    <NavLink
      to={link}
      className="flex flex-col h-full bg-white overflow-hidden shadow-md hover:shadow-none cursor-pointer group relative transition-shadow duration-300"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={thumbnailSrc}
          alt="Featured News"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {hoverImageSrc && (
          <img
            src={hoverImageSrc}
            alt="Product Hover Image"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/60 to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-4">
          <div className="badge badge-md badge-accent">{categoryText}</div>
        </div>
        <h3 className="text-2xl font-lora font-bold capitalize mb-3 line-clamp-2">
          {title || "Untitled"}
        </h3>
        <div className="flex justify-between">{price && <p>$ {price}</p>}
          {stock && <p>Stock: {stock}</p>}
        </div>
      </div>
      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
    </NavLink>
  );
};

export default ProductCard;
