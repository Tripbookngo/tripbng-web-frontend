import { priceRanges } from "@/constants/data/priceRange";
import { propertyType } from "@/constants/data/propertyType";
import { ratingStar } from "@/constants/data/ratingStar";
import { Time } from "@/constants/data/time";
import { Slider } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

const FilterModalHotel = ({
  isOpen,
  onClose,
  selectedStops,
  setSelectedStops,
  selectedPrice,
  setSelectedPrice,
  setOriginTime,
  setDestinationTime,
  setSelectedAirlines
}) => {
  const [activeFilter, setActiveFilter] = useState("sortBy");
  const [selectedFilterPrice, setSelectedFilterPrice] = useState(30000);
  const [originTimeFilter, setOriginTimeFilter] = useState(null);
  const [destinationTimeFilter, setDestinationTimeFilter] = useState(null);
const [selectedAirlinesFilter, setSelectedAirlinesFilter] = useState([
    { Airline_Code: "" },
  ]);
  const handleNonStop = () => {
    setTempStops([0]);
  };

  const handleOneStop = () => {
    setTempStops([0, 1]);
  };

  const handleReset = () => {
    setTempStops([0, 1, 2, 3]);
  };

  const handleApply = () => {
    setSelectedStops(tempStops);
    onClose();
  };
  const handleChange = (event, newValue) => {
    setSelectedFilterPrice(newValue);
  };
  const handleApplyFilters = () => {
    setSelectedPrice(selectedFilterPrice);
    setOriginTime(originTimeFilter)
    setDestinationTime(destinationTimeFilter)
    setSelectedAirlines(selectedAirlinesFilter)
    onClose();
  };

  const handleOriginTime = (index) => {
    if (originTimeFilter === index) {
      setOriginTimeFilter(null);
    } else {
      setOriginTimeFilter(index);
    }
  };
  const handleDestinationTime = (index) => {
    if (destinationTimeFilter === index) {
      setDestinationTimeFilter(null);
    } else {
      setDestinationTimeFilter(index);
    }
  };

  const handleCheckboxChange = (event, airlineCode) => {
    if (event.target.checked) {
      setSelectedAirlinesFilter([...selectedAirlinesFilter, { Airline_Code: airlineCode }]);
    } else {
      setSelectedAirlinesFilter(
        selectedAirlinesFilter.filter(
          (airline) => airline.Airline_Code !== airlineCode
        )
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full lg:w-3/4 lg:h-auto shadow-lg overflow-auto">
        <span className="flex items-center gap-3 bg-yellow px-6 py-3">
          <button onClick={onClose} className="">
            <Image src="/icons/arrow.png" className="w-4 h-4" width={100} height={100}  alt="Filter Modal"/>
          </button>
          <h3 className="text-white text-lg font-semibold">Filter</h3>
        </span>
        <div className="flex items-center w-full border-b border-gray-100 ">
          <button
            className={`w-1/2 text-gray-500 font-semibold ${
              activeFilter === "sortBy"
                ? "border-yellow border-b-2 text-yellow"
                : ""
            } p-3`}
            onClick={() => setActiveFilter("sortBy")}
          >
            Sort By
          </button>
          <button
            className={`w-1/2 text-gray-500 font-semibold ${
              activeFilter === "filters"
                ? "border-yellow border-b-2 text-yellow"
                : ""
            } p-3`}
            onClick={() => setActiveFilter("filters")}
          >
            Filters
          </button>
        </div>
        <div className="mt-2 px-2 py-1 overflow-y-auto max-h-[calc(100vh-150px)]">
        {activeFilter === "sortBy" && (
          <div className="mt-2 px-2 py-1">
            <span className="mt-3">
              <span className="flex items-center px-2 py-1">
                <input
                  type="radio"
                  name="sort-options"
                  id="low-to-high"
                  className="form-radio h-4 w-4 text-yellow"
                />
                <label
                  htmlFor="low-to-high"
                  className="ml-2 text-sm font-medium"
                >
                  Price (Low to High)
                </label>
              </span>
              <span className="flex items-center px-2 py-1">
                <input
                  type="radio"
                  name="sort-options"
                  id="high-to-low"
                  className="form-radio h-4 w-4 text-yellow"
                />
                <label
                  htmlFor="high-to-low"
                  className="ml-2 text-sm font-medium"
                >
                  Price (High to Low)
                </label>
              </span>
              <span className="flex items-center px-2 py-1">
                <input
                  type="radio"
                  name="sort-options"
                  id="star-1-to-5"
                  className="form-radio h-4 w-4 text-yellow"
                />
                <label
                  htmlFor="star-1-to-5"
                  className="ml-2 text-sm font-medium"
                >
                  Star 1 to 5
                </label>
              </span>
              <span className="flex items-center px-2 py-1">
                <input
                  type="radio"
                  name="sort-options"
                  id="star-5-to-1"
                  className="form-radio h-4 w-4 text-yellow"
                />
                <label
                  htmlFor="star-5-to-1"
                  className="ml-2 text-sm font-medium"
                >
                  Star 5 to 1
                </label>
              </span>
            </span>
            {/* Apply Button */}
            <div className="flex justify-end py-4">
              <button
                className="bg-yellow w-full text-white font-semibold px-4 py-2 rounded-lg"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        )}
        {activeFilter === "filters" && (
          <div className="px-6">
            <span className="p-2">
                          <h3 className="text-sm font-medium mb-2">Price Range</h3>
                          {priceRanges.map((range) => (
                            <div
                              className="flex items-center justify-between space-x-2 mb-3"
                              key={range.id}
                            >
                              <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={range.id}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor={range.id} className="text-sm text-gray-700">
                                {range.label}
                              </label>
                              </div>
                              <span className="text-gray-500 text-sm">({range.count})</span>
                            </div>
                          ))}
                        </span>
            <span className="flex items-center justify-between border-b-2 mt-3 border-dashed"></span>

            <span className="p-2">
                          <h3 className="text-sm font-medium mb-2">Star Category</h3>
                          {ratingStar.map((range) => (
                            <div
                              className="flex items-center space-x-2 mb-3"
                              key={range.id}
                            >
                              <input
                                type="checkbox"
                                id={range.id}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label
                                htmlFor={range.id}
                                className="text-sm text-gray-700 flex items-center gap-1"
                              >
                                {Array.from({ length: range.count }, (_, index) => (
                                  <Image
                                    key={index}
                                    src="/icons/starFilter.png"
                                    width={100}
                                    height={100}
                                    alt={`${range.count} stars`}
                                    className="w-4 h-4"
                                  />
                                ))}
                              </label>
                            </div>
                          ))}
                        </span>
            <span className="flex items-center justify-between border-b-2 mt-3 border-dashed"></span>

            <span className="p-2">
                          <h3 className="text-sm font-medium mb-2">Property Type</h3>
                          {propertyType.map((range) => (
                            <div
                              className="flex items-center space-x-2 mb-1"
                              key={range.id}
                            >
                              <input
                                type="checkbox"
                                id={range.id}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor={range.id} className="text-sm text-gray-700">
                                {range.label}
                              </label>
                            </div>
                          ))}
                        </span>

            <div className="flex justify-end py-4">
              <button
                className="bg-yellow w-full text-white font-semibold px-4 py-2 rounded-lg"
                onClick={handleApplyFilters}
              >
                Apply
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default FilterModalHotel;
