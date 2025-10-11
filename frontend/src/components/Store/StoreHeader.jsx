import React from "react";
import { IoIosSearch, IoIosArrowDown } from "react-icons/io";

const StoreHeader = ({ search, setSearch, onSearch, sortBy, onSortChange }) => {
  const handleSortChange = (event) => {
    const value = event.target.value;
    if (onSortChange) {
      onSortChange(value);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold">Shop</h2>
        <p className="text-sm text-neutral/70">Browse our latest products</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full sm:w-auto sm:items-center">
        <div className="join w-full sm:w-auto">
          <input
            type="text"
            className="input join-item"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          />
          <button className="btn join-item" onClick={onSearch}>
            <IoIosSearch />
          </button>
        </div>

        <div className="relative w-full sm:w-auto group">
          <div className="flex items-center justify-between gap-3 h-12 rounded-lg border border-neutral/20 bg-base-100 px-4 min-w-[180px] pointer-events-none transition-colors group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/30">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral/60 flex items-center gap-1">
              Sort
              <IoIosArrowDown className="w-4 h-4" />
            </span>
          </div>
          <select
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            value={sortBy}
            onChange={handleSortChange}
            aria-label="Sort products"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StoreHeader;
