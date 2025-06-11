"use client";

import Button from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import BusLocationSelector from "@/components/bus/BusLocationSelector";

export default function Bus() {
  const router = useRouter();
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);

  const [cities, setCities] = useState([]);
  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://api.tripbng.com/bus/getcitylist"
        );
        if (response.data.data.success) {
          const cityData = response.data.data.data.CityDetails || [];
          setCities(cityData);

          // Set default cities
          const defaultFromCity = cityData.find((city) =>
            city.CityName.toLowerCase().includes("ahmedabad")
          );
          const defaultToCity = cityData.find((city) =>
            city.CityName.toLowerCase().includes("mumbai")
          );
          if (defaultFromCity) setFromCity(defaultFromCity);
          if (defaultToCity) setToCity(defaultToCity);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFromOpen && fromDropdownRef.current && !fromDropdownRef.current.contains(event.target)) {
        setIsFromOpen(false);
      }
      if (isToOpen && toDropdownRef.current && !toDropdownRef.current.contains(event.target)) {
        setIsToOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFromOpen, isToOpen]);

  const handleSearchClick = () => {
    if (!fromCity || !toCity || !selectedDate) {
      alert("Please select valid cities and date!");
      return;
    }
    if (fromCity.CityID === toCity.CityID) {
      alert("From and To cities cannot be the same!");
      return;
    }
    const formattedDate = format(selectedDate, "dd-MM-yyyy");
    const searchUrl = `/bus-search/${fromCity.CityName}/${toCity.CityName}/${formattedDate}?from_code=${fromCity.CityID}&to_code=${toCity.CityID}`;
    router.push(searchUrl);
  };

  const day = format(selectedDate, "d");
  const month = format(selectedDate, "MMM");
  const year = format(selectedDate, "yy");
  const weekday = format(selectedDate, "EEEE");

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl w-full relative">
      <div className="rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* From City */}
        <div className="border px-2 pt-2 md:p-6 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none hover:bg-yellow/10 transition-all duration-300">
          <p className="md:text-xs text-xs text-neutral-400 font-semibold">From City</p>
          <div className="relative w-full bg-transparent" ref={fromDropdownRef}>
            <button
              className="w-full py-2 rounded-lg md:text-2xl text-xl text-left font-semibold"
              onClick={() => {
                setIsFromOpen(!isFromOpen);
                setIsToOpen(false);
              }}
            >
              {fromCity?.CityName || "Select a city"}
            </button>
            {isFromOpen && (
              <div className="absolute top-full left-0 w-full mt-1 z-50">
                <BusLocationSelector
                  isOpen={isFromOpen}
                  onClose={() => setIsFromOpen(false)}
                  placeholder="Search for a city"
                  value={fromCity}
                  onChange={(city) => {
                    setFromCity(city);
                    setIsFromOpen(false);
                  }}
                  options={cities}
                  className="shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* To City */}
        <div className="border px-2 pt-2 md:p-6 hover:bg-yellow/10 transition-all duration-300">
          <p className="md:text-xs text-xs text-neutral-400 font-semibold">To City</p>
          <div className="relative w-full bg-transparent" ref={toDropdownRef}>
            <button
              className="w-full py-2 rounded-lg md:text-2xl text-xl text-left font-semibold"
              onClick={() => {
                setIsToOpen(!isToOpen);
                setIsFromOpen(false);
              }}
            >
              {toCity?.CityName || "Select a city"}
            </button>
            {isToOpen && (
              <div className="absolute top-full left-0 w-full mt-1 z-50">
                <BusLocationSelector
                  isOpen={isToOpen}
                  onClose={() => setIsToOpen(false)}
                  placeholder="Search for a city"
                  value={toCity}
                  onChange={(city) => {
                    setToCity(city);
                    setIsToOpen(false);
                  }}
                  options={cities}
                  className="shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Date Picker */}
        <div className="border px-2 pt-2 md:p-6 rounded-t-xl sm:rounded-r-xl sm:rounded-tl-none hover:bg-yellow/10 transition-all duration-300">
          <p className="text-[11px] sm:text-sm text-neutral-400 mb-1">Travel Date</p>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base sm:text-2xl font-bold">{day}</span>
                <span className="text-sm sm:text-xl font-semibold"> {month}'{year}</span>
                <p className="text-xs sm:text-lg text-gray-700">{weekday}</p>
              </div>
              <DatePicker
                value={dayjs(selectedDate)}
                onChange={(date) => setSelectedDate(date ? date.toDate() : new Date())}
                format="DD/MM/YYYY"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                allowClear={false}
                suffixIcon={null}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
                className="absolute opacity-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearchClick}
        className="w-[230px] sm:w-[250px] absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow text-white text-sm sm:text-base font-semibold py-2 px-6 rounded-full hover:bg-yellow-600 transition-colors duration-300"
      >
        Search Buses
      </Button>
    </div>
  );
}
