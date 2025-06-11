"use client";

import Simmer from "@/components/layout/simmer";
import RoundedLoader from "@/components/RoundedLoader";
import Button from "@/components/ui/button";
import { cities } from "@/constants/data/cities";
import { pickUpTime } from "@/constants/data/pickUpTime";
import { travelOperators } from "@/constants/data/travelOperators";
import { apiService } from "@/lib/api";
import { ArrowLeft, Ban, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronDown } from "react-icons/fa";

export default function BusDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const cleanPathname = pathname.split("?")[0];
  const pathSegments = cleanPathname.split("/").filter(Boolean);

  const fromCityName = pathSegments[1] || "Unknown";
  const toCityName = pathSegments[2] || "Unknown";
  const travelDate = pathSegments[3] || "Date not provided";

  const fromCityId = searchParams.get("from_code") || "Not found";
  const toCityId = searchParams.get("to_code") || "Not found";

  const convertDateFormat = (date) => {
    if (!date || date === "Date not provided") return null;

    const parts = date.split("-");
    if (parts.length !== 3) return null;

    const [day, month, year] = parts;
    return `${month}/${day}/${year}`;
  };
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [expandedSection, setExpandedSection] = useState({
    pickUpPoint: true,
    pickUpTime: true,
    travelOperators: true,
  });
  const [acType, setACType] = useState([]);
  const [seatType, setSeatType] = useState([]);
  const [pickTime, setPickTime] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showAllTravelOperators, setShowAllTravelOperators] = useState(false);
  const [visibleSection, setVisibleSection] = useState({});
  const [busList, setBusList] = useState([]);
  const [seatMap, setSeatMap] = useState({});
  const [selectedSeats, setSelectedSeats] = useState({});
  const [selectedPickup, setSelectedPickup] = useState({});
  const [selectedDrop, setSelectedDrop] = useState({});
  const [searchKey, setSearchKey] = useState(null);
  const [busSeatMap, setBusSeatMap] = useState({});
  const [busPickup, setBusPickup] = useState([]);
  const [busDrop, setBusDrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaderBusList, setLoaderBusList] = useState(false);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState([]);
  const [seatMapKey, setSeatMapKey] = useState(null);


  const handleCheckout = (bus) => {
    const keys = Object.keys(selectedSeatNumbers);
    const lastKey = keys[keys.length - 1];
    const lastSeatNumbers = selectedSeatNumbers[lastKey];
    
    localStorage.setItem('selectedBus', JSON.stringify({
      bus,
      seatMap,
      searchKey,
      seatMapKey,
      pickup: selectedPickup,
      drop: selectedDrop,
      selectedSeats: lastSeatNumbers
    }));

    const seatNumbersParam = lastSeatNumbers.join(",");
    const pickupId = selectedPickup.pickup?.Boarding_Id || "";
    const dropId = selectedDrop.drop?.Dropping_Id || "";

    const searchUrl = `${pathname}/checkout?seats=${seatNumbersParam}&pickup=${pickupId}&drop=${dropId}`;

    router.push(searchUrl);
  };

  // Group seats by row
  const groupedSeats = Array.isArray(busSeatMap)
    ? busSeatMap.reduce((acc, seat) => {
        const row = parseInt(seat.Row, 10);
        if (!acc[row]) acc[row] = [];
        acc[row].push(seat);
        return acc;
      }, {})
    : {};

  // Sort rows numerically
  const sortedRows = Object.keys(groupedSeats)
    .map(Number)
    .sort((a, b) => a - b);

  const handleSeatSelect = (busKey, seat) => {
    setSelectedSeatNumbers((prev) => {
      const currentSelection = prev[busKey] || [];

      const updatedSelection = currentSelection.includes(seat.Seat_Number)
        ? currentSelection.filter((num) => num !== seat.Seat_Number) // Remove
        : [...currentSelection, seat.Seat_Number]; // Add

      return { ...prev, [busKey]: updatedSelection };
    });
  };

  // UI for displaying selected seats per bus
  {
    Object.entries(selectedSeatNumbers).map(([busKey, seats]) => (
      <div
        key={busKey}
        className="mt-4 p-2 bg-white border rounded text-center"
      >
        <h3 className="font-bold">Selected Seats for Bus {busKey}:</h3>
        <p>Numbers: {seats.join(", ") || "None"}</p>
      </div>
    ));
  }

  useEffect(() => {
    getBusList();
  }, []);

  const getBusList = async () => {
    setLoaderBusList(true);
    try {
      const formattedTravelDate = convertDateFormat(travelDate);

      const response = await apiService.post("/bus/searchbus", {
        From_City: fromCityId,
        To_City: toCityId,
        TravelDate: formattedTravelDate,
      });

      if (response?.data?.success) {
        setBusList(response?.data?.data?.Buses);
        setSearchKey(response?.data?.data?.Search_Key);
      } else {
        toast.error("Failed to fetch buses");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoaderBusList(false);
    }
  };

  const handleSeatMap = async (busKey) => {
    setSeatMap((prev) => {
      const newState = { [busKey]: !prev[busKey] };
      return newState;
    });

    setLoading(true);
    try {
      const response = await apiService.post("/bus/seatmap", {
        Boarding_Id: "27176",
        Dropping_Id: "24515",
        Bus_Key: busKey,
        Search_Key: searchKey,
      });

      if (response?.data?.success) {
        toast.success("Bus seat map fetched successfully!");
        // setBusSeatMap((prev) => ({
        //   ...prev,
        //   [busKey]: processSeatMap(response?.data?.data?.SeatMap),
        // }));
        setBusSeatMap(response?.data?.data?.SeatMap);
        setBusPickup(response?.data?.data?.BoardingDetails);
        setBusDrop(response?.data?.data?.DroppingDetails);
        setSeatMapKey(response?.data?.data?.SeatMap_Key)
      } else {
        toast.error("Failed to fetch bus seat map");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // const processSeatMap = (seats) => {
  //   let maxRow = 0;
  //   let maxCol = 0;

  //   seats.forEach(({ Row, Column }) => {
  //     maxRow = Math.max(maxRow, parseInt(Row));
  //     maxCol = Math.max(maxCol, parseInt(Column));
  //   });

  //   const seatGrid = Array.from({ length: maxRow + 1 }, () =>
  //     Array(maxCol + 1).fill("X")
  //   );

  //   seats.forEach(({ Row, Column, Seat_Number }) => {
  //     const rowIndex = parseInt(Row);
  //     const colIndex = parseInt(Column);

  //     if (seatGrid[rowIndex][colIndex] === "X") {
  //       seatGrid[rowIndex][colIndex] = Seat_Number;
  //     } else {
  //       console.warn(
  //         `Duplicate seat detected at Row: ${rowIndex}, Col: ${colIndex}`
  //       );
  //     }
  //   });

  //   seatGrid.forEach((row) => row.reverse());

  //   return seatGrid;
  // };

  const handleSeatSelection = (busKey, seat) => {
    setSelectedSeats((prev) => {
      const selectedForBus = prev[busKey] || [];
      if (selectedForBus.includes(seat)) {
        return { ...prev, [busKey]: selectedForBus.filter((s) => s !== seat) };
      } else {
        return { ...prev, [busKey]: [...selectedForBus, seat] };
      }
    });
  };

  const handlePickupSelection = (busKey, location) => {
    setSelectedPickup((prev) => ({
      ...prev,
      [busKey]: location,
    }));
  };

  const handleDropSelection = (busKey, location) => {
    setSelectedDrop((prev) => ({
      ...prev,
      [busKey]: location,
    }));
  };

  const busSeats = [
    [1, 2, "X", 3, 4],
    [5, 6, "X", 7, 8],
    [9, 10, "X", 11, 12],
    [13, 14, "X", 15, 16],
  ];
  const staticPickupLocations = [
    "Main Bus Stand",
    "City Center",
    "Railway Station",
    "Airport",
  ];

  const staticDropLocations = [
    "Central Market",
    "University Gate",
    "IT Park",
    "Suburb Terminal",
  ];
  const toggleSection = (section) => {
    setExpandedSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCityChange = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const handleACType = (value) => {
    setACType((prevState) => {
      if (prevState.includes(value)) {
        return prevState.filter((item) => item !== value);
      } else {
        return [...prevState, value];
      }
    });
  };

  const handleSeatType = (value) => {
    setSeatType((prevState) => {
      if (prevState.includes(value)) {
        return prevState.filter((item) => item !== value);
      } else {
        return [...prevState, value];
      }
    });
  };

  const handleTime = (value) => {
    setPickTime((prevState) => {
      if (prevState.includes(value)) {
        return prevState.filter((item) => item !== value);
      } else {
        return [...prevState, value];
      }
    });
  };
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (!travelDate) return;

    const [day, month, year] = travelDate.split("-");
    const formattedTravelDate = `${year}-${month}-${day}`;

    const dateObject = new Date(formattedTravelDate);
    if (isNaN(dateObject.getTime())) return;

    setFormattedDate(
      new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }).format(dateObject)
    );
  }, [travelDate]);

  const displayedCities = showAllCities ? cities : cities.slice(0, 5);
  const displayedTravelOperators = showAllTravelOperators
    ? travelOperators
    : travelOperators.slice(0, 5);

  return (
    // <div className="px-32 py-10">
    <div className="container flex flex-col  justify-center p-2 mt-28">
      {/* Filter Modal for Mobile */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full h-full p-4 overflow-y-auto shadow-lg">
            <div className="w-full bg-yellow p-4 flex justify-start items-center">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex items-center gap-2"
              >
                <Image
                  src="/icons/arrow.png"
                  alt="Back"
                  width={24}
                  height={24}
                  classNam
                  e="w-6 h-6"
                />
                <span className="text-lg text-white font-semibold">Filter</span>
              </button>
            </div>
            <div className="w-[100%] md:w-[20%] bg-white shadow-lg rounded-md ">
              <div className="flex items-center justify-between border-b p-3">
                <p className="text-xl font-semibold">Filters</p>
                <div className="flex flex-row gap-2 items-center">
                  <button className="text-gray-300 font-small">
                    CLEAR ALL
                  </button>
                  <FaChevronDown
                    className={`text-gray-500 cursor-pointer ${
                      expandedSection.seatAndacsectipn
                        ? "-rotate-180"
                        : "rotate-0"
                    } transition-transform`}
                    onClick={() => toggleSection("seatAndacSection")}
                  />
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium">Pick up time - Delhi</p>
                  <span className="flex items-center gap-2">
                    <button className="text-gray-500 text-sm font-medium">
                      CLEAR ALL
                    </button>
                    <FaChevronDown
                      className={`text-gray-500 cursor-pointer ${
                        expandedSection.pickUpPoint ? "-rotate-180" : "rotate-0"
                      } transition-transform`}
                      onClick={() => toggleSection("pickUpPoint")}
                    />
                  </span>
                </div>

                {expandedSection.pickUpPoint && (
                  <div className="mt-2">
                    <ul className="space-y-2">
                      {displayedCities.map((city) => (
                        <li
                          key={city.name}
                          className="flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={city.name}
                              value={city.name}
                              checked={selectedCities.includes(city.name)}
                              onChange={() => handleCityChange(city.name)}
                              className={`cursor-pointer w-4 h-4 rounded ${
                                selectedCities.includes(city.name)
                                  ? "bg-yellow"
                                  : "bg-gray"
                              }`}
                            />
                            <label
                              htmlFor={city.name}
                              className="cursor-pointer"
                            >
                              <p>{city.name}</p>
                            </label>
                          </span>
                          <p className="text-gray">({city.count})</p>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setShowAllCities((prev) => !prev)}
                      className="text-yellow mt-2"
                    >
                      {showAllCities ? "Show Less" : "Show More"}
                    </button>
                  </div>
                )}
              </div>
              <div className="border-b my-3"></div>

              <div className="p-3">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium">Pick up point - Delhi</p>
                  <span className="flex items-center gap-2">
                    <button className="text-gray-500 text-sm font-medium">
                      CLEAR ALL
                    </button>
                    <FaChevronDown
                      className={`text-gray-500 cursor-pointer ${
                        expandedSection.pickUpTime ? "-rotate-180" : "rotate-0"
                      } transition-transform`}
                      onClick={() => toggleSection("pickUpTime")}
                    />
                  </span>
                </div>
                {expandedSection.pickUpTime && (
                  <div className="mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      {pickUpTime.map((item, index) => (
                        <button
                          key={index}
                          className={`flex flex-col items-center p-3 border border-gray ${
                            pickTime.includes(item.time)
                              ? "border border-yellow rounded-lg bg-yellow/20 text-yellow font-medium"
                              : "border border-gray rounded-lg text-gray font-medium"
                          } hover:bg-yellow/20 hover:text-yellow hover:border-yellow`}
                          onClick={() => handleTime(item.time)}
                        >
                          <Image
                            src={
                              pickTime.includes(item.time)
                                ? "/bus/acActive.png"
                                : "/bus/ac.png"
                            }
                            width={20}
                            height={20}
                          />
                          <p>{item.time}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="border-b my-3"></div>

              <div className="p-3">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium">Travel Operators</p>
                  <span className="flex items-center gap-2">
                    <button className="text-gray-500 text-sm font-medium">
                      CLEAR ALL
                    </button>
                    <FaChevronDown
                      className={`text-gray-500 cursor-pointer ${
                        expandedSection.travelOperators
                          ? "-rotate-180"
                          : "rotate-0"
                      } transition-transform`}
                      onClick={() => toggleSection("travelOperators")}
                    />
                  </span>
                </div>
                {expandedSection.travelOperators && (
                  <div className="mt-2">
                    <ul className="space-y-2">
                      {displayedTravelOperators.map((city) => (
                        <li
                          key={city.name}
                          className="flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={city.name}
                              value={city.name}
                              checked={selectedCities.includes(city.name)}
                              onChange={() => handleCityChange(city.name)}
                              className={`cursor-pointer w-4 h-4 rounded ${
                                selectedCities.includes(city.name)
                                  ? "bg-yellow"
                                  : "bg-gray"
                              }`}
                            />
                            <label
                              htmlFor={city.name}
                              className="cursor-pointer"
                            >
                              <p>{city.name}</p>
                            </label>
                          </span>
                          <p className="text-gray">({city.count})</p>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setShowAllTravelOperators((prev) => !prev)}
                      className="text-yellow mt-2"
                    >
                      {showAllTravelOperators ? "Show Less" : "Show More"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 p-2  rounded-xl">
        <div className="border py-2 px-4 rounded-l-xl  flex-col gap-0.5 bg-gray/10  hidden lg:block">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={12} /> From
          </p>
          <p className="text-base font-semibold text-gray-900">
            {fromCityName}
          </p>
        </div>

        <div className="border py-2 px-4  flex-col gap-0.5 bg-gray/10 hidden lg:block">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={12} /> From
          </p>
          <p className="text-base font-semibold text-gray-900">{toCityName}</p>
        </div>

        <div className="border py-2 px-4  flex-col gap-0.5 bg-gray/10 hidden lg:block">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={12} /> Departure
          </p>
          <p className="text-base font-semibold text-gray-900">
            {formattedDate}
          </p>
        </div>
        <Button
          className="hidden lg:flex border py-2 px-4 rounded-r-xl rounded-l-none items-center justify-center gap-4 bg-yellow text-white text-xl font-semibold hover:bg-gray-200"
          onClick={() => router.back()}
        >
          <ArrowLeft size={25} />
          <p>Modify</p>
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row items-start justify-start mt-10 gap-4">
        <div className="w-full md:w-[25%] bg-white shadow-lg rounded-md hidden lg:block">
          <div className="flex items-center justify-between border-b p-3">
            <p className="text-xl font-semibold">Filters</p>
            <div className="flex flex-row gap-2 items-center">
              <button className="text-gray-300 font-small">CLEAR ALL</button>
              <FaChevronDown
                className={`text-gray-500 cursor-pointer ${
                  expandedSection.seatAndacsectipn ? "-rotate-180" : "rotate-0"
                } transition-transform`}
                onClick={() => toggleSection("seatAndacSection")}
              />
            </div>
          </div>

          <div className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">Pick up time - Delhi</p>
              <span className="flex items-center gap-2">
                <button className="text-gray-500 text-sm font-medium">
                  CLEAR ALL
                </button>
                <FaChevronDown
                  className={`text-gray-500 cursor-pointer ${
                    expandedSection.pickUpPoint ? "-rotate-180" : "rotate-0"
                  } transition-transform`}
                  onClick={() => toggleSection("pickUpPoint")}
                />
              </span>
            </div>

            {expandedSection.pickUpPoint && (
              <div className="mt-2">
                <ul className="space-y-2">
                  {displayedCities.map((city) => (
                    <li
                      key={city.name}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={city.name}
                          value={city.name}
                          checked={selectedCities.includes(city.name)}
                          onChange={() => handleCityChange(city.name)}
                          className={`cursor-pointer w-4 h-4 rounded ${
                            selectedCities.includes(city.name)
                              ? "bg-yellow"
                              : "bg-gray"
                          }`}
                        />
                        <label htmlFor={city.name} className="cursor-pointer">
                          <p>{city.name}</p>
                        </label>
                      </span>
                      <p className="text-gray">({city.count})</p>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowAllCities((prev) => !prev)}
                  className="text-yellow mt-2"
                >
                  {showAllCities ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </div>
          <div className="border-b my-3"></div>

          {/* Pick up point - Delhi Section */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">Pick up point - Delhi</p>
              <span className="flex items-center gap-2">
                <button className="text-gray-500 text-sm font-medium">
                  CLEAR ALL
                </button>
                <FaChevronDown
                  className={`text-gray-500 cursor-pointer ${
                    expandedSection.pickUpTime ? "-rotate-180" : "rotate-0"
                  } transition-transform`}
                  onClick={() => toggleSection("pickUpTime")}
                />
              </span>
            </div>
            {expandedSection.pickUpTime && (
              <div className="mt-2">
                <div className="grid grid-cols-2 gap-4">
                  {pickUpTime.map((item, index) => (
                    <button
                      key={index}
                      className={`flex flex-col items-center p-3 border border-gray ${
                        pickTime.includes(item.time)
                          ? "border border-yellow rounded-lg bg-yellow/20 text-yellow font-medium"
                          : "border border-gray rounded-lg text-gray font-medium"
                      } hover:bg-yellow/20 hover:text-yellow hover:border-yellow`}
                      onClick={() => handleTime(item.time)}
                    >
                      <img
                        src={
                          pickTime.includes(item.time)
                            ? "/bus/acActive.png"
                            : "/bus/ac.png"
                        }
                        width={20}
                        height={20}
                      />
                      <p>{item.time}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="border-b my-3"></div>

          {/* Pick up time - Delhi Section */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">Travel Operators</p>
              <span className="flex items-center gap-2">
                <button className="text-gray-500 text-sm font-medium">
                  CLEAR ALL
                </button>
                <FaChevronDown
                  className={`text-gray-500 cursor-pointer ${
                    expandedSection.travelOperators ? "-rotate-180" : "rotate-0"
                  } transition-transform`}
                  onClick={() => toggleSection("travelOperators")}
                />
              </span>
            </div>
            {expandedSection.travelOperators && (
              <div className="mt-2">
                <ul className="space-y-2">
                  {displayedTravelOperators.map((city) => (
                    <li
                      key={city.name}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={city.name}
                          value={city.name}
                          checked={selectedCities.includes(city.name)}
                          onChange={() => handleCityChange(city.name)}
                          className={`cursor-pointer w-4 h-4 rounded ${
                            selectedCities.includes(city.name)
                              ? "bg-yellow"
                              : "bg-gray"
                          }`}
                        />
                        <label htmlFor={city.name} className="cursor-pointer">
                          <p>{city.name}</p>
                        </label>
                      </span>
                      <p className="text-gray">({city.count})</p>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowAllTravelOperators((prev) => !prev)}
                  className="text-yellow mt-2"
                >
                  {showAllTravelOperators ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </div>
        </div>

        {loaderBusList ? (
          <Simmer />
        ) : (
          <div className="w-[75%] ">
            {busList && busList.length > 0 ? (
              busList.map((bus) => {
                const busKey = bus.Bus_Key;

                return (
                  <div
                    key={busKey}
                    className=" rounded-2xl mb-4 shadow-md bg-white hover:shadow-xl transition-all duration-300"
                  >
                    <div className="bg-white rounded-lg overflow-hidden  hover:shadow-lg transition-shadow">
                      <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
                        {/* Left Section - Bus Operator Info */}
                        <div className="flex-1 flex flex-col gap-2 border-r border-gray-200 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="font-bold text-gray-600">
                                {bus.Operator_Name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">
                                {bus.Operator_Name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {bus.Bus_Type}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm mt-2">
                            <div className="flex items-center gap-1 text-green-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <span>{bus.Available_Seats} Seats</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1 text-blue-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <span>{bus.Duration}</span>
                            </div>
                          </div>
                        </div>

                        {/* Middle Section - Journey Details */}
                        <div className="flex-1 flex flex-col md:flex-row items-center justify-between">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Departure</p>
                            <p className="text-xl font-bold text-gray-800">
                              {bus.Departure_Time}
                            </p>
                            <p className="text-xs text-gray-500">{bus.from}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {bus.depdate}
                            </p>
                          </div>

                          <div className="my-3 md:my-0 relative">
                            <div className="hidden md:flex flex-col items-center">
                              <div className="w-16 border-t-2 border-dashed border-gray-300"></div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400 -mt-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                />
                              </svg>
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-gray-500">Arrival</p>
                            <p className="text-xl font-bold text-gray-800">
                              {bus.Arrival_Time}
                            </p>
                            <p className="text-xs text-gray-500">{bus.to}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {bus.arrdate}
                            </p>
                          </div>
                        </div>

                        {/* Right Section - Price & Action */}
                        <div className="flex flex-col items-end justify-between border-l border-gray-200 pl-4">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              Starting from
                            </p>
                            <p className="text-2xl font-bold text-black">
                              {bus.FareMasters && bus.FareMasters.length > 0
                                ? `₹${Math.min(
                                    ...bus.FareMasters.map(
                                      (fare) => fare.Basic_Amount
                                    )
                                  )}`
                                : "N/A"}
                            </p>
                          </div>

                          <button
                            onClick={() => handleSeatMap(busKey)}
                            className="mt-3 bg-gradient-to-r bg-yellow text-white px-6 py-2 rounded-md font-semibold hover:from-orange-600 transition-all shadow-md hover:shadow-lg"
                          >
                            Select Seats
                          </button>
                        </div>
                      </div>

                      {/* Amenities (if available) */}
                      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                        <div className="flex gap-4 overflow-x-auto py-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-green-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            AC
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-green-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Sleeper
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-green-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Charging Point
                          </div>
                          {/* Add more amenities as needed */}
                        </div>
                      </div>
                    </div>

                    {seatMap[busKey] && (
                      <div>
                        {loading ? (
                          <RoundedLoader />
                        ) : (
                          <div className="mt-6 border-t border-gray-200 pt-6 w-full">
                            <div className="flex flex-col lg:flex-row items-start w-full gap-6">
                              {/* Seat Selection Section */}
                              <div className="w-full lg:w-3/5 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="flex items-center justify-between bg-blue-600 px-6 py-3">
                                  <h2 className="text-lg font-bold text-white">
                                    Select Your Seat
                                  </h2>
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
                                      <span className="text-black text-sm">
                                        Available
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 bg-gray rounded-sm mr-2"></div>
                                      <span className="text-black text-sm">
                                        Booked
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 bg-yellow rounded-sm mr-2"></div>
                                      <span className="text-black text-sm">
                                        Selected
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-4 bg-gray-50">
                                  {/* Bus Layout Visualization */}
                                  <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex justify-center mb-2">
                                      <div className="w-3/4 h-8 bg-gray-300 rounded-t-lg flex items-center justify-center">
                                        <span className="text-sm font-medium">
                                          Driver
                                        </span>
                                      </div>
                                    </div>

                                    {/* Lower Deck */}
                                    <div className="mb-6">
                                      <h3 className="text-center font-bold text-lg mb-4 text-gray-700 border-b pb-2">
                                        Lower Deck
                                      </h3>
                                      <div className="grid grid-cols-4 gap-4 p-2">
                                        {sortedRows.map((rowIndex) => (
                                          <div
                                            key={rowIndex}
                                            className="flex flex-wrap gap-2 justify-center"
                                          >
                                            {groupedSeats[rowIndex]
                                              .filter(
                                                (seat) => seat.ZIndex === "0"
                                              )
                                              .map((seat) => {
                                                const isSelected =
                                                  selectedSeatNumbers[
                                                    busKey
                                                  ]?.includes(seat.Seat_Number);
                                                return (
                                                  <button
                                                    key={seat.Seat_Key}
                                                    disabled={!seat.Bookable}
                                                    onClick={() =>
                                                      seat.Bookable &&
                                                      handleSeatSelect(
                                                        busKey,
                                                        seat
                                                      )
                                                    }
                                                    className={`flex items-center justify-center rounded-md transition-all duration-200
                            ${seat.Length === "2" ? "w-16 h-12" : "w-12 h-12"}
                            ${
                              !seat.Bookable ? "bg-gray cursor-not-allowed" : ""
                            }
                            ${
                              isSelected
                                ? "bg-yellow/50 shadow-md scale-105"
                                : "bg-white hover:bg-blue/50 border border-gray"
                            }
                            relative
                          `}
                                                  >
                                                    <span className="font-medium">
                                                      {seat.Seat_Number}
                                                    </span>
                                                    {seat.Length === "2" && (
                                                      <div
                                                        className={`absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-6 rounded ${
                                                          isSelected
                                                            ? "bg-yellow"
                                                            : "bg-gray"
                                                        }`}
                                                      ></div>
                                                    )}
                                                    {!seat.Bookable && (
                                                      <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-full h-px bg-gray transform rotate-45"></div>
                                                      </div>
                                                    )}
                                                  </button>
                                                );
                                              })}
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Upper Deck */}
                                    <div className="mt-8">
                                      <h3 className="text-center font-bold text-lg mb-4 text-gray-700 border-b pb-2">
                                        Upper Deck
                                      </h3>
                                      <div className="grid grid-cols-4 gap-4 p-2">
                                        {sortedRows.map((rowIndex) => (
                                          <div
                                            key={rowIndex}
                                            className="flex flex-wrap gap-2 justify-center"
                                          >
                                            {groupedSeats[rowIndex]
                                              .filter(
                                                (seat) => seat.ZIndex === "1"
                                              )
                                              .map((seat) => {
                                                const isSelected =
                                                  selectedSeatNumbers[
                                                    busKey
                                                  ]?.includes(seat.Seat_Number);
                                                return (
                                                  <button
                                                    key={seat.Seat_Key}
                                                    disabled={!seat.Bookable}
                                                    onClick={() =>
                                                      seat.Bookable &&
                                                      handleSeatSelect(
                                                        busKey,
                                                        seat
                                                      )
                                                    }
                                                    className={`flex items-center justify-center rounded-md transition-all duration-200
                            ${seat.Length === "2" ? "w-16 h-10" : "w-12 h-10"}
                            ${
                              !seat.Bookable ? "bg-gray cursor-not-allowed" : ""
                            }
                            ${
                              isSelected
                                ? "bg-yellow/50 shadow-md scale-105"
                                : "bg-white hover:bg-blue/50 border border-gray"
                            }
                            relative
                          `}
                                                  >
                                                    <span className="font-medium text-sm">
                                                      {seat.Seat_Number}
                                                    </span>
                                                    {seat.Length === "2" && (
                                                      <div
                                                        className={`absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-5 rounded ${
                                                          isSelected
                                                            ? "bg-yellow"
                                                            : "bg-gray"
                                                        }`}
                                                      ></div>
                                                    )}
                                                    {!seat.Bookable && (
                                                      <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-full h-px bg-gray-500 transform rotate-45"></div>
                                                      </div>
                                                    )}
                                                  </button>
                                                );
                                              })}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Pickup & Drop Selection */}
                              <div className="w-full lg:w-2/5 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                                <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                                  <h2 className="text-lg font-bold text-white">
                                    Boarding & Dropping Points
                                  </h2>
                                  <div className="bg-blue-400 text-white text-xs font-medium px-2 py-1 rounded-full">
                                    {selectedSeatNumbers[busKey]?.length || 0}{" "}
                                    {selectedSeatNumbers[busKey]?.length === 1
                                      ? "Seat"
                                      : "Seats"}{" "}
                                    Selected
                                  </div>
                                </div>

                                <div className="p-5 space-y-6">
                                  {/* Selected Seats Summary */}
                                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                      <h3 className="font-bold text-lg text-gray-800">
                                        Your Selection
                                      </h3>
                                      {selectedSeatNumbers[busKey]?.length >
                                        0 && (
                                        <button
                                          onClick={() =>
                                            clearAllSelections(busKey)
                                          }
                                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                          Clear All
                                        </button>
                                      )}
                                    </div>

                                    {selectedSeatNumbers[busKey]?.length > 0 ? (
                                      <div className="flex flex-wrap gap-2">
                                        {selectedSeatNumbers[busKey].map(
                                          (seatNum, index) => (
                                            <div
                                              key={index}
                                              className="bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full flex items-center shadow-sm"
                                            >
                                              <span className="font-medium">
                                                {seatNum}
                                              </span>
                                              <button
                                                onClick={() =>
                                                  handleSeatDeselect(
                                                    busKey,
                                                    seatNum
                                                  )
                                                }
                                                className="ml-2 text-blue-500 hover:text-blue-700 text-lg leading-none"
                                              >
                                                &times;
                                              </button>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-center py-3">
                                        <p className="text-gray-500">
                                          No seats selected yet
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                          Select seats from the seat map
                                        </p>
                                      </div>
                                    )}

                                    <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between items-center">
                                      <span className="font-medium text-gray-700">
                                        Total Seats:
                                      </span>
                                      <span className="font-bold text-blue-600">
                                        {selectedSeatNumbers[busKey]?.length ||
                                          0}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Pickup Points */}
                                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                    <div className="bg-gray-100 px-4 py-3 border-b flex items-center">
                                      <svg
                                        className="w-5 h-5 text-gray-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                      </svg>
                                      <h3 className="font-semibold text-gray-800">
                                        Pickup Point
                                      </h3>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                      {busPickup.length > 0 ? (
                                        busPickup.map((point, index) => (
                                          <label
                                            key={index}
                                            className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors flex items-start
          ${
            selectedPickup["pickup"]?.Boarding_Id === point.Boarding_Id
              ? "bg-blue-50 border-l-4 border-l-blue-500"
              : ""
          }
        `}
                                          >
                                            <input
                                              type="radio"
                                              name="pickup-points"
                                              checked={
                                                selectedPickup["pickup"]
                                                  ?.Boarding_Id ===
                                                point.Boarding_Id
                                              }
                                              onChange={() =>
                                                handlePickupSelection(
                                                  "pickup",
                                                  point
                                                )
                                              }
                                              className="sr-only"
                                            />
                                            <div
                                              className={`mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2
          ${
            selectedPickup["pickup"]?.Boarding_Id === point.Boarding_Id
              ? "border-blue bg-blue"
              : "border-gray-300 bg-white"
          }
        `}
                                            >
                                              {selectedPickup["pickup"]
                                                ?.Boarding_Id ===
                                                point.Boarding_Id && (
                                                <svg
                                                  className="w-3 h-3 text-white"
                                                  fill="currentColor"
                                                  viewBox="0 0 20 20"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                  />
                                                </svg>
                                              )}
                                            </div>
                                            <div className="flex-1">
                                              <div className="flex justify-between items-start">
                                                <h4 className="font-medium text-gray-900">
                                                  {point.Boarding_Name}
                                                </h4>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                  {point.Boarding_Time}
                                                </span>
                                              </div>
                                              <p className="text-sm text-gray-600 mt-1">
                                                {point.Boarding_Address}
                                              </p>
                                              <div className="flex items-center mt-2 text-xs text-gray-500 space-x-3">
                                                {point.Boarding_Landmark && (
                                                  <span className="flex items-center">
                                                    <svg
                                                      className="w-3 h-3 mr-1"
                                                      fill="currentColor"
                                                      viewBox="0 0 20 20"
                                                    >
                                                      <path
                                                        fillRule="evenodd"
                                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                        clipRule="evenodd"
                                                      />
                                                    </svg>
                                                    {point.Boarding_Landmark}
                                                  </span>
                                                )}
                                                {point.Boarding_Contact && (
                                                  <span className="flex items-center">
                                                    <svg
                                                      className="w-3 h-3 mr-1"
                                                      fill="currentColor"
                                                      viewBox="0 0 20 20"
                                                    >
                                                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                    </svg>
                                                    {point.Boarding_Contact}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </label>
                                        ))
                                      ) : (
                                        <div className="p-4 text-center text-gray-500">
                                          No pickup points available
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                    <div className="bg-gray-100 px-4 py-3 border-b flex items-center">
                                      <svg
                                        className="w-5 h-5 text-gray-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                      <h3 className="font-semibold text-gray-800">
                                        Drop Point
                                      </h3>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                      {busDrop.length > 0 ? (
                                        busDrop.map((point, index) => (
                                          <label
                                            key={index}
                                            className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors flex items-start
          ${
            selectedDrop["drop"]?.Dropping_Id === point.Dropping_Id
              ? "bg-blue-50 border-l-4 border-l-blue-500"
              : ""
          }
        `}
                                          >
                                            <input
                                              type="radio"
                                              name="drop-points"
                                              checked={
                                                selectedDrop["drop"]
                                                  ?.Dropping_Id ===
                                                point.Dropping_Id
                                              }
                                              onChange={() =>
                                                handleDropSelection(
                                                  "drop",
                                                  point
                                                )
                                              }
                                              className="sr-only"
                                            />
                                            <div
                                              className={`mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2
          ${
            selectedDrop["drop"]?.Dropping_Id === point.Dropping_Id
              ? "border-blue bg-blue"
              : "border-gray-300 bg-white"
          }
        `}
                                            >
                                              {selectedDrop["drop"]
                                                ?.Dropping_Id ===
                                                point.Dropping_Id && (
                                                <svg
                                                  className="w-3 h-3 text-white"
                                                  fill="currentColor"
                                                  viewBox="0 0 20 20"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                  />
                                                </svg>
                                              )}
                                            </div>
                                            <div className="flex-1">
                                              <div className="flex justify-between items-start">
                                                <h4 className="font-medium text-gray-900">
                                                  {point.Dropping_Name}
                                                </h4>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                  {point.Dropping_Time}
                                                </span>
                                              </div>
                                              <p className="text-sm text-gray-600 mt-1">
                                                {point.Dropping_Address}
                                              </p>
                                              <div className="flex items-center mt-2 text-xs text-gray-500 space-x-3">
                                                {point.Dropping_Landmark && (
                                                  <span className="flex items-center">
                                                    <svg
                                                      className="w-3 h-3 mr-1"
                                                      fill="currentColor"
                                                      viewBox="0 0 20 20"
                                                    >
                                                      <path
                                                        fillRule="evenodd"
                                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                        clipRule="evenodd"
                                                      />
                                                    </svg>
                                                    {point.Dropping_Landmark}
                                                  </span>
                                                )}
                                                {point.Dropping_Contact && (
                                                  <span className="flex items-center">
                                                    <svg
                                                      className="w-3 h-3 mr-1"
                                                      fill="currentColor"
                                                      viewBox="0 0 20 20"
                                                    >
                                                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                    </svg>
                                                    {point.Dropping_Contact}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </label>
                                        ))
                                      ) : (
                                        <div className="p-4 text-center text-gray-500">
                                          No drop points available
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Continue Button */}
                                  <button
                                    className={`w-full py-3.5 rounded-lg font-bold text-white transition-all shadow-md
        ${
          selectedSeatNumbers[busKey]?.length > 0
            ? "bg-gradient-to-r from-blue/100 to-blue/60 hover:from-blue/50 hover:to-blue/30"
            : "bg-gray cursor-not-allowed"
        }
        flex items-center justify-center space-x-2
      `}
                                    onClick={() => {
                                      handleCheckout(bus);
                                    }}
                                    disabled={
                                      selectedSeatNumbers[busKey]?.length === 0
                                    }
                                  >
                                    <span>Continue to Payment</span>
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 p-4">
                <Ban size={50} className="mb-2 text-red-500" />{" "}
                {/* No buses icon */}
                <p>No buses available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
