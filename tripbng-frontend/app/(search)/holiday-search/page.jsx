"use client";

import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import Button from "@/components/ui/button";
import { FaBus, FaHotel, FaMoon, FaPlane, FaUtensils } from "react-icons/fa";

export default function HolidayDetails() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sliderValue, setSliderValue] = useState(25000);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleSliderChange = (event, newValue) => setSliderValue(newValue);
  const handleFilterChange = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category] === value ? null : value,
    }));
  };

  const packages = [
    {
      title: "Beaches of Andaman",
      price: 13000,
      image: "/holiday/beach.jpg",
      nights: "2N Port Blair | 1N Havelock Island",
      facilities: ["3-Star Hotel", "Breakfast", "Flights", "Local Transport"],
    },
    {
      title: "Island of Andaman",
      price: 16800,
      image: "/holiday/island.jpg",
      nights: "2N Port Blair | 2N Havelock Island",
      facilities: [
        "4-Star Hotel",
        "Breakfast & Dinner",
        "Airport Pickup",
        "Local Sightseeing",
      ],
    },
    {
      title: "Best of Andaman",
      price: 19500,
      image: "/holiday/best.jpg",
      nights: "3N Port Blair | 2N Havelock Island",
      facilities: [
        "Luxury Resort",
        "All Meals",
        "Private Cab",
        "Beach Activities",
      ],
    },
    {
      title: "Andaman Adventure",
      price: 22000,
      image: "/holiday/beach.jpg",
      nights: "3N Port Blair | 2N Havelock | 1N Neil Island",
      facilities: [
        "Adventure Sports",
        "Scuba Diving",
        "Speed Boat Ride",
        "Trekking",
      ],
    },
    {
      title: "Romantic Getaway",
      price: 25000,
      image: "/holiday/island.jpg",
      nights: "2N Port Blair | 3N Havelock Island",
      facilities: [
        "Candlelight Dinner",
        "Luxury Cruise",
        "Couple Spa",
        "Private Beach Villa",
      ],
    },
    {
      title: "Luxury Andaman",
      price: 32000,
      image: "/holiday/best.jpg",
      nights: "3N Port Blair | 3N Havelock Island | 2N Neil Island",
      facilities: [
        "5-Star Resort",
        "All Inclusive",
        "Private Yacht",
        "Helicopter Tour",
      ],
    },
  ];

  function getFacilityIcon(facility) {
    switch (facility) {
      case "3-Star Hotel":
      case "4-Star Hotel":
      case "Luxury Resort":
      case "5-Star Resort":
        return <FaHotel className="inline text-blue-500" />;
      case "Breakfast":
      case "All Meals":
      case "Breakfast & Dinner":
        return <FaUtensils className="inline text-green-500" />;
      case "Flights":
      case "Helicopter Tour":
        return <FaPlane className="inline text-red-500" />;
      case "Local Transport":
      case "Private Cab":
      case "Airport Pickup":
        return <FaBus className="inline text-purple-500" />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white shadow-sm py-6 px-4 sm:px-10 md:px-20 lg:px-60 overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-3 p-2 bg-white rounded-xl">
          <div className="border py-2 px-4 rounded-l-xl sm:rounded-l-xl flex flex-col gap-0.5 bg-gray/10">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={12} /> From
            </p>
            <p className="text-base font-semibold text-gray-900">Mumbai</p>
          </div>

          <div className="border py-2 px-4 flex flex-col gap-0.5 bg-gray/10">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={12} /> To
            </p>
            <p className="text-base font-semibold text-gray-900">Ahmedabad</p>
          </div>

          <div className="border py-2 px-4 flex flex-col gap-0.5 bg-gray/10">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={12} /> Departure
            </p>
            <p className="text-base font-semibold text-gray-900">22 Dec 2002</p>
          </div>

          <div className="border py-2 px-4 flex flex-col gap-0.5 bg-gray/10">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={12} /> Return
            </p>
            <p className="text-base font-semibold text-gray-900">---</p>
          </div>

          <div className="border p-2 flex flex-col gap-0.5 bg-gray/10">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Users size={12} /> Travellers & Class
            </p>
            <p className="text-base font-semibold text-gray-900">---</p>
          </div>

          <Button
            className="border py-2 px-4 rounded-r-xl rounded-l-none sm:rounded-r-xl flex items-center justify-center gap-4 bg-yellow text-white text-xl font-semibold hover:bg-gray-200"
            onClick={() => router.back()}
          >
            <ArrowLeft size={25} />
            <p>Modify</p>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="container flex flex-col lg:flex-row gap-6 p-6">
          {/* Filter Section */}
          <div className="w-full lg:w-1/4 bg-white shadow-lg rounded-xl p-6 border border-gray-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Sort & Filter
            </h2>

            <div className="space-y-6">
              {/* Sort By */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Sort By
                </h3>
                <div className="flex flex-col space-y-2">
                  {["Popular", "Price Low to High", "Price High to Low"].map(
                    (label, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input type="checkbox" className="accent-yellow" />
                        <span className="text-gray-600">{label}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Price Range
                </h3>
                <Slider
                  value={sliderValue}
                  onChange={handleSliderChange}
                  min={8000}
                  max={50000}
                  step={1000}
                  sx={{ color: "#FF8E00" }}
                />
                <div className="text-gray-600 mt-2 text-sm flex justify-between">
                  <span>INR 8,000</span>
                  <span>INR 50,000</span>
                </div>
              </div>

              {/* Destination Type */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Destination Type
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Beach",
                    "Mountains",
                    "Adventure",
                    "Cultural",
                    "Family-Friendly",
                  ].map((type) => (
                    <button
                      key={type}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        selectedFilters["Destination"] === type
                          ? "bg-yellow text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-orange-100 border"
                      }`}
                      onClick={() => handleFilterChange("Destination", type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Duration
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["1-3 Nights", "4-6 Nights", "7+ Nights"].map((duration) => (
                    <button
                      key={duration}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        selectedFilters["Duration"] === duration
                          ? "bg-yellow text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-yellow border"
                      }`}
                      onClick={() => handleFilterChange("Duration", duration)}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Inclusions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Travel Inclusions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Flights Included",
                    "Meals Included",
                    "Sightseeing",
                    "Transfers Included",
                  ].map((inclusion) => (
                    <button
                      key={inclusion}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        selectedFilters["Inclusions"] === inclusion
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-orange-100 border"
                      }`}
                      onClick={() =>
                        handleFilterChange("Inclusions", inclusion)
                      }
                    >
                      {inclusion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Packages Section */}
          <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl"
              >
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-56"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {pkg.title}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FaMoon className="text-blue-500" /> {pkg.nights}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pkg.facilities.map((facility, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full"
                      >
                        {getFacilityIcon(facility)} {facility}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-100 p-2 flex justify-between items-center border mx-4 mb-4 rounded-xl bg-gray/10 ">
                  <p className="text-sm text-gray ">Limitied Time Offer</p>
                  <span className="flex items-baseline">
                    <p className="text-lg font-semibold text-black">
                      ₹{pkg.price}
                    </p>
                    <p className="text-sm font-light text-black">/Person</p>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
