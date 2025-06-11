import { useEffect, useRef, useState } from "react";

const SearchableDropdown = ({
  options,
  label,
  id,
  selectedVal,
  handleChange,
  isOpen,
  toggleDropdown
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", toggleDropdown);
    }
    return () => document.removeEventListener("click", toggleDropdown);
  }, [isOpen, toggleDropdown]);

  const selectOption = (option) => {
    setQuery("");  // Clear search input when an option is selected
    handleChange(option[label]);
    toggleDropdown();  // Close the dropdown after selecting an option
  };

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal;
    return "Select county";  // Default text when nothing is selected
  };

  const filter = (options) => {
    return options.filter(
      (option) => option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  return (
    <div className="relative text-gray-800 cursor-default">
      {/* Button to toggle dropdown */}
      <div className="relative">
        {/* We use the selected county as text in the dropdown */}
        <p
          onClick={toggleDropdown}
          className="text-xs text-neutral-400 cursor-pointer"
        >
          {selectedVal || "Select county"}
        </p>
      </div>

      {/* Dropdown with search */}
      <div
        className={`absolute top-full w-full bg-white border border-gray-300 shadow-md mt-1 max-h-48 overflow-y-auto z-10 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="p-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            name="searchTerm"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country..."
            className="text-base bg-transparent border-none rounded-sm box-border cursor-pointer outline-none py-2 px-4 w-full"
          />
        </div>
        {/* Display filtered options */}
        {filter(options).map((option, index) => {
          return (
            <div
              onClick={() => selectOption(option)}
              className={`cursor-pointer block py-2 px-4 text-gray-600 ${
                option[label] === selectedVal ? "bg-blue-100 text-gray-800" : "hover:bg-blue-50"
              }`}
              key={`${id}-${index}`}
            >
              {option[label]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchableDropdown;
