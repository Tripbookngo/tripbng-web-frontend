import { Time } from "@/constants/data/time";
import { Slider } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

const FilterModal = ({
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
  const [tempStops, setTempStops] = useState([...selectedStops]);
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
            <Image src="/icons/arrow.png" className="w-4 h-4" width={100} height={100} alt="Filter Modal"/>
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
        <div className="mt-4 px-6 py-2 overflow-y-auto max-h-[calc(100vh-150px)]">
        {activeFilter === "sortBy" && (
          <div className="mt-4 px-6 py-2">
            <p className="text-sm font-semibold">Stops</p>
            <span className="flex items-center justify-end">
              <button className="text-yellow font-medium" onClick={handleReset}>
                Reset All
              </button>
            </span>
            {/* Non-Stop Button */}
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm">Non-Stop</p>
              <button
                onClick={handleNonStop}
                className={`h-6 w-6 border rounded-full`}
                style={{
                  backgroundColor:
                    tempStops.length === 1 ? "#FFA500" : "transparent",
                }}
              ></button>
            </div>

            {/* 1-Stop Button */}
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm">1-Stop</p>
              <button
                onClick={handleOneStop}
                className={`h-6 w-6 border rounded-full`}
                style={{
                  backgroundColor:
                    tempStops.length === 2 ? "#FFA500" : "transparent",
                }}
              ></button>
            </div>
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
            <div className="mt-8">
              <p className="font-semibold">Flight price</p>
              <Slider
                aria-label="Small steps"
                step={1000}
                min={8000}
                max={50000}
                valueLabelDisplay="auto"
                value={selectedFilterPrice}
                onChange={handleChange}
                sx={{
                  color: "#FF8E00",
                  height: 8,
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
                    width: 20,
                    height: 20,
                    "&:hover": {
                      backgroundColor: "#ffffff",
                    },
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "#FF8E00",
                    height: 8,
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "#DCDCDC",
                    height: 8,
                  },
                  "& .MuiSlider-valueLabel": {
                    backgroundColor: "#1a68ab",
                    color: "white",
                  },
                }}
              />
            </div>

            <span className="flex items-center justify-between">
              <p>₹8000</p>
              <p>₹{selectedFilterPrice}</p>
            </span>
            <span className="flex items-center justify-between border-b-2 mt-3 border-dashed"></span>

            <div className="mt-3">
              <h3 className=" font-semibold">Departure Time</h3>

              <div className="mt-2 flex items-center gap-2">
                {Time.map((item, index) => (
                  <button 
                  key={index}
                    className={`border-2 rounded-xs w-16 h-24 p-1 flex flex-col items-center gap-2 rounded-lg ${
                        originTimeFilter == index ? "border-yellow" : ""
                      }`}
                    onClick={() => {
                      handleOriginTime(index);
                    }}
                  >
                    <Image src={item.image} className="w-8 h-8" width={16} height={16} alt="Filter Modal"/>
                    <span className="text-xs font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <span className="flex items-center justify-between border-b-2 mt-3 border-dashed"></span>

            <div className="mt-3">
              <h3 className=" font-semibold">Arrival Time</h3>

              <div className="mt-2 flex items-center gap-2">
                {Time.map((item, index) => (
                  <button
                  key={index}
                    className={`border-2 rounded-xs w-16 h-24 p-1 flex flex-col items-center gap-2 rounded-lg ${
                        destinationTimeFilter == index ? "border-yellow" : ""
                      }`}
                    onClick={() => {
                      handleDestinationTime(index);
                    }}
                  >
                    <Image src={item.image} className="w-8 h-8" width={16} height={16} alt="Filter Modal"/>
                    <span className="text-xs font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <span className="flex items-center justify-between border-b-2 mt-3 border-dashed"></span>

            <div className="mt-4">
            <p className="text-sm font-semibold">Airlines</p>
            <div className="flex items-center space-x-2 mt-2 gap-3">
              {/* Air India Checkbox */}
              <input
                type="checkbox"
                id="air-india"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                onChange={(e) => handleCheckboxChange(e, "AI")}
              />
              <label
                htmlFor="air-india"
                className="flex items-center space-x-2"
              >
                <Image src="/icons/airIndiaIcon.png" className="w-6 h-6" width={16} height={16} alt="Filter Modal" />
                <p className="text-gray-600 text-lg font-medium">Air India</p>
              </label>
            </div>

            <div className="flex items-center space-x-2 mt-2 gap-3">
              {/* IndiGo Checkbox */}
              <input
                type="checkbox"
                id="indigo"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                onChange={(e) => handleCheckboxChange(e, "6E")}
              />
              <label htmlFor="indigo" className="flex items-center space-x-2">
                <Image src="/icons/indiGoIcon.png" className="w-6 h-6" width={16} height={16} alt="Filter Modal" />
                <p className="text-gray-600 text-lg font-medium">IndiGo</p>
              </label>
            </div>

            <div className="flex items-center space-x-2 mt-2 gap-3">
              {/* SpiceJet Checkbox */}
              <input
                type="checkbox"
                id="spicejet"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                onChange={(e) => handleCheckboxChange(e, "SG")}
              />
              <label htmlFor="spicejet" className="flex items-center space-x-2">
                <Image src="/icons/SG.png" className="w-6 h-6 rounded-full" width={16} height={16} alt="Filter Modal"/>
                <p className="text-gray-600 text-lg font-medium">SpiceJet</p>
              </label>
            </div>
          </div>
            
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

export default FilterModal;
