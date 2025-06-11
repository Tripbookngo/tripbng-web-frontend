"use client";
import Button from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dates } from "@/constants/data/date";
import { PRICE_RANGE, ROOMS_GUEST } from "@/constants/data/hotel-data";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { apiPost } from "@/lib/apiServiceHotel";
import Cookies from "js-cookie";
import HotelLocationSelector from "@/components/hotel/HotelLocationSelector";
import PaxDropdown from "@/components/hotel/PaxDropdown";

const { RangePicker } = DatePicker;

export default function Hotel() {
  const router = useRouter();
  // const [checkInDate, setCheckInDate] = useState(dates[0]?.day);
  // const [checkOutDate, setCheckOutDate] = useState(dates[1]?.day);
  // const [roomAndGuests, setRoomAndGuests] = useState(ROOMS_GUEST[0]?.name);
  // const [priceRange, setPriceRange] = useState(PRICE_RANGE[0]?.name);
  // const [selectedCity, setSelectedCity] = useState("Select a city");
  const [isOpen, setIsOpen] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([
    { adults: 1, children: 0, childAges: [] },
  ]);
  const [openPax, setOpenPax] = useState(false);
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(dayjs().format("YYYY-MM-DD"));
  const [checkOut, setCheckOut] = useState(
    dayjs().add(1, "day").format("YYYY-MM-DD")
  );

  console.log(selectedLocation);

  // Select pax details
  const toggleDropdownPax = () => setOpen(!open);

  const handleAddRoom = () => {
    setRooms([...rooms, { adults: 1, children: 0, childAges: [] }]);
  };

  const handleRemoveRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
  };
  const handleAdultChange = (index, value) => {
    const updatedRooms = [...rooms];
    const newValue = Math.min(8, Math.max(1, value)); // Maximum 8 adults
    updatedRooms[index].adults = newValue;
    setRooms(updatedRooms);
  };

  const handleChildrenChange = (index, value) => {
    const updatedRooms = [...rooms];
    const newValue = Math.min(4, Math.max(0, value)); // Maximum 4 children
    updatedRooms[index].children = newValue;
    updatedRooms[index].childAges = updatedRooms[index].childAges.slice(
      0,
      newValue
    );
    while (updatedRooms[index].childAges.length < newValue) {
      updatedRooms[index].childAges.push("1");
    }
    setRooms(updatedRooms);
  };

  const handleChildAgeChange = (roomIndex, ageIndex, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].childAges[ageIndex] = value;
    setRooms(updatedRooms);
  };

  const handleDone = () => {
    console.log("Selected Rooms:", rooms);
    setOpen(false);
  };

  const dropdownRef = useRef(null);

  const selectLocation = (location) => {
    setSelectedLocation(location);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsOpen(false);
  };

  const handleRedirect = async () => {
    setLoading(true);
    if (!selectedLocation) {
      toast.error("Please select a location first.");
      setLoading(false);
      return;
    }

    const correlationId = uuidv4();
    localStorage.setItem("correlationId", correlationId);

    const cityData = {
      name: selectedLocation.name,
      fullName: selectedLocation.fullName,
      country: selectedLocation.country,
      coordinates: selectedLocation.coordinates,
      id: selectedLocation.id,
    };
    localStorage.setItem("selectedLocation", JSON.stringify(cityData));
    localStorage.setItem("selected_city", selectedLocation.name);

    const payload = {
      channelId: "tripbng-ratehawklive-channel",
      currency: "INR",
      culture: "en-IN",
      checkIn,
      checkOut,
      occupancies: rooms.map((room) => ({
        numOfAdults: room.adults,
        childAges: room.childAges.map(Number),
      })),
      circularRegion: {
        centerLat: selectedLocation.coordinates.lat,
        centerLong: selectedLocation.coordinates.long,
        radiusInKm: 30,
      },
      searchLocationDetails: {
        id: selectedLocation.id,
        name: "{{locationName}}",
        fullName: "{{locationFullName}}",
        type: "{{locationType}}",
        state: "{{locationState}}",
        country: "{{locationCountry}}",
        coordinates: selectedLocation.coordinates,
      },
      nationality: "IN",
      countryOfResidence: "IN",
      destinationCountryCode: "IN",
      travelPurpose: "Leisure",
      filterBy: null,
    };

    try {
      const response = await apiPost("hotel/availability/init", payload);

      if (response.status === 202) {
        const token = response.data.token;
        localStorage.setItem("tokenHotel", token);
        localStorage.setItem("checkIn", checkIn);
        localStorage.setItem("checkOut", checkOut);
        localStorage.setItem("roomLength", rooms.length);
        localStorage.setItem("roomPax", JSON.stringify(rooms));

        const searchUrl = `/hotel-search/${token}?${selectedLocation.name}/${checkIn}/${checkOut}/${rooms.length}`;
        router.push(searchUrl);
      } else {
        console.log("Failed to fetch availability:", response.status);
      }
    } catch (error) {
      console.error("Error during hotel availability search:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl relative">
      <div className="rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="border px-2 pt-2 md:p-6 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none hover:bg-yellow/10 transition-all duration-300">
          <p className="md:text-xs text-xs text-neutral-400 font-semibold">
            City, Property name or Location
          </p>
          <div className="relative w-full bg-transparent" ref={dropdownRef}>
            <button
              className="w-full py-2 rounded-lg md:text-2xl text-xl text-left font-semibold"
              onClick={() => setIsOpen(!isOpen)}
            >
              {selectedLocation?.name || "Select a city"}
            </button>
            {isOpen && (
              <div className="absolute top-full left-0 w-full mt-1 z-50">
                <HotelLocationSelector
                  isOpen={isOpen} 
                  onClose={() => setIsOpen(false)} 
                  placeholder="Search for a city or hotel"
                  value={selectedLocation}
                  onChange={(location) => {
                    handleLocationSelect(location);
                    setIsOpen(false); 
                  }}
                  className="shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="border px-2 pt-2 md:p-6 hover:bg-yellow-100/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs font-semibold text-neutral-400">
            Check-In & Check-Out
          </p>
          <RangePicker
            format="DD MMM YYYY"
            defaultValue={[dayjs(), dayjs().add(1, "day")]}
            onChange={(dates) => {
              if (dates) {
                setCheckIn(dates[0].format("YYYY-MM-DD"));
                setCheckOut(dates[1].format("YYYY-MM-DD"));
              }
            }}
            className="w-full border-none rounded-lg text-xl md:text-2xl font-semibold custom-range-picker "
          />
        </div>

        <div className="relative border px-2 pt-2 md:p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer rounded-b-xl sm:rounded-r-xl sm:rounded-bl-none">
          <div onClick={() => setOpenPax(!openPax)}>
            <p className="text-xs font-semibold text-neutral-400">
              Rooms & Guests
            </p>
            <div className="flex items-center py-2">
              <p className="text-xl md:text-2xl font-semibold">
                {rooms.reduce(
                  (acc, room) => acc + room.adults + room.children,
                  0
                )}{" "}
                Guests, {rooms.length} Room(s)
              </p>
              <ChevronDown className="ml-2 w-4 h-4" />
            </div>
          </div>

          {openPax && (
            <PaxDropdown
              rooms={rooms}
              setRooms={setRooms}
              open={openPax}
              setOpen={setOpenPax}
            />
          )}
        </div>
      </div>

      <Button
        onClick={handleRedirect}
        disabled={loading}
        size="md"
        className="flex justify-center w-3/4 md:w-auto items-center bg-yellow text-white text-xl font-semibold py-2 px-14 rounded-full hover:bg-yellow-600 transition-colors duration-300 
                    md:absolute md:-bottom-4 md:left-1/2 md:transform md:-translate-x-1/2 
                    mx-auto md:mx-0 md:block mb-3 md:mb-0"
               >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          "SEARCH"
        )}
      </Button>
    </div>
  );
}
