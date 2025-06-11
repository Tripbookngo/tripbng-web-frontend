import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const BusLocationSelector = React.memo(({
  label,
  placeholder,
  value,
  onChange,
  className,
  isOpen,
  onClose,
  options = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Debounce search term for smoother filtering
  const debouncedSearch = useDebounce(searchTerm, 180);

  // Memoize filtered options for performance
  const filteredOptions = useMemo(() => {
    if (!debouncedSearch) return options;
    return options.filter(city =>
      city.CityName.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, options]);

  useEffect(() => {
    if (isOpen) setSearchTerm("");
  }, [isOpen]);

  const handleLocationSelect = (city) => {
    onChange(city);
    onClose();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {isOpen && (
        <div className="absolute z-20 mt-2 w-full max-h-72 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 animate-slide-up">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={placeholder || "Search cities..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          {filteredOptions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredOptions.map((city) => (
                <button
                  key={city.CityID}
                  onClick={() => handleLocationSelect(city)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-sm text-gray-800">
                      {city.CityName}
                    </div>
                    {city.StateName && (
                      <div className="text-xs text-gray-500">
                        {city.StateName}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : debouncedSearch ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No cities found
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              Start typing to search for cities
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default BusLocationSelector;
