import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-neutral h-44 rounded-md mb-4"></div>
      <div className="h-4 bg-neutral rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-neutral rounded w-1/3"></div>
    </div>
  );
};

export default ProductSkeleton;
