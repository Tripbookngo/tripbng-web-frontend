// LocationSelector.js
import React, { useState, useRef, useEffect, useContext } from "react";
import { MapPin, Plane, Search, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";

const DropdownContext = React.createContext();

const LocationSelector = ({
  label,
  placeholder,
  value,
  onChange,
  excludeCity,
  className,
  module,
  isMultiple = false,
  selectedTripType,
  countryCode,
  showAllCountries = false,
  destination,
  additional,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const { openDropdown, setOpenDropdown } = useContext(DropdownContext);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchAirports = async (search) => {
      setLoading(true);
      try {
        const query = search.trim() ? search : " ";
        const url = `https://tripbookngo-backend.onrender.com/flight/searchAirport?search=${encodeURIComponent(
          query
        )}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("API Response:", data);
        if (data.success) {
          const filteredData = data.data.map((airport) => ({
            code: airport.iata_code,
            name: airport.name,
            country: airport.iso_country,
            municipality: airport.municipality || "Unknown",
          }));

          setAirports(filteredData);
        }
      } catch (error) {
        console.error("Error fetching airports:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!searchTerm) {
      fetchAirports("");
      setIsOpen(false);
    } else {
      setIsOpen(true);
      const delayDebounce = setTimeout(() => {
        fetchAirports(searchTerm);
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm]);

  const handleCitySelect = (city) => {
    onChange(city);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange(null);
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        if (response.status === 200) {
          const countryList = response.data.map((country) => ({
            name: country.name.common,
            official: country.name.official,
            code: country.cca2,
            flag: country.flags?.svg || "",
          }));
          setCountries(countryList);
          setFilteredCountries(countryList);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    if (showAllCountries) {
      fetchCountries();
    } else if (selectedTripType === "Domestic" && countryCode) {
      fetchStates(countryCode);
    }
  }, [showAllCountries, selectedTripType, countryCode]);

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = countries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.official.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchTerm, countries]);

  useEffect(() => {
    if (destination && destination.code) {
      if (!showAllCountries && selectedTripType === "Domestic") {
        fetchStates(destination.code);
      } else {
        setStates([]);
      }
    } else {
      setStates([]);
    }
  }, [destination, showAllCountries, selectedTripType]);

  // Fetch States from API
  const fetchStates = async (countryCode) => {
    if (!countryCode) return;

    console.log(`Fetching states for country: ${countryCode}`);

    try {
      const response = await fetch(
        `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
        {
          headers: {
            "X-CSCAPI-KEY":
              "UGVGOHVQUGM5WUtvME80eGhRbHVrcUROZmJMREVFTjZLSkFJcWFkTg==",
          },
        }
      );

      const data = await response.json();
      console.log("Fetched states:", data);

      if (Array.isArray(data)) {
        setStates(data);
      } else {
        console.error("Unexpected API response:", data);
        setStates([]);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  };

  // Function to fetch cities
  const fetchCities = async (countryCode, stateCode = null) => {
    if (!countryCode) return;

    console.log(
      `Fetching cities for country: ${countryCode}, state: ${stateCode}`
    );

    let url = `https://api.countrystatecity.in/v1/countries/${countryCode}/cities`;
    if (stateCode) {
      url = `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`;
    }

    try {
      const headers = new Headers();
      headers.append(
        "X-CSCAPI-KEY",
        "UGVGOHVQUGM5WUtvME80eGhRbHVrcUROZmJMREVFTjZLSkFJcWFkTg=="
      );

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      console.log("Fetched cities:", data);

      if (Array.isArray(data)) {
        setCities(data);
      } else {
        console.error("Unexpected API response:", data);
        setCities([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    }
  };

  useEffect(() => {
    if (module === "Holiday") {
      if (selectedTripType === "Domestic" && destination && destination.iso2) {
        fetchCities("IN", destination.iso2);
      } else if (
        selectedTripType === "International" &&
        destination &&
        destination.code
      ) {
        fetchCities(destination.code);
      } else {
        setCities([]);
      }
    }
  }, [selectedTripType, destination, module]);

  const handleCountrySelect = (country) => {
    console.log("Selected country:", country);
    setSelectedCountry(country);
    onChange(country);
    handleCloseDropdown();
    setSearchTerm("");
  };

  const handleStateSelect = (state) => {
    console.log("Selected state:", state);
    setSelectedState(state);
    onChange(state);
    handleCloseDropdown();
    setSearchTerm("");
  };

  const handleOpenDropdown = () => {
    setOpenDropdown(label);
    setIsOpen(true);
  };

  const handleCloseDropdown = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  useEffect(() => {
    if (openDropdown && openDropdown !== label) {
      setIsOpen(false);
    }
  }, [openDropdown, label]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {module !== "FlightList" && (
        <label className=" text-sm font-medium text-neutral-400 mb-1 md:mt-3 hidden md:block">
          {label}
        </label>
      )}
      <div className="w-full">
        <div
          onClick={() => {
            if (isOpen) {
              handleCloseDropdown();
            } else {
              handleOpenDropdown();
            }
          }}
          className={`cursor-pointer  ${
            module === "FlightList" ? "md:py-0" : "md:py-2"
          }`}
        >
          {value ? (
            <div>
              {module === "Holiday" ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:block">
                    <h1
                      className={` font-semibold text-gray-900 ${
                        additional === "Cities" ? "md:text-sm" : "md:text-2xl"
                      }`}
                    >
                      {value.name || "Select Location"}
                    </h1>
                  </div>
                  <div className=" md:hidden">
                    <h1 className="md:text-2xl font-semibold text-gray-900">
                      {value.name}
                    </h1>
                    <span className="flex items-center text-gray-600 text-sm truncate max-w-full">
                      <p className="font-medium">{value.municipality}</p>
                    </span>
                  </div>
                </div>
              ) : module === "FlightList" ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:block">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={12} />   {label}
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {value.municipality}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {module !== "Visa" ? (
                    <Image src="/icons/departures.png" width={25} height={25} alt="departures"/>
                  ) : null}
                  <div className="hidden md:block">
                    <h1 className="md:text-2xl font-semibold text-gray-900">
                      {value.municipality}
                    </h1>
                    {module !== "Visa" ? (
                      <span className="flex items-center text-gray-600 text-sm truncate max-w-full">
                        <p className="font-medium">{value.code}</p>
                        <span className="font-medium">, </span>
                        <span className="font-medium truncate w-[50%]">
                          {" "}
                          {value.name}
                        </span>
                      </span>
                    ) : null}
                  </div>
                  <div className=" md:hidden">
                    <h1 className="md:text-2xl font-semibold text-gray-900">
                      {value.code}
                    </h1>
                    <span className="flex items-center text-gray-600 text-sm truncate max-w-full">
                      <p className="font-medium">{value.municipality}</p>
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">{placeholder}</p>
          )}
        </div>
      </div>

      {isOpen && module === "Flight" && (
        <div className="absolute z-20 mt-1 w-[350px] max-h-72 overflow-y-auto bg-white rounded-md shadow-md border border-gray-200 animate-slide-up">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search airports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                autoFocus
              />
            </div>
          </div>
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Loading...
            </div>
          ) : airports.length > 0 ? (
            <div className="p-1">
              {airports.map((airport, index) => (
                <div key={index}>
                  <button
                    key={airport.code}
                    onClick={() => handleCitySelect(airport)}
                    className="w-full text-left px-1 py-1 text-sm hover:bg-gray-50 rounded-md flex items-start space-x-3 transition-colors"
                  >
                    <Plane
                      size={16}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-sm text-gray-800">
                        {airport.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {airport.country} ({airport.code})
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No airports found
            </div>
          )}
        </div>
      )}
      {isOpen && module === "FlightList" && (
        <div className="absolute z-20 mt-1 w-[350px] max-h-72 overflow-y-auto bg-white rounded-md shadow-md border border-gray-200 animate-slide-up">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search airports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                autoFocus
              />
            </div>
          </div>
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Loading...
            </div>
          ) : airports.length > 0 ? (
            <div className="p-1">
              {airports.map((airport) => (
                <div>
                  <button
                    key={airport.code}
                    onClick={() => handleCitySelect(airport)}
                    className="w-full text-left px-1 py-1 text-sm hover:bg-gray-50 rounded-md flex items-start space-x-3 transition-colors"
                  >
                    <Plane
                      size={16}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <div className="font-medium text-gray-800">
                        {airport.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {airport.country} ({airport.code})
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No airports found
            </div>
          )}
        </div>
      )}
      {isOpen && module === "Holiday" && (
        <div className="absolute z-20 mt-1 w-[350px] max-h-72 overflow-y-auto bg-white rounded-md shadow-md border border-gray-200 animate-slide-up">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={
                  showAllCountries ? "Search countries..." : "Search states..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                autoFocus
              />
            </div>
          </div>
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Loading...
            </div>
          ) : (
            <div className="p-1">
              {showAllCountries ? (
                filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country)}
                      className="w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center space-x-3 transition-colors"
                    >
                      <Image
                        src="/icons/locationHoliday.png"
                        alt={country.name}
                        className="w-5 h-5 flex-shrink-0"
                        width={30}
                        height={30}
                      />
                      <div className="font-medium text-gray-800">
                        {country.name}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No countries found
                  </div>
                )
              ) : (
                states.map((state) => (
                  <button
                    key={state.iso2}
                    onClick={() => handleStateSelect(state)}
                    className="w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center space-x-3 transition-colors"
                  >
                    <Image
                      src="/icons/locationHoliday.png"
                      alt={state.name}
                      className="w-5 h-5 flex-shrink-0"
                      width={30}
                      height={30}
                    />
                    <div className="font-medium text-gray-800">
                      {state.name}
                    </div>
                  </button>
                ))
              )}
              {/* Display cities */}
              {cities.length > 0 && (
                <div className="p-1">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center space-x-3 transition-colors"
                    >
                      <Image
                        src="/icons/locationHoliday.png"
                        alt={city.name}
                        className="w-5 h-5 flex-shrink-0"
                        width={30}
                        height={30}
                      />
                      <div className="font-medium text-gray-800">
                        {city.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {isOpen && module === "Visa" && (
        <div className="absolute z-20 mt-1 w-[350px] max-h-72 overflow-y-auto bg-white rounded-md shadow-md border border-gray-200 animate-slide-up">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search airports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                autoFocus
              />
            </div>
          </div>
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Loading...
            </div>
          ) : airports.length > 0 ? (
            <div className="p-1">
              {airports.map((airport,index) => (
                <div key={index}>
                  <button
                    key={airport.code}
                    onClick={() => handleCitySelect(airport)}
                    className="w-full text-left px-1 py-1 text-sm hover:bg-gray-50 rounded-md flex items-start space-x-3 transition-colors"
                  >
                    <Plane
                      size={16}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <div className="font-medium text-gray-800">
                        {airport.municipality}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No airports found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const DropdownProvider = ({ children }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <DropdownContext.Provider value={{ openDropdown, setOpenDropdown }}>
      {children}
    </DropdownContext.Provider>
  );
};

export default LocationSelector;
