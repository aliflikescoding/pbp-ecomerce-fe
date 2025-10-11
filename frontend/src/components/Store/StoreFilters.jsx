import { React, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const StoreFilters = ({
  categories = [],
  selectedCategory,
  onSelect,
  
  onReset,
}) => {
  // ensure we always have something sensible to show
  const fallback = [
    { id: null, name: "All" },
    { id: 1, name: "Baju" },
    { id: 2, name: "Sepatu" },
    { id: 3, name: "Jaket" },
    { id: 4, name: "Aksesoris" },
  ];

  const finalCategories =
    categories && categories.length > 0 ? categories : fallback;

  // count excluding the 'All' entry if present
  const categoryCount = Math.max(
    0,
    finalCategories.filter((c) => c.id != null).length
  );

  const [showDropdown, setShowDropdown] = useState(false);

  const displayDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <aside className="w-full md:w-1/2">
      <div className="sticky top-24 space-y-4">
        {/* Categories as plain text links (no boxes) */}
        <div className="card shadow-sm rounded-sm p-2">
          <button
            onClick={displayDropdown}
            className="flex items-center justify-between shadow-md border rounded-lg py-1 px-2 font-playfair text-lg font-semibold focus:cursor-pointer hover:cursor-pointer"
          >
            Categories {showDropdown ? <ChevronUp /> : <ChevronDown />}
          </button>

          {showDropdown && (
            <nav className="w-full px-2 bg-slate-200">
              <ul className="flex flex-col gap-2">
                {finalCategories.map((c) => {
                  const isSelected = selectedCategory === c.id;
                  return (
                    <li key={String(c.id)}>
                      <button
                        onClick={() => onSelect(c.id)}
                        className={`w-full text-left py-2 text-base leading-6 transition-colors duration-150 focus:outline-none ${
                          isSelected
                            ? "text-primary font-semibold underline decoration-primary/30"
                            : "text-neutral/90 hover:text-primary"
                        }`}
                      >
                        {c.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {/* Sort moved to header */}

          <div className="mt-3 flex flex-col items-center">
            <button className="btn btn-ghost w-full" onClick={onReset}>
              Reset filters
            </button>
            <span className="text-sm text-neutral/60">
              Found {categoryCount} categories
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StoreFilters;
