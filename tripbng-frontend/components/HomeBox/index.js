"use client";
import { apiService } from "@/lib/api";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { VISA_TYPE } from "@/constants/data/visa-data";
import Image from "next/image";
import dayjs from "dayjs";
import axios from "axios";
import { DatePicker, Space } from "antd";
const HomeBox = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenVisa, setIsModalOpenVisa] = useState(false);
  const [currentModal, setCurrentModal] = useState("");
  const [activeFilter, setActiveFilter] = useState("oneWay");
  const [searchInput, setSearchInput] = useState("");
  const [stayingDays, setStayingDays] = useState(20);
  const [visaType, setVisaType] = useState("Visa Gold");
  const [selectedCity, setSelectedCity] = useState({ from: "", to: "" });
  const [selectedCityVisa, setSelectedCityVisa] = useState(null);
  const [paxState, setPaxState] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const [selectedCityCode, setSelectedCityCode] = useState([
    { from: "", to: "" },
  ]);
  const [selectedCityName, setSelectedCityName] = useState({
    from: "",
    to: "",
  });
  const [query, setQuery] = useState("");
  const [filteredCityList, setFilteredCityList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [isCitySearchOpen, setIsCitySearchOpen] = useState(false);
  const [isHotelSearchOpen, setIsHotelSearchOpen] = useState(false);
  const [isCitySearchOpenVisa, setIsCitySearchOpenVisa] = useState(false);
  const [isPaxDetails, setIsPaxDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cityType, setCityType] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [travelData, setTravelData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rooms, setRooms] = useState([
    { adults: 1, children: 0, childAges: [] },
  ]);
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(dayjs().format("YYYY-MM-DD"));
  const [checkOut, setCheckOut] = useState(
    dayjs().add(1, "day").format("YYYY-MM-DD")
  );
  const [travelDetails, setTravelDetails] = useState({
    a: 1,
    c: 0,
    i: 0,
    tp: 0,
  });

  // useEffect(() => {
  //   if (currentModal === "hotel") {
  //     router.push("https://ratehawk.prod.zentrumhub.com/");
  //   }
  // }, [currentModal, router]);


  const handleCheckInChange = (date, dateString) => {
    setCheckIn(dateString);
    // Ensure checkout is after checkin, and at least one day later
    let newCheckOut = dayjs(dateString).add(1, 'day');
    if (dayjs(checkOut).isBefore(newCheckOut)) {
      setCheckOut(newCheckOut.format("YYYY-MM-DD"));
    } else if (dayjs(checkOut).isSame(dateString)) {
      setCheckOut(newCheckOut.format("YYYY-MM-DD"));
    }
  };

  const handleCheckOutChange = (date, dateString) => {
    setCheckOut(dateString);
  };

  const disabledCheckoutDates = (current) => {
    if (!checkIn) {
      return current.isBefore(dayjs().startOf('day')); // Disable all past dates if checkIn is not set
    }
    return current.isBefore(dayjs(checkIn).add(1, 'day')); // Disable dates before checkIn + 1 day
  };
  const defaultCities = {
    from: {
      iata_code: "AMD",
      name: "Sardar Vallabh Bhai Patel International Airport",
      iso_country: "IN",
    },
    to: {
      iata_code: "DEL",
      name: "Indira Gandhi International Airport",
      iso_country: "IN",
    },
  };
  const filteredCountriesVisa = filteredCountries.filter((city) =>
    city.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  const handleIncrement = (type) => {
    setPaxState((prevState) => ({
      ...prevState,
      [type]: prevState[type] + 1,
    }));
  };
  const handleStayingDaysChange = (value) => {
    setStayingDays(value);
  };
  const handleVisaTypeChange = (value) => {
    setVisaType(value);
  };

  const handleDecrement = (type) => {
    setPaxState((prevState) => ({
      ...prevState,
      [type]: prevState[type] > 0 ? prevState[type] - 1 : 0,
    }));
  };
  const handleSearchChangeVisa = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCitySelectVisa = (city) => {
    setSelectedCityVisa(city);
    setIsCitySearchOpenVisa(false); // Close the search modal
  };

  useEffect(() => {
    setSelectedCityName({
      from: defaultCities.from,
      to: defaultCities.to,
    });
    setSelectedCity({
      from: defaultCities.from.iata_code,
      to: defaultCities.to.iata_code,
    });
    setSelectedCityCode({
      from: defaultCities.from.iso_country,
      to: defaultCities.to.iso_country,
    });
  }, []);
  const handleTravellerChange = (type, count) => {
    setTravelDetails((prev) => ({
      ...prev,
      [type]: count,
    }));
  };

  const handleClassChange = (e) => {
    setTravelDetails((prev) => ({
      ...prev,
      tp: e.target.value,
    }));
  };

  const handleDone = () => {
    console.log("Selected Travel Details:", travelDetails);
    setIsPaxDetails(false);
  };

  useEffect(() => {
    allCityData();
    getAllCountries();
  }, []);

  

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

  const allCityData = async (query = "") => {
    try {
      setLoading(true);
      const response = await apiService.get(
        `/flight/searchAirport?search=${query}`
      );
      if (response.success) {
        localStorage.setItem("cityData", JSON.stringify(response.data));
        setCityList(response.data);
        setFilteredCityList(response.data);
      } else {
        toast.error("Failed to fetch city data");
        console.error("API Error Response:", response);
      }
    } catch (error) {
      toast.error(`Error fetching city data: ${error.message}`);
      console.error("Error fetching city data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAutoSuggestLocation = async (term = "") => {
    try {
      const response = await axios.get(
        `https://autosuggest.travel.zentrumhub.com/api/locations/locationcontent/autosuggest?term=${term}`
      );

      if (response.status === 200) {
        const suggestions = response?.data?.locationSuggestions || [];
        setLocationData(suggestions);
      } else {
        console.log("Failed to fetch locations:", response.status);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  const toggleDropdown = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      await getAutoSuggestLocation();
    }
  };
  const selectLocation = (location) => {
    setSelectedLocation(location);
    setIsOpen(false);
    setIsHotelSearchOpen(false);
  };
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    getAutoSuggestLocation(term);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    if (query) {
      allCityData(query);
    } else {
      setFilteredCityList(cityList);
    }
  };

  const handleCitySelect = (city, type) => {
    setSelectedCityName((prev) => ({
      ...prev,
      [type]: { iata_code: city.iata_code, name: city.name },
    }));
    setSelectedCity((prev) => ({ ...prev, [type]: city.iata_code }));
    setSelectedCityCode((prev) => ({ ...prev, [type]: city.iso_country }));
    closeCitySearch();
    console.log(`Selected ${type}:`, city.iata_code, city.name);
  };

  useEffect(() => {
    setTravelData({
      Origin: selectedCity.from || "",
      Destination: selectedCity.to || "",
      TravelDate: format(selectedDate, "MM/dd/yyyy"),
    });
  }, [selectedCity, selectedDate]);

  const openModalVisa = () => {
    setIsModalOpenVisa(true);
  };

  const closeModalVisa = () => {
    setIsModalOpenVisa(false);
  };
  const openModal = (modalName) => {
    setCurrentModal(modalName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModal("");
  };

  const openCitySearch = (type) => {
    setCityType(type);
    setIsCitySearchOpen(true);
  };

  const closeCitySearch = () => {
    setIsCitySearchOpen(false);
  };

  const openHotelSearch = () => {
    setIsHotelSearchOpen(true);
    toggleDropdown();
  };

  const closeHotelSearch = () => {
    setIsHotelSearchOpen(false);
  };

  const openCitySearchVisa = () => {
    setIsCitySearchOpenVisa(true);
  };

  const closeCitySearchVisa = () => {
    setIsCitySearchOpenVisa(false);
  };

  const openPaxDetails = () => {
    setIsPaxDetails(true);
  };
  const closeModalPax = () => {
    setIsPaxDetails(false);
  };

  const handleRedirect = () => {
    const formattedTravelData = Array.isArray(travelData)
      ? travelData.map((data) => ({
          Origin: data.Origin,
          Destination: data.Destination,
          TravelDate: new Date(data.TravelDate).toISOString().split("T")[0],
        }))
      : [travelData];

    const countryCode =
      selectedCityCode.from === "IN" && selectedCityCode.to === "IN" ? 0 : 1;
    const cityInfoString = encodeURIComponent(
      JSON.stringify(formattedTravelData)
    );

    const queryParams = new URLSearchParams({
      tripInfo: cityInfoString,
      travelcount: JSON.stringify(travelDetails),
      countryCode: JSON.stringify(countryCode),
    });

    localStorage.setItem("flightInfo", JSON.stringify(formattedTravelData));
    localStorage.setItem("travelerCounts", JSON.stringify(travelDetails));

    router.push(`/flight-search/page?${queryParams.toString()}`);
  };

  const navItems = [
    {
      title: "Flights",
      url: "/",
      image: "/nav/plane.png",
      modalName: "flight",
    },
    {
      title: "Hotels",
      url: "https://ratehawk.prod.zentrumhub.com/",
      image: "/nav/hotel.png",
      modalName: "hotel",
    },
    { title: "Buses", url: "/bus", image: "/nav/bus.png", modalName: "bus" },
    {
      title: "Holidays",
      url: "/holiday",
      image: "/nav/holiday.png",
      modalName: "holiday",
    },
    { title: "Visa", url: "/visa", image: "/nav/visa.png", modalName: "visa" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-start gap-2 py-5 px-2">
      <div className="flex items-center justify-start gap-2 py-5 px-2 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.title}
            className="bg-white shadow-lg rounded-lg p-3 flex flex-col items-center justify-center gap-2 min-w-20 min-h-20 w-20 h-20"
            onClick={() => openModal(item.modalName)}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={30} // Fixed width (adjust size as necessary)
              height={30} // Fixed height (adjust size as necessary)
              className="object-contain"
            />
            <span className="text-xs sm:text-sm text-center">{item.title}</span>{" "}
            {/* Text with fixed size */}
          </button>
        ))}
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {currentModal === "flight" && (
              <div>
                <div className="bg-yellow p-3 flex items-center gap-3">
                  <button onClick={closeModal}>
                    <Image
                      src="/icons/arrow.png"
                      width={16}
                      height={16}
                      alt="Home Box"
                      className="w-4 h-4 md:h-6 md:w-6"
                    />
                  </button>
                  <p className="text-white font-medium">Flight Search</p>
                </div>
                <div className="flex items-center w-full border-b border-gray-100 ">
                  {["oneWay", "roundTrip", "multiCity"].map((filter) => (
                    <button
                      key={filter}
                      className={`w-1/2 text-gray-500 font-medium ${
                        activeFilter === filter
                          ? "border-yellow border-b-2 text-yellow"
                          : ""
                      } p-3`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter.charAt(0).toUpperCase() +
                        filter.slice(1).replace(/([A-Z])/g, " $1")}
                    </button>
                  ))}
                </div>
                <div className="p-3">
                  {["from", "to"].map((type) => (
                    <div key={type} className="bg-gray/10 rounded-lg p-2 mb-2">
                      <p className="text-gray-500">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </p>
                      <p
                        className="font-medium truncate max-w-xs sm:max-w-sm md:max-w-md cursor-pointer"
                        onClick={() => openCitySearch(type)}
                      >
                        {selectedCityName[type]?.name
                          ? `${selectedCityName[type].iata_code} - ${selectedCityName[type].name}`
                          : "Select City"}
                      </p>
                    </div>
                  ))}
                  <div className="bg-gray/10 rounded-lg p-2 mb-2">
                    <p className="text-gray-500">Departure Date</p>
                    <div className="relative">
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                          setSelectedDate(date);
                          const formattedDate = format(date, "MM/dd/yyyy"); // Store in format 01/18/2025
                          console.log(
                            "Selected Date (MM/dd/yyyy):",
                            formattedDate
                          ); // Log formatted date
                        }}
                        minDate={new Date()}
                        dateFormat="MMMM d, yyyy" // Display in format January 18, 2025
                        className="font-medium truncate cursor-pointer focus:outline-none bg-transparent "
                      />
                    </div>
                  </div>

                  {activeFilter === "roundTrip" && (
                    <div className="bg-gray/10 rounded-lg p-2 mb-2">
                      <p className="text-gray-500">Return</p>
                      <p className="font-medium truncate max-w-xs sm:max-w-sm md:max-w-md">
                        January 18, 2025
                      </p>
                    </div>
                  )}
                  <div
                    className="bg-gray/10 rounded-lg p-2 mb-2"
                    onClick={() => openPaxDetails()}
                  >
                    <p className="text-gray-500">Travellers || Class</p>
                    <p className="font-medium truncate max-w-xs sm:max-w-sm md:max-w-md">
                      PAX {travelDetails.a + travelDetails.c + travelDetails.i},{" "}
                      {travelDetails.tp || "Economy"}
                    </p>
                  </div>
                  <button
                    className="w-full bg-yellow text-white font-medium py-3 rounded-lg"
                    onClick={() => {
                      handleRedirect();
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            )}
            {currentModal === "hotel" && (
              <div>
                <div className="bg-yellow p-3 flex items-center gap-3">
                  <button onClick={closeModal}>
                    <Image
                      src="/icons/arrow.png"
                      width={16}
                      height={16}
                      alt="Home Box"
                      className="w-4 h-4 md:h-6 md:w-6"
                    />
                  </button>
                  <p className="text-white font-medium">Hotel Search</p>
                </div>
                <div className="p-2">
                  <div className="bg-gray/50 rounded-lg p-2 mb-2">
                    <p className="text-gray-500">Hotel</p>
                    <p
                      className="font-medium truncate max-w-xs sm:max-w-sm md:max-w-md cursor-pointer"
                      onClick={() => openHotelSearch()}
                    >
                      {selectedLocation?.name || "Select a city"}
                    </p>
                  </div>
                  <div className="bg-gray/50 rounded-lg p-2 mb-2">
        <p className="text-gray-500">Check In</p>
        <Space direction="vertical">
          <DatePicker
            format="YYYY-MM-DD"
            defaultValue={dayjs()}
            onChange={handleCheckInChange}
            value={dayjs(checkIn)}
            style={{ width: "100%" }}
            disabledDate={(current) => current.isBefore(dayjs().startOf('day'))} // Disable past dates
          />
        </Space>
      </div>

      <div className="bg-gray/50 rounded-lg p-2 mb-2">
        <p className="text-gray-500">Checkout</p>
        <Space direction="vertical">
          <DatePicker
            format="YYYY-MM-DD"
            value={dayjs(checkOut)}
            onChange={handleCheckOutChange}
            disabledDate={disabledCheckoutDates}
            style={{ width: "100%" }}
          />
        </Space>
      </div>
                  <div className="bg-gray/50 rounded-lg p-2 mb-2">
                    <p className="text-gray-500">Checkout</p>
                    <p
                      className="font-medium truncate max-w-xs sm:max-w-sm md:max-w-md cursor-pointer"
                      onClick={() => openCitySearch(type)}
                    >
                      Ahmedabad
                    </p>
                  </div>
                  <button
                    className="w-full bg-yellow text-white font-medium py-3 rounded-lg"
                    onClick={() => {
                      handleRedirect();
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            )}

            {currentModal === "visa" && (
              <div>
                <div className="bg-yellow p-3 flex items-center gap-3">
                  <button onClick={closeModal}>
                    <Image
                      src="/icons/arrow.png"
                      width={16}
                      height={16}
                      alt="Home Box"
                      className="w-4 h-4 md:h-6 md:w-6"
                    />
                  </button>
                  <p className="text-white font-medium">Visa Booking</p>
                </div>

                <div className="p-3">
                  <div className="bg-gray-500/10 rounded-lg p-2 mb-2">
                    <p className="text-gray-500">Destination</p>
                    <p
                      className="font-medium truncate max-w-xs sm:max-w-sm md:max-w-md cursor-pointer"
                      onClick={() => openCitySearchVisa()}
                    >
                      {selectedCityVisa
                        ? selectedCityVisa.name
                        : "Select a city"}
                      {selectedCityVisa}
                    </p>
                  </div>

                  <div className="bg-gray-500/10 rounded-lg p-2 mb-2">
                    <p className="text-gray-500">Travel Date</p>
                    <div className="relative">
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                          setSelectedDate(date);
                          const formattedDate = format(date, "MM/dd/yyyy"); // Store in format 01/18/2025
                          console.log(
                            "Selected Date (MM/dd/yyyy):",
                            formattedDate
                          ); // Log formatted date
                        }}
                        minDate={new Date()}
                        dateFormat="MMMM d, yyyy" // Display in format January 18, 2025
                        className="font-medium truncate cursor-pointer focus:outline-none bg-transparent "
                      />
                    </div>
                  </div>

                  <div className="bg-gray-500/10 rounded-lg p-2 mb-2">
                    <p className="text-gray-500">Visa Type</p>
                    <Select
                      value={visaType}
                      onValueChange={handleVisaTypeChange}
                    >
                      <SelectTrigger className="font-medium truncate max-w-xs text-lg sm:max-w-sm md:max-w-md cursor-pointer">
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
                  <div className="bg-gray-500/10 rounded-lg p-2 mb-2">
                    <p className="text-gray-500">Length Of Stay</p>

                    <Select
                      value={stayingDays}
                      onValueChange={handleStayingDaysChange}
                    >
                      <SelectTrigger className="font-medium truncate max-w-xs text-lg sm:max-w-sm md:max-w-md cursor-pointer">
                        <SelectValue placeholder="Select staying days" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(
                          (day) => (
                            <SelectItem key={day} value={day}>
                              {day} days
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div
                    className="bg-gray-500/10 rounded-lg p-2 mb-2"
                    onClick={() => {
                      openModalVisa();
                    }}
                  >
                    <p className="text-gray-500">Traveller</p>
                    <p className="font-medium truncate max-w-xs sm:max-w-sm md:max-w-md cursor-pointer">
                      {`${paxState.adult} Adults ${paxState.child} Child ${paxState.infant} Infant`}
                    </p>
                  </div>

                  <button
                    className="w-full bg-yellow text-white font-medium py-3 rounded-lg"
                    onClick={() => {
                      handleRedirect();
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            )}

            {isCitySearchOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                <div
                  className="bg-white p-2 w-full h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 bg-blue/10 border border-blue rounded-lg p-2 mt-2">
                    <button
                      onClick={closeCitySearch}
                      className="focus:outline-none"
                    >
                      <Image
                        src="/icons/arrow.png"
                        width={16}
                        height={16}
                        className="w-4 h-4 md:h-6 md:w-6 filter grayscale invert"
                        alt="Arrow icon"
                      />
                    </button>
                    <div className="flex flex-col">
                      <p className="text-black font-semibold">
                        {cityType.charAt(0).toUpperCase() + cityType.slice(1)}
                      </p>
                      <input
                        placeholder="Enter any city/airport name"
                        className="bg-transparent text-black -mt-1 focus:outline-none focus:ring-0"
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-2 mt-5">
                    {filteredCityList.slice(0, 10).map((city) => (
                      <div
                        key={city.code}
                        className="flex items-center gap-2 cursor-pointer"
                        alt="Home Box"
                        onClick={() => handleCitySelect(city, cityType)}
                      >
                        <Image
                          src="/icons/departures.png"
                          className="w-6 h-6"
                          width={16}
                          height={16}
                          alt="Home Box"
                        />
                        <span>
                          <p className="text-sm">{`${city.iata_code} - ${city.municipality}`}</p>
                          <p className=" truncate max-w-xs sm:max-w-sm md:max-w-md cursor-pointer">{`${city.name} Intl Arpt`}</p>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {isHotelSearchOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                <div
                  className="bg-white p-2 w-full h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 bg-blue/10 border border-blue rounded-lg p-2 mt-2">
                    <button
                      onClick={closeHotelSearch}
                      className="focus:outline-none"
                    >
                      <Image
                        src="/icons/arrow.png"
                        width={16}
                        height={16}
                        className="w-4 h-4 md:h-6 md:w-6 filter grayscale invert"
                        alt="Arrow icon"
                      />
                    </button>
                    <div className="flex flex-col">
                      <p className="text-black font-semibold">Destination</p>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search location..."
                        className="bg-transparent text-black -mt-1 focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-2 mt-5">
                    {locationData.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center gap-3 cursor-pointer"
                        alt="Home Box"
                        onClick={() => selectLocation(location)}
                      >
                        <Image
                          src="/icons/location.png"
                          className="w-4 h-4"
                          width={14}
                          height={14}
                          alt="Home Box"
                        />
                        <span>
                          <p className="text-sm">{location.fullName}</p>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {isCitySearchOpenVisa && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                <div
                  className="bg-white p-2 w-full h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 bg-blue/10 border border-blue rounded-lg p-2 mt-2">
                    <button
                      onClick={closeCitySearchVisa}
                      className="focus:outline-none"
                    >
                      <Image
                        src="/icons/arrow.png"
                        width={16}
                        height={16}
                        className="w-4 h-4 md:h-6 md:w-6 filter grayscale invert"
                        alt="Arrow icon"
                      />
                    </button>
                    <div className="flex flex-col">
                      <p className="text-black font-semibold">Destination</p>
                      <input
                        placeholder="Enter any city name"
                        className="bg-transparent text-black -mt-1 focus:outline-none focus:ring-0"
                        onChange={handleSearchChangeVisa}
                      />
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-2 mt-5">
                    {filteredCountriesVisa.slice(0, 10).map((city) => (
                      <div
                        key={city.code}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleCitySelectVisa(city.name)}
                      >
                        <span className="flex items-center gap-3">
                          <Image
                            src="icons/location.png"
                            width={16}
                            height={16}
                            className="w-6 h-6"
                            alt="Location icon"
                          />
                          <p className="truncate max-w-xs sm:max-w-sm md:max-w-md cursor-pointer">
                            {city.name}
                          </p>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isPaxDetails && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                {/* Modal container */}
                <div
                  className="bg-white w-full h-full mx-auto relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="bg-yellow-500 p-3 flex items-center gap-3">
                    <button onClick={closeModalPax}>
                      <Image
                        src="/icons/arrow.png"
                        width={16}
                        height={16}
                        className="w-4 h-4 md:h-6 md:w-6"
                        alt="Back"
                      />
                    </button>
                    <p className="text-white font-medium">
                      Select travellers and class
                    </p>
                  </div>

                  {/* Travellers Section */}
                  <div className="py-4 px-4">
                    <h2 className="text-lg font-medium mb-4">Travellers</h2>

                    {/* Adults */}
                    <div className="mb-4">
                      <p className="font-medium text-sm text-gray-500 mb-2">
                        Adult (12+ yr)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 9 }, (_, i) => (
                          <button
                            key={i + 1}
                            className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                              travelDetails.a === i + 1
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-300 text-gray-700"
                            }`}
                            onClick={() => handleTravellerChange("a", i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Children */}
                    <div className="mb-4">
                      <p className="font-medium text-sm text-gray-500 mb-2">
                        Child (2-12 yr)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 9 }, (_, i) => (
                          <button
                            key={i}
                            className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                              travelDetails.c === i
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-300 text-gray-700"
                            }`}
                            onClick={() => handleTravellerChange("c", i)}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="mb-4">
                      <p className="font-medium text-sm text-gray-500 mb-2">
                        Infants (0-2 yr)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 9 }, (_, i) => (
                          <button
                            key={i}
                            className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                              travelDetails.i === i
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-300 text-gray-700"
                            }`}
                            onClick={() => handleTravellerChange("i", i)}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Travel Class Section */}
                  <div className="px-4">
                    <h3 className="text-lg font-medium mb-4">Travel Class</h3>
                    <div className="flex flex-col gap-3">
                      {[
                        "Economy",
                        "Premium Economy",
                        "Business",
                        "First Class",
                      ].map((classType) => (
                        <label
                          key={classType}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="tp"
                            value={classType}
                            checked={travelDetails.tp === classType}
                            onChange={handleClassChange}
                            className="cursor-pointer"
                          />
                          <span className="text-gray-700">{classType}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Done Button */}
                  <div className="px-4 py-4">
                    <button
                      className="w-full bg-yellow-500 py-3 rounded-lg font-medium"
                      onClick={handleDone}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isModalOpenVisa && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
                onClick={closeModalVisa}
              >
                <div
                  className="bg-white rounded-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 flex items-center justify-center shadow-lg mb-5">
                    <h1 className="text-xl font-semibold">PAX</h1>
                  </div>
                  <div>
                    {/* Adult Section */}
                    <div className="flex items-center justify-between gap-10 px-3">
                      <span className="flex flex-col">
                        <p className="text-lg font-semibold">Adult</p>
                        <p className="text-gray-500">12 Years and Older</p>
                      </span>
                      <span className="flex items-center gap-2">
                        <button
                          className="text-xl font-semibold border-2 border-yellow rounded-lg w-10 h-10 flex items-center justify-center"
                          onClick={() => handleIncrement("adult")}
                        >
                          +
                        </button>
                        <p>{paxState.adult}</p>
                        <button
                          className="text-xl font-semibold border-2 border-yellow rounded-lg w-10 h-10 flex items-center justify-center"
                          onClick={() => handleDecrement("adult")}
                        >
                          -
                        </button>
                      </span>
                    </div>
                    {/* Child Section */}
                    <div className="flex items-center justify-between gap-10 px-3">
                      <span className="flex flex-col">
                        <p className="text-lg font-semibold">Child</p>
                        <p className="text-gray-500">
                          2 Years to Under 12 Years
                        </p>
                      </span>
                      <span className="flex items-center gap-2">
                        <button
                          className="text-xl font-semibold border-2 border-yellow rounded-lg w-10 h-10 flex items-center justify-center"
                          onClick={() => handleIncrement("child")}
                        >
                          +
                        </button>
                        <p>{paxState.child}</p>
                        <button
                          className="text-xl font-semibold border-2 border-yellow rounded-lg w-10 h-10 flex items-center justify-center"
                          onClick={() => handleDecrement("child")}
                        >
                          -
                        </button>
                      </span>
                    </div>
                    {/* Infant Section */}
                    <div className="flex items-center justify-between gap-10 px-3">
                      <span className="flex flex-col">
                        <p className="text-lg font-semibold">Infant</p>
                        <p className="text-gray-500">Under 2 Years</p>
                      </span>
                      <span className="flex items-center gap-2">
                        <button
                          className="text-xl font-semibold border-2 border-yellow rounded-lg w-10 h-10 flex items-center justify-center"
                          onClick={() => handleIncrement("infant")}
                        >
                          +
                        </button>
                        <p>{paxState.infant}</p>
                        <button
                          className="text-xl font-semibold border-2 border-yellow rounded-lg w-10 h-10 flex items-center justify-center"
                          onClick={() => handleDecrement("infant")}
                        >
                          -
                        </button>
                      </span>
                    </div>
                  </div>
                  {/* Close Buttons */}
                  <div className="px-5 py-3 flex items-center gap-2">
                    <button
                      className="font-semibold text-yellow border border-yellow rounded-lg w-full py-2"
                      onClick={closeModalVisa}
                    >
                      CLOSE
                    </button>
                    <button
                      className="font-semibold text-white bg-yellow rounded-lg w-full py-2"
                      onClick={closeModalVisa}
                    >
                      APPLY
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeBox;
