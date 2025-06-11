// HotelLocationSelector.js
import React, { useState, useRef, useEffect } from "react";
import { MapPin, Search, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";

const HotelLocationSelector = ({
  label,
  placeholder,
  value,
  onChange,
  className,
  isOpen,
  onClose,  
}) => {
 
  const [searchTerm, setSearchTerm] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && searchTerm) {
      fetchLocations(searchTerm);
    }
  }, [searchTerm, isOpen]);


  

  useEffect(() => {
    if (isOpen) {
      fetchLocations(searchTerm);
    }
  }, [searchTerm, isOpen]);

  const fetchLocations = async (term = "") => {
    try {
      setLoading(true);
      const url = term
        ? `https://autosuggest.travel.zentrumhub.com/api/locations/locationcontent/autosuggest?term=${term}`
        : `https://autosuggest.travel.zentrumhub.com/api/locations/locationcontent/autosuggest`;
      
      const response = await axios.get(url);
      
      if (response.status === 200) {
        setLocations(response.data?.locationSuggestions || []);
      } else {
        console.log("Failed to fetch locations:", response.status);
        setLocations([]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    onChange(location);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange(null);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="text-sm font-medium text-neutral-600 mb-1 block">
        {label}
      </label>
     

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
                placeholder="Search cities, landmarks..."
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
          ) : locations.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {location.type === "city" ? (
                      <Image
                        src="/hotels/bed.png"
                        alt="City"
                        width={25}
                        height={25}
                      />
                    ) : (
                      <Image
                        src="/hotels/bed.png"
                        alt="Landmark"
                        width={25}
                        height={25}
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">
                      {location.fullName}
                    </div>
                    {location.country && (
                      <div className="text-xs text-gray-500">
                        {location.city? `${location.city},` : ""} {location.state? `${location.state},` : ""} {location.country}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No locations found
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              Start typing to search for locations
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelLocationSelector;