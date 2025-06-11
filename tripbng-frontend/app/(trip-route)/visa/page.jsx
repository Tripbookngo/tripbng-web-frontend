"use client";
import React, { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dates } from "@/constants/data/date";
import { VISA_TYPE } from "@/constants/data/visa-data";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import LocationSelector, {
  DropdownProvider,
} from "@/components/flight/LocationSelector";
import toast from "react-hot-toast";

export default function Bus() {
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [stayingDays, setStayingDays] = useState(20);
  const [visaType, setVisaType] = useState("Visitor Visa");
  const [destination, setDestination] = useState({
    code: "BLR",
    name: "Kempegowda International Airport Bengaluru",
    municipality: "Bengaluru",
    countryCode: "IN",
  });
  const [paxState, setPaxState] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const [tempPaxState, setTempPaxState] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTravellerOpen, setIsTravellerOpen] = useState(false);
  const travellerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);

    // Handle clicks outside the traveller dropdown
    const handleClickOutside = (event) => {
      if (
        travellerRef.current &&
        !travellerRef.current.contains(event.target)
      ) {
        setIsTravellerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStayingDaysChange = (value) => {
    setStayingDays(value);
  };

  const handleVisaTypeChange = (value) => {
    setVisaType(value);
  };

  const handleIncrement = (type, isTemp = true) => {
    const setState = isTemp ? setTempPaxState : setPaxState;
    setState((prevState) => ({
      ...prevState,
      [type]: prevState[type] + 1,
    }));
  };

  const handleDecrement = (type, isTemp = true) => {
    const setState = isTemp ? setTempPaxState : setPaxState;
    setState((prevState) => ({
      ...prevState,
      [type]:
        type === "adult"
          ? prevState[type] > 1
            ? prevState[type] - 1
            : 1
          : prevState[type] > 0
          ? prevState[type] - 1
          : 0,
    }));
  };

  const getAllCountries = async () => {
    try {
      const response = await apiService.get("/user/countries/all");
      if (response.success) {
        setCountries(response.data);
        setFilteredCountries(response.data);
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  useEffect(() => {
    getAllCountries();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
    }
  };

  const handleSearch = async () => {
    if (!destination || !selectedDate) {
      toast.error("Please select a destination and travel date.");
      return;
    }
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        toast.error("User not found. Please log in.");
        return;
      }
      const { name, mobile } = storedUser;
      const response = await apiService.post("/user/visaqr", {
        destination: destination.municipality,
        travel_date: dayjs(selectedDate).format("YYYY-MM-DD"),
        staying_days: stayingDays,
        visa_type: visaType,
        no_of_person: [paxState],
      });
      response.status === 200
        ? toast.success(response.message)
        : toast.error(response.message);
    } catch (error) {
      console.error("Error fetching package:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTravellers = () => {
    setPaxState(tempPaxState);
    setIsTravellerOpen(false);
  };

  const handleCancelTravellers = () => {
    setTempPaxState(paxState);
    setIsTravellerOpen(false);
  };

  return (
    <DropdownProvider>
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border border-gray-300 divide-y sm:divide-y-0 sm:divide-x divide-gray-300 mb-6 mt-6 rounded-lg">
          <div className="p-3">
            <LocationSelector
              label="Destination"
              placeholder="Select origin"
              value={destination}
              onChange={setDestination}
              module="Visa"
            />
          </div>
          <div className="p-3">
            <p className="text-xs sm:text-sm font-medium text-neutral-400 mb-1 sm:mt-3 hidden lg:block">
              Travel Date
            </p>
            {isClient && (
              <DatePicker
                className="w-full !border-none !shadow-none text-base sm:text-lg py-2 sm:py-3"
                onChange={(date) => setSelectedDate(date)}
                defaultValue={dayjs()}
                format="MMM DD, YYYY"
                size="large"
              />
            )}
          </div>

          <div className="p-3 ">
            <p className="text-xs pt-3 sm:text-sm text-neutral-400">Visa type</p>
            <Select value={visaType} onValueChange={handleVisaTypeChange}>
              <SelectTrigger className="pt-8 w-full font-semibold text-base sm:text-xl">
                <SelectValue placeholder="Select a visa type" />
              </SelectTrigger>
              <SelectContent>
                {VISA_TYPE.map((visa) => (
                  <SelectItem key={visa.label} value={visa.label}>
                    {visa.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3">
            <p className="text-xs sm:text-sm pt-3 text-neutral-400">Staying Days</p>
            <Select value={stayingDays} onValueChange={handleStayingDaysChange}>
              <SelectTrigger className="pt-8 w-full font-semibold text-base sm:text-xl">
                <SelectValue placeholder="Select staying days" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={day}>
                    {day} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 relative" ref={travellerRef}>
            <p className="text-xs sm:text-sm pt-3 text-neutral-400">Travellers</p>
            <div
              className="pt-6 w-full font-semibold text-base sm:text-xl rounded-md p-2 cursor-pointer"
              onClick={() => {
                setTempPaxState(paxState);
                setIsTravellerOpen(!isTravellerOpen);
              }}
            >
              {`${paxState.adult} Adults ${paxState.child} Child ${paxState.infant} Infant`}
            </div>

            {isTravellerOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                {["adult", "child", "infant"].map((type) => (
                  <div
                    key={type}
                    className="flex items-center justify-between gap-6 px-0 py-2"
                  >
                    <span className="flex flex-col">
                      <p className="text-base font-semibold capitalize">
                        {type}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {type === "adult"
                          ? "12 Years and Older"
                          : type === "child"
                          ? "2 to Under 12 Years"
                          : "Under 2 Years"}
                      </p>
                    </span>
                    <span className="flex items-center gap-2">
                      <button
                        className={`text-xl font-semibold border-2 border-yellow rounded-lg w-9 h-9 flex items-center justify-center ${
                          type === "adult" && tempPaxState[type] <= 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (type === "adult" && tempPaxState[type] <= 1) return;
                          handleDecrement(type);
                        }}
                        disabled={type === "adult" && tempPaxState[type] <= 1}
                      >
                        -
                      </button>
                      <p>{tempPaxState[type]}</p>
                      <button
                        className="text-xl font-semibold border-2 border-yellow rounded-lg w-9 h-9 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncrement(type);
                        }}
                      >
                        +
                      </button>
                    </span>
                  </div>
                ))}
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-200 gap-2">
                  <Button
                    onClick={handleCancelTravellers}
                    className="bg-yellow text-white px-6 py-2 rounded-md hover:bg-yellow-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyTravellers}
                    className="bg-yellow text-white px-6 py-2 rounded-md hover:bg-yellow-600"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleSearch}
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow text-white text-base sm:text-xl font-semibold py-2 px-8 sm:px-14 rounded-full hover:bg-yellow-600 transition-colors duration-300"
        >
          Get a CallBack
        </Button>
      </div>
    </DropdownProvider>
  );
}