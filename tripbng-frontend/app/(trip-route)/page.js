"use client"
import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { ArrowRightLeft, Circle as CircleX, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import LocationSelector, {
  DropdownProvider,
} from "@/components/flight/LocationSelector";
import MultiCityTrip from "@/components/flight/MultiCityTrip";
import FlightTraveller from "@/components/flight/FlightTraveller";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const [selectedTripType, setSelectedTripType] = useState("One Way");
  const [selectedFareType, setSelectedFareType] = useState("");
  const [travelerCounts, setTravelerCounts] = useState({
    a: 1,
    c: 0,
    i: 0,
    tp: 0,
  });
  const [departureDate, setDepartureDate] = useState(dayjs());
  const [returnDate, setReturnDate] = useState(dayjs().add(1, "day"));
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [origin, setOrigin] = useState({
    code: "DEL",
    name: "Indira Gandhi International Airport",
    municipality: "Delhi",
    country: "IN",
  });
  const [destination, setDestination] = useState({
    code: "BLR",
    name: "Kempegowda International Airport Bengaluru",
    municipality: "Bengaluru",
    country: "IN",
  });

  const [multiCityTrips, setMultiCityTrips] = useState([
    {
      id: "trip-1",
      origin: {
        code: "DEL",
        name: "Indira Gandhi International Airport",
        municipality: "Delhi",
        countryCode: "IN",
      },
      destination: {
        code: "BLR",
        name: "Kempegowda International Airport Bengaluru",
        municipality: "Bengaluru",
        countryCode: "IN",
      },
      date: dayjs("2025-03-22"),
    },
    {
      id: "trip-2",
      origin: {
        code: "DEL",
        name: "Indira Gandhi International Airport",
        municipality: "Delhi",
      },
      destination: null,
      date: null,
    },
  ]);

  useEffect(() => {
    localStorage.setItem("travelerCounts", JSON.stringify(travelerCounts));
  }, [travelerCounts]);

  const tripTypes = ["One Way", "Rounded"];
  const fareTypes = [
    { value: "STUDENT", type: "Student", description: "Student fares" },
    {
      value: "SENIORCITIZEN",
      type: "Senior Citizen",
      description: "Senior Citizen fares",
    },
  ];

  const handleDateChange = (dates) => {
    if (!dates) {
      return; // Don't close the picker if no date is selected
    }
    
    if (selectedTripType === "One Way") {
      setDepartureDate(dates);
      setPickerVisible(false);
    } else if (Array.isArray(dates)) {
      if (dates[0] && dates[1]) { // Only close if both dates are selected
        setDepartureDate(dates[0]);
        setReturnDate(dates[1]);
        setPickerVisible(false);
      }
    }
  };

  const dropdownRef = useRef(null);
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside both the date picker and its popup
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        !event.target.closest(".ant-picker-dropdown") // Don't close when clicking the calendar popup
      ) {
        setPickerVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    const isInternational =
      origin.country === "IN" && destination.country === "IN" ? 0 : 1;

    const itinerary = `${origin.code}-${
      destination.code
    }-${departureDate.format("DD/MM/YYYY")}${
      selectedTripType === "Rounded"
        ? `_${returnDate.format("DD/MM/YYYY")}`
        : ""
    }`;

    const paxType = `A-${travelerCounts.a}_C-${travelerCounts.c}_I-${travelerCounts.i}`;

    const makemytripUrl = `flight-search/?itinerary=${itinerary}&tripType=${
      selectedTripType === "One Way" ? "O" : "R"
    }&paxType=${paxType}&intl=${isInternational}&cabinClass=E${
      selectedFareType ? `&fareType=${selectedFareType}` : ""
    }`;

    localStorage.setItem(
      "selectedTrip",
      JSON.stringify({
        origin,
        destination,
        departureDate: departureDate.format("YYYY-MM-DD"),
        returnDate:
          selectedTripType === "Rounded"
            ? returnDate.format("YYYY-MM-DD")
            : null,
        travelerCounts,
        selectedTripType,
        selectedFareType,
        isInternational,
      })
    );

    router.push(makemytripUrl);
  };

  useEffect(() => {
    setSelectedTripType("One Way");
    setDepartureDate(dayjs());
    setTravelerCounts({
      a: 1,
      c: 0,
      i: 0,
      tp: 0,
    });
  }, []);

  const toggleFareType = (value) => {
    setSelectedFareType((prevFareType) => {
      return prevFareType === value ? "" : value;
    });
  };

  return (
    <DropdownProvider>
      <div className="bg-white px-4 py-2  md:p-8 rounded-xl shadow-md relative max-w-full   md:max-w-6xl xl:max-w-7xl mx-auto">
        <div className="flex items-center justify-center md:justify-start gap-4 mt-5 md:mt-0 mb-2 md:mb-6 ">
          {tripTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedTripType(type)}
              className={`text-xs flex items-center  gap-2 rounded-md py-2 px-3 ${
                selectedTripType === type ? "bg-yellow/30 font-semibold" : ""
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full ${
                  selectedTripType === type ? "bg-yellow" : "bg-white"
                }`}
              ></span>
              <p>{type}</p>
            </button>
          ))}
        </div>

        {selectedTripType !== "Multiple City" ? (
          <div
            className={cn(
              "md:grid grid-cols-1  md:grid-cols-6 py-4 mx-auto bg-white rounded-md relative",
              "animate-fade-in transition-all duration-300"
            )}
          >
            <div className="flex flex-row md:col-span-3">
              <div className="border py-1 px-3 md:rounded-l-xl rounded-tl-xl  hover:bg-yellow/10 transition-all duration-300 cursor-pointer w-1/2">
                <LocationSelector
                  label="From"
                  placeholder="Select origin"
                  value={origin}
                  onChange={setOrigin}
                  module="Flight"
                />
              </div>

              <div className="border py-1 px-3 md:rounded-none rounded-tr-xl hover:bg-yellow/10 transition-all duration-300 cursor-pointer w-1/2">
                <LocationSelector
                  label="To"
                  placeholder="Select destination"
                  value={destination}
                  onChange={setDestination}
                  excludeCity={origin}
                  module="Flight"
                />
              </div>
            </div>

            <div className="flex flex-row md:col-span-2">
              <div
                className="border py-2 px-4 md:border-r border-r-0 hover:bg-yellow/10 transition-all duration-300 cursor-pointer w-1/2"
                onClick={() => setPickerVisible(true)}
              >
                <span className="md:flex items-center gap-3 mb-1 hidden mt-2">
                  <p className="text-xs text-neutral-400 ">Departure</p>
                  <Image
                    src="/icons/dateDown.png"
                    width={20}
                    height={20}
                    alt="dateDown"
                  />
                </span>
                <div className="flex flex-col mt-3">
                  <span className="flex items-baseline gap-2">
                    <p className="md:text-2xl font-bold">
                      {departureDate.format("D")}
                    </p>
                    <p className="md:text-xl">
                      {departureDate.format("MMM'YY")}
                    </p>
                  </span>
                  <p className="text-sm text-gray">
                    {departureDate.format("dddd")}
                  </p>
                </div>
              </div>

              {selectedTripType === "One Way" ? (
                <div
                  className="border py-2 px-4 md:border-l border-l-0 hover:bg-yellow/10 transition-all duration-300 cursor-pointer w-1/2"
                  onClick={() => setSelectedTripType("Rounded")}
                >
                  <span className="md:flex items-center gap-3 mb-1 hidden mt-2">
                    <p className="text-xs text-neutral-400">Return</p>
                    <Image
                      src="/icons/dateDown.png"
                      width={20}
                      height={20}
                      alt="dateDown"
                    />
                  </span>
                  <p className="text-sm text-gray mt-3">
                    Tap to add return date
                  </p>
                </div>
              ) : (
                <div
                  className="border py-2 px-4 hover:bg-yellow/10 transition-all duration-300 cursor-pointer w-1/2"
                  onClick={() => setPickerVisible(true)}
                >
                  <span className="flex items-center justify-between">
                    <span className="md:flex items-center gap-3 hidden mt-2">
                      <p className="text-xs text-neutral-400">Return</p>
                      <Image
                        src="/icons/dateDown.png"
                        width={20}
                        height={20}
                        alt="dateDown"
                      />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTripType("One Way");
                      }}
                      className="absolute mt-10 md:mt-0 ml-28"
                    >
                      <Image
                        src="/icons/dateClose.png"
                        width={20}
                        height={20}
                        alt="dateClose"
                      />
                    </button>
                  </span>
                  <div className="flex flex-col mt-3">
                    <span className="flex items-baseline gap-2">
                      <p className="md:text-2xl font-bold">
                        {returnDate.format("D")}
                      </p>
                      <p className="md:text-xl">
                        {returnDate.format("MMM'YY")}
                      </p>
                    </span>
                    <p className="text-sm text-gray">
                      {returnDate.format("dddd")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border rounded-b-xl md:rounded-b-none md:rounded-r-xl md: hover:bg-yellow/10 transition-all duration-300 cursor-pointer ">
              <div className="mt-2">
                <FlightTraveller
                  travelerCounts={travelerCounts}
                  setTravelerCounts={setTravelerCounts}
                />
              </div>
            </div>

            {isPickerVisible && (
            <div
                ref={datePickerRef}
                className="absolute z-50 shadow-md rounded-md"
                style={{ top: "40%", left: "50%" }}
              >
                {selectedTripType === "One Way" ? (
                  <DatePicker
                    value={departureDate}
                    onChange={handleDateChange}
                    format="D MMM'YY"
                    open={true}
                    placeholder=""
                    style={{
                      position: "absolute",
                      zIndex: 9999,
                      width: "auto",
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                    className="w-[250px] px-2 py-1 bg-transparent focus:outline-none font-semibold text-2xl text-black"
                  />
                ) : (
                  <DatePicker.RangePicker
                    value={[departureDate, returnDate]}
                    onChange={handleDateChange}
                    format="D MMM'YY"
                    open={true}
                    placeholder=""
                    style={{
                      position: "absolute",
                      zIndex: 9999,
                      width: "auto",
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                    className="w-[250px] px-2 py-1 bg-transparent focus:outline-none font-semibold text-2xl text-black"
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <MultiCityTrip trips={multiCityTrips} onChange={setMultiCityTrips} />
        )}

        <div className="flex md:flex-row flex-col md:items-center justify-start gap-2 md:gap-4 mb-3 px-2">
          <p className="font-semibold">
            Special Fares <span className="text-gray">(Optional)</span>:
          </p>
          <div className="flex gap-2">
            {fareTypes.map(({ value, type, description }) => (
              <button
                key={value}
                className={`p-2 rounded-md flex items-center gap-2 cursor-pointer border ${
                  selectedFareType === value
                    ? "border-2 bg-blue text-white border-white"
                    : "border-neutral-300"
                }`}
                onClick={() => toggleFareType(value)}
              >
                <div className="flex flex-col items-start">
                  <p className="text-sm font-semibold">{type}</p>
                </div>
                {selectedFareType === value && <CircleX size={15} />}
              </button>
            ))}
          </div>
        </div>

        <Button
          size="md"
          className="flex justify-center w-3/4 md:w-auto items-center bg-yellow text-white text-xl font-semibold py-2 px-14 rounded-full hover:bg-yellow-600 transition-colors duration-300 
          md:absolute md:-bottom-4 md:left-1/2 md:transform md:-translate-x-1/2 
          mx-auto md:mx-0 md:block mb-3 md:mb-0"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </DropdownProvider>
  );
}