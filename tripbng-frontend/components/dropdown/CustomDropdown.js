import Image from "next/image";
import React, { useEffect, useState } from "react";

const CustomDropdown = ({
  options = [],
  selectedValue = "",
  placeholder = "Select a city",
  onValueChange = () => {},
  searchEnabled = true,
  searchQuery,
  setSearchQuery,
  isOrigin = true,
  onCountryChange = () => {}, // Callback to pass country to parent
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      if (searchEnabled && searchQuery.trim() !== "") {
        const filteredCities = options.filter(
          (city) =>
            city.municipality
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            city.iata_code.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredOptions(filteredCities);
      } else {
        setFilteredOptions(options);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchCities();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, options, searchEnabled]);

  const handleOptionClick = (value, isoCountry) => {
    onValueChange(value);
    setIsOpen(false);

    // Store the selected city and iso_country in the storage
    if (isOrigin) {
      localStorage.setItem("originCity", value);
      localStorage.setItem("originCountry", isoCountry);
    } else {
      localStorage.setItem("destinationCity", value);
      localStorage.setItem("destinationCountry", isoCountry);
    }

    // Call the parent callback to update the origin/destination country
    onCountryChange(isoCountry);
  };

  return (
    <div className={`relative border ${placeholder === "Select origin city" ? "rounded-tl-lg rounded-bl-lg" : "rounded-none"}`}>
      <button
        className="w-full rounded-tl-lg rounded-bl-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-yellow"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedValue ? (
          <span className="flex flex-col gap-3 p-2">
            <span className="font-medium text-sm text-gray-500">
              {placeholder === "Select origin city" ? "From" : "To"}
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-bold text-2xl text-gray-900">
                {
                  options.find((opt) => opt.iata_code === selectedValue)
                    ?.municipality
                }
              </span>
              <span className="text-sm font-medium text-gray-500">
                {options.find((opt) => opt.iata_code === selectedValue)?.name}
              </span>
            </span>
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-96 mb-2 bg-white border rounded-lg shadow-2xl max-h-60 overflow-auto top-[50%]">
          {searchEnabled && (
            <div className="flex items-center gap-3 px-3 py-2 shadow-lg">
              <Image src="/icons/search.png" width={100} height={100} className="w-6 h-6" alt="Dropdown"/>
              <input
                type="text"
                className="w-full focus:outline-none focus:ring-2"
                placeholder="Search airport, city, or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {/* Options */}
          {filteredOptions && filteredOptions.length > 0 ? (
            filteredOptions.map((option, i) => {
              return (
                <div
                  key={option.iata_code}
                  className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleOptionClick(option.iata_code, option.iso_country)}
                >
                  <div className="flex gap-3 items-center w-full">
                    <Image src="/icons/departures.png" width={100} height={100} className="w-6 h-6" alt="Dropdown"/>
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">
                          {option.municipality}
                        </h2>
                        <h2 className="text-gray-500 text-lg font-semibold">
                          {option.iata_code}
                        </h2>
                      </div>
                      <p className="text-gray-500 text-sm">{option.name}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="p-4 text-center text-gray-500">No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
