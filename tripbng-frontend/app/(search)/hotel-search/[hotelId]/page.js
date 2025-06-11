"use client";

import FilterModalHotel from "@/components/FilterModalHotel";
import Simmer from "@/components/layout/simmer";
import { apiGet, apiPost } from "@/lib/apiServiceHotel";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState, useRef } from "react";
import { priceRanges } from "@/constants/data/priceRange";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import Button from "@/components/ui/button";
import { CgSearch } from "react-icons/cg";
import { FiFilter } from "react-icons/fi";
import HotelLocationSelector from "@/components/hotel/HotelLocationSelector";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import PaxDropdown from "@/components/hotel/PaxDropdown";
const { RangePicker } = DatePicker;
export default function Page() {
  const params = useParams();
  const token = params.hotelId;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpenFilter, setIsModalOpenFilter] = useState(false);
  const [hotelList, setHotelList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [totalHotelFound, setTotalHotelFound] = useState(0);
  const [loadingContent, setLoadingContent] = useState(true);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 400000]);
  const [filteredHotelList, setFilteredHotelList] = useState([]);
  const [checkIn, setCheckIn] = useState(dayjs().format("DD MMM YYYY"));
  const [checkOut, setCheckOut] = useState(
    dayjs().add(1, "day").format("DD MMM YYYY")
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    city: "",
    checkIn: dayjs().format("DD MMM YYYY"),
    checkOut: dayjs().add(1, "day").format("DD MMM YYYY"),
    rooms: "",
  });
  const [rooms, setRooms] = useState([
    { adults: 1, children: 0, childAges: [] },
  ]);
  const [openPax, setOpenPax] = useState(false);
  const hasFetched = useRef(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (searchParams) {
      const query = searchParams.keys().next().value;
      if (query) {
        const paramsArray = query.split("/");
        if (paramsArray.length >= 4) {
          const city = decodeURIComponent(paramsArray[0]);
          const checkInRaw = paramsArray[1];
          const checkOutRaw = paramsArray[2];
          const rooms = paramsArray[3];

          const formattedCheckIn = formatDate(checkInRaw);
          const formattedCheckOut = formatDate(checkOutRaw);

          setDetails({
            city,
            checkIn: formattedCheckIn,
            checkOut: formattedCheckOut,
            rooms,
          });
        }
      }
    }
  }, [searchParams]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const savedLocation = localStorage.getItem("selectedLocation");
        if (savedLocation) {
          setSelectedLocation(JSON.parse(savedLocation));
        }
      } catch (error) {
        console.error("Error retrieving location from localStorage:", error);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (!selectedLocation || hasFetched.current) return;
    hasFetched.current = true;

    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 2000;

    const fetchAvailabilityUntilData = async (hotelIds, attempt = 1) => {
      try {
        const availabilityResponse = await apiGet(
          `hotel/availability/async/${token}/results`
        );

        if (availabilityResponse.status !== 200) {
          throw new Error(
            `Error fetching availability: ${availabilityResponse.status}`
          );
        }

        const availabilityData = availabilityResponse.data.hotels || [];

        if (availabilityData.length === 0 && attempt < MAX_RETRIES) {
          console.log(`No availability yet. Retrying... (Attempt ${attempt})`);
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
          return fetchAvailabilityUntilData(hotelIds, attempt + 1);
        }

        return availabilityData;
      } catch (err) {
        console.error("Error during availability polling:", err);
        return [];
      }
    };

    const fetchHotels = async () => {
      try {
        setLoadingContent(true);
        const contentResponse = await apiPost(
          "content/hotelcontent/getHotelContent",
          {
            channelId: "tripbng-ratehawklive-channel",
            circularRegion: {
              centerLat: selectedLocation.coordinates.lat,
              centerLong: selectedLocation.coordinates.long,
              radiusInKm: 30,
            },
            culture: "en-US",
            contentFields: ["Basic"],
            filterBy: {
              ratings: { min: 1, max: 5 },
            },
          }
        );

        if (contentResponse.status !== 200) {
          throw new Error(`Error fetching content: ${contentResponse.status}`);
        }

        const hotelsData = contentResponse.data.hotels || [];
        setTotalHotelFound(hotelsData.length);
        setHotelList(
          hotelsData.map((hotel) => ({ ...hotel, rate: "loading" }))
        );
        setLoadingContent(false);

        const hotelIds = hotelsData.map((hotel) => hotel.id);
        if (hotelIds.length === 0) return;

        setLoadingPrices(true);

        // 🔁 Call availability until data is available
        const availabilityData = await fetchAvailabilityUntilData(hotelIds);

        const updatedHotels = hotelsData
          .map((hotel) => {
            const matchingAvailability = availabilityData.find(
              (avl) => avl.id === hotel.id
            );
            if (!matchingAvailability || !matchingAvailability.rate) {
              return null;
            }
            return { ...hotel, rate: matchingAvailability.rate };
          })
          .filter(Boolean);

        setHotelList(updatedHotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchHotels();
  }, [selectedLocation, token]);
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
  const handlePriceChange = (event) => {
    setPriceRange([0, event.target.value]);
  };

  useEffect(() => {
    const filterAndSortHotels = () => {
      let filteredHotels = hotelList.filter(
        (hotel) =>
          hotel.rate &&
          hotel.rate.totalRate >= priceRange[0] &&
          hotel.rate.totalRate <= priceRange[1] &&
          hotel.contact.address.city.name.toLowerCase() ===
            details.city.toLowerCase()
      );

      if (sortBy === "high-to-low") {
        filteredHotels.sort((a, b) => b.rate.totalRate - a.rate.totalRate);
      } else if (sortBy === "low-to-high") {
        filteredHotels.sort((a, b) => a.rate.totalRate - b.rate.totalRate);
      } else if (sortBy === "star-5-to-1") {
        filteredHotels.sort((a, b) => b.starRating - a.starRating);
      } else if (sortBy === "star-1-to-5") {
        filteredHotels.sort((a, b) => a.starRating - b.starRating);
      }

      if (searchTerm) {
        filteredHotels = filteredHotels.filter((hotel) =>
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredHotelList(filteredHotels);
    };

    filterAndSortHotels();
  }, [
    priceRange,
    hotelList,
    sortBy,
    searchTerm,
    details.city, // React when the city changes
  ]);

  const handleRedirect = async () => {
    setLoading(true);
    if (!selectedLocation) {
      toast.error("Please select a location first.");
      setLoading(false);
      return;
    }
    const formattedCheckIn = dayjs(checkIn).format("YYYY-MM-DD");
    const formattedCheckOut = dayjs(checkOut).format("YYYY-MM-DD");
  
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
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
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
        // Cookies.set("token", token, { expires: 1 });
        localStorage.setItem("tokenHotel", token);
        localStorage.setItem("checkIn", formattedCheckIn);
        localStorage.setItem("checkOut", formattedCheckOut);
        localStorage.setItem("roomLength", rooms.length);
        localStorage.setItem("roomPax", JSON.stringify(rooms));

        const searchUrl = `/hotel-search/${token}?${selectedLocation.name}/${formattedCheckIn}/${formattedCheckOut}/${rooms.length}`;
        router.push(searchUrl, undefined, { shallow: true });
        await fetchHotels();
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
    <>
      <div className=" mt-28">
        <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1 p-2 w-full rounded-xl">
          {/* Location Selector */}
          <div
            className="relative border pt-2 px-4 pb-3 rounded-l-xl flex-col gap-0.5 bg-gray/10 hidden lg:block"
            ref={dropdownRef}
          >
            <button
              className="w-full flex flex-col items-start"
              onClick={() => setIsOpen(!isOpen)}
            >
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin size={12} /> CITY, AREA or PROPERTY
              </p>
              <p className="text-base font-semibold text-gray-900">
                {selectedLocation?.name || details.city}
              </p>
            </button>
            {isOpen && (
              <div className="absolute top-full left-0 w-full z-50">
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

          <div className="border py-3 px-4 flex-col gap-0.5 bg-gray/10 hidden lg:block relative">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={12} /> Check-In
            </p>
            <p className="text-base font-semibold text-gray-900">
              {checkIn || details.checkIn}
            </p>
            <div className="absolute inset-0 opacity-0">
              <RangePicker
                format="DD MMM YYYY"
                defaultValue={[dayjs(), dayjs().add(1, "day")]}
                onChange={(dates) => {
                  if (dates) {
                    setCheckIn(dates[0].format("DD MMM YYYY"));
                    setCheckOut(dates[1].format("DD MMM YYYY"));
                  }
                }}
                className="w-full h-full border-none"
              />
            </div>
          </div>

          <div className="border py-3 px-4 flex-col gap-0.5 bg-gray/10 hidden lg:block relative">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={12} /> Check-Out
            </p>
            <p className="text-base font-semibold text-gray-900">
              {checkOut || details.checkOut}
            </p>
            <div className="absolute inset-0 opacity-0">
              <RangePicker
                format="DD MMM YYYY"
                defaultValue={[dayjs(), dayjs().add(1, "day")]}
                onChange={(dates) => {
                  if (dates) {
                    setCheckIn(dates[0].format("DD MMM YYYY"));
                    setCheckOut(dates[1].format("DD MMM YYYY"));
                  }
                }}
                className="w-full h-full border-none"
              />
            </div>
          </div>

          {/* Rooms & Guests */}
          <div className="relative border p-2 flex-col gap-0.5 bg-gray/10 hidden lg:block">
            <div onClick={() => setOpenPax(!openPax)}>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Users size={12} /> Rooms & Guests
            </p>
            <p className="text-base font-semibold text-gray-900">
            {rooms.reduce(
                  (acc, room) => acc + room.adults + room.children,
                  0
                )}{" "}
                Guests, {rooms.length} Room(s)
            </p>
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

          {/* Modify Button */}
          <Button
            className="hidden lg:flex border py-2 px-4 rounded-r-xl rounded-l-none items-center justify-center gap-4 bg-yellow text-white text-xl font-semibold hover:bg-gray-200"
            onClick={() => handleRedirect()}
          >
            <ArrowLeft size={25} />
            <p>Modify</p>
          </Button>
        </div>
      </div>

      <div className="md:container   flex flex-col gap-4">
        {/* Trigger Button + Modal */}
        <>
          <div className="bg-yellow flex items-center justify-between md:hidden py-4 px-3 md:px-10 shadow-lg">
            <span className="flex items-center gap-3">
              <button>
                <Image
                  src="/icons/arrow.png"
                  className="w-4 h-4 md:h-6 md:w-6"
                  width={100}
                  height={100}
                  alt="Back"
                />
              </button>
              <p className="text-white font-semibold text-lg">{details.city}</p>
            </span>

            <button onClick={() => setIsModalOpenFilter(true)}>
              <Image
                src="/icons/filter.png"
                width={100}
                height={100}
                className="w-6 h-6"
                alt="Filter"
              />
            </button>
          </div>

          {isModalOpenFilter && (
            <FilterModalHotel
              isOpen={isModalOpenFilter}
              onClose={() => setIsModalOpenFilter(false)}
              showAllFilters={true}
            />
          )}
        </>
        <div className="flex gap-6 py-6">
          <div className="bg-white rounded-xl px-4 py-4 w-1/5 hidden md:block shadow-lg sticky top-4 h-fit">
            <div className="border p-3 rounded-lg mb-4">
              <p className="text-sm font-medium">
                Total {totalHotelFound} hotels found
              </p>
            </div>

            <div className="border p-1 rounded-lg mb-4 flex items-center">
              <CgSearch className="mr-2" size={20} />
              <input
                type="text"
                placeholder="Search hotels..."
                className="w-full p-2 border-0 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort By Section */}
            <div className="border p-3 rounded-lg mb-4">
              <h3 className="text-sm font-medium mb-2">Sort By</h3>
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              <input
                type="range"
                min="0"
                max="400000"
                value={priceRange[1]}
                onChange={handlePriceChange}
              />
              <p>Max Price: {priceRange[1]}</p>

              <div className="border-b-2 border-dashed mb-2"></div>
              {[
                { id: "low-to-high", label: "Price (Low to High)" },
                { id: "high-to-low", label: "Price (High to Low)" },
                { id: "star-1-to-5", label: "Star 1 to 5" },
                { id: "star-5-to-1", label: "Star 5 to 1" },
              ].map((sortOption) => (
                <label
                  key={sortOption.id}
                  className="flex items-center px-2 py-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="sort-options"
                    id={sortOption.id}
                    className="form-radio h-4 w-4 text-yellow-500"
                    value={sortOption.id}
                    checked={sortBy === sortOption.id}
                    onChange={(e) => setSortBy(e.target.value)}
                  />
                  <span className="ml-2 text-sm font-medium">
                    {sortOption.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Filters Section */}
            <div className="border p-3 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Filters</h3>
                <button className="text-yellow-500 text-sm font-medium">
                  Clear All
                </button>
              </div>

              <div className="border-b-2 border-dashed mb-3"></div>
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              {priceRanges.map((range) => (
                <label
                  key={range.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <input type="checkbox" id={range.id} className="w-4 h-4" />
                  <span className="text-sm text-gray-700">{range.label}</span>
                  <span className="text-gray-500 text-xs">({range.count})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex-1 rounded-xl overflow-y-auto">
            {loadingContent ? (
              <Simmer />
            ) : (
              <div className="rounded-xl overflow-y-auto flex-1 bg-gray-100">
                <div className="mt-0 flex flex-col gap-6">
                  {hotelList.map((hotel) => (
                    <div key={hotel.id} className="block">
                      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md flex flex-col md:flex-row gap-6 hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer">
                        {/* Hotel Image */}
                        <div className="w-full md:w-[350px] h-[200px] md:h-[220px] rounded-xl overflow-hidden flex-shrink-0 relative">
                          <img
                            src={hotel.heroImage || "/hotels/default.jpg"}
                            alt={hotel.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/hotels/default.jpg";
                            }}
                          />
                        </div>

                        {/* Hotel Details */}
                        <div className="flex flex-col gap-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h4
                              className="text-lg md:text-xl font-semibold text-gray-900 line-clamp-2"
                              title={hotel.name}
                            >
                              {hotel.name}
                            </h4>
                            <div className="flex items-center gap-1">
                              {Array.from({
                                length: hotel.starRating || 0,
                              }).map((_, index) => (
                                <span
                                  key={index}
                                  className="text-yellow"
                                  aria-label={`${hotel.starRating}-star rating`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-tight">
                            {hotel.contact?.address?.line1},{" "}
                            {hotel.contact?.address?.city?.name},{" "}
                            {hotel.contact?.address?.country?.name}
                          </p>
                        </div>

                        {/* Price and Booking */}
                        <div className="md:border-l md:px-6 border-t md:border-t-0 pt-4 md:pt-0 flex flex-col items-start md:items-center w-full md:w-[180px] text-left md:text-center">
                          {hotel.rate === "loading" ? (
                            <div className="flex items-center justify-center w-full">
                              <div className="w-8 h-8 border-4 border-gray-300 border-t-yellow rounded-full animate-spin"></div>
                            </div>
                          ) : hotel.rate && hotel.rate.totalRate ? (
                            <div className="flex flex-col items-center">
                              <span className="text-xl md:text-2xl font-bold text-gray-900">
                                ₹{hotel.rate.totalRate}
                              </span>
                              <span className="text-sm text-gray-500 mt-1">
                                +₹{hotel.rate.taxes} taxes and fees
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Price: Not available
                            </span>
                          )}

                          <span className="text-xs text-gray-500 mt-1">
                            Per night, per room
                          </span>
                          <Link
                            href={`/hotels/${hotel.id}/${encodeURIComponent(
                              hotel.name
                            )}?searchid=${token}`}
                          >
                            <button
                              className="bg-yellow hover:bg-yellow-dark text-white font-semibold py-2 px-4 mt-4 rounded-xl transition-colors duration-300"
                              aria-label={`Book ${hotel.name}`}
                            >
                              Book Now
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {hotelList.length > 0 && (
                    <div className="bg-blue rounded-lg px-4 py-2 mt-2 text-center text-white shadow-md hover:shadow-lg transition-all duration-300">
                      <p className="text-sm">
                        Get INR 742 Cashback on payments via credit/debit cards
                      </p>
                    </div>
                  )}

                  {hotelList.length > 0 && (
                    <div className="mt-4 text-center">
                      <Link
                        href="#"
                        className="text-blue-600 text-sm font-semibold hover:underline"
                      >
                        View More Hotels
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
