"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import Button from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PriceRateModal from "@/components/PriceRateModal";
import { apiPost } from "@/lib/apiServiceHotel";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract hotel ID from URL path
  const pathSegments = pathname.split("/");
  const hotelId = pathSegments[2];

  // Extract search token from query parameters
  const searchToken = searchParams.get("searchid");

  // State variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [isModalOpenImg, setIsModalOpenImg] = useState(false);
  const [isPriceRateModal, setIsPriceRateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [recommendationsId, setRecommendationsId] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [roomCount, setRoomCount] = useState(null);
  const [roomPax, setRoomPax] = useState([]);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === standardImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? standardImages.length - 1 : prevIndex - 1
    );
  };

  const selectedCity = localStorage.getItem("selected_city");
  const hotelName = searchParams.get("hotelName") || "";

  useEffect(() => {
    const checkIn = localStorage.getItem("checkIn");
    const checkOut = localStorage.getItem("checkOut");
    const roomLength = localStorage.getItem("roomLength");
    const storedRoomPax = localStorage.getItem("roomPax");

    if (checkIn) setCheckInDate(checkIn);
    if (checkOut) setCheckOutDate(checkOut);
    if (roomLength) setRoomCount(roomLength);

    try {
      if (storedRoomPax) {
        setRoomPax(JSON.parse(storedRoomPax));
      }
    } catch (error) {
      console.error("Error parsing roomPax from localStorage:", error);
      setRoomPax([]);
    }
  }, []);

  const standardImages = hotelDetails?.images
    ?.map((img) => img.links.find((link) => link.size === "Xxl"))
    ?.filter(Boolean);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (hotelId && searchToken) {
          await Promise.all([
            getRoomsAndRates(hotelId, searchToken),
            getHotelContent(hotelId)
          ]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId, searchToken]);

  const handlePriceOpenModal = (group, rate, rid) => {
    setSelectedRoom({ room: group.room, rates: [rate] });
    setRecommendationsId(rid);
    setIsPriceRateModal(true);
  };

  const handlePriceCloseModal = () => {
    setSelectedRoom(null);
    setIsPriceRateModal(false);
  };

  // API: Fetch Room Prices & Availability
  const getRoomsAndRates = async (hotelId, searchToken) => {
    try {
      const response = await apiPost(
        `hotel/${hotelId}/roomsandrates/${searchToken}`,
        { searchSpecificProviders: false }
      );

      if (response.status === 200) {
        setRooms(response.data.hotel || []);
      } else {
        throw new Error(`Failed to fetch rooms: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError(error.message);
    }
  };

  // API: Fetch Hotel Content (Name, Images, Description)
  const getHotelContent = async (hotelId) => {
    try {
      const response = await apiPost(`content/hotelcontent/getHotelContent`, {
        hotelIds: [hotelId],
        channelId: "tripbng-ratehawklive-channel",
        culture: "en-US",
        contentFields: ["All"],
      });

      if (response.status === 200) {
        setHotelDetails(response.data.hotels?.[0] || null);
      } else {
        throw new Error(`Failed to fetch hotel details: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      setError(error.message);
    }
  };

  // Map recommendations to grouped rooms with rates
  const mapGroupedRecommendations = () => {
    if (!rooms || !rooms.recommendations) return [];
    
    const { recommendations, rates, standardizedRooms, rooms: roomList } = rooms;

    return recommendations.map(rec => {
      // Get all rates for this recommendation
      const rateObjs = rec.rates
        .map(rateId => {
          const rate = rates.find(r => r.id === rateId);
          if (!rate) return null;

          // Find the room (either from standardizedRooms or rooms array)
          let room = null;
          const occupancy = rate.occupancies?.[0];
          if (occupancy) {
            if (standardizedRooms && occupancy.stdRoomId) {
              room = standardizedRooms.find(r => r.id === occupancy.stdRoomId);
            } else if (occupancy.roomId) {
              room = roomList.find(r => r.id === occupancy.roomId);
            }
          }

          return room ? { rate, room } : null;
        })
        .filter(Boolean);

      // Group rates by room
      const groupedByRoom = {};
      rateObjs.forEach(({ rate, room }) => {
        if (!groupedByRoom[room.id]) {
          groupedByRoom[room.id] = { room, rates: [] };
        }
        groupedByRoom[room.id].rates.push(rate);
      });

      return {
        recommendation: rec,
        groupedRooms: Object.values(groupedByRoom)
      };
    });
  };

  // Merge rooms across all recommendations
  const mergeGroupedRoomsAcrossRecs = () => {
    const merged = {};
    groupedData.forEach(({ recommendation, groupedRooms }) => {
      groupedRooms.forEach(({ room, rates }) => {
        if (!merged[room.id]) {
          merged[room.id] = {
            room,
            rates: [...rates],
            recommendationIds: [recommendation.id]
          };
        } else {
          merged[room.id].rates.push(...rates);
          merged[room.id].recommendationIds.push(recommendation.id);
        }
      });
    });
    return Object.values(merged);
  };

  const groupedData = mapGroupedRecommendations();
  const mergedRoomList = mergeGroupedRoomsAcrossRecs();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
    appendDots: (dots) => (
      <div style={{ marginTop: "-5px" }}>
        <ul style={{ margin: "-10px", padding: "0px" }}>{dots}</ul>
      </div>
    ),
  };

  const handleRedirected = () => {
    try {
      const token = localStorage.getItem("tokenHotel");
      const selectedLocation = localStorage.getItem("selected_city");
      const checkIn = localStorage.getItem("checkIn");
      const checkOut = localStorage.getItem("checkOut");
      const rooms = localStorage.getItem("roomLength");
      const searchUrl = `/hotel-search/${token}?${selectedLocation}/${checkIn}/${checkOut}/${rooms}`;
      router.push(searchUrl);
    } catch (error) {
      console.error("Error redirecting:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            className="mt-2 bg-yellow text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:container py-10 px-3 md:px-3 flex flex-col gap-4 mt-20">
      {/* Search Summary Bar */}
      <div className="grid-cols-5 bg-white rounded-xl hidden sm:grid w-full">
        <div className="border rounded-l-xl p-4">
          <p className="text-sm">CITY, AREA or PROPERTY</p>
          <p className="text-md font-semibold">{selectedCity || ""}</p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Check-In</p>
          <p className="text-md font-semibold">
            {checkInDate
              ? new Date(checkInDate).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })
              : ""}
          </p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Check-Out</p>
          <p className="text-md font-semibold">
            {checkInDate
              ? new Date(checkOutDate).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })
              : ""}
          </p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Rooms & Guests</p>
          <p className="text-md font-semibold">
            {roomCount} Room, {roomPax.reduce((sum, room) => sum + room.adults, 0)} Adults
          </p>
        </div>
        <Button
          className="border py-2 px-4 rounded-r-xl rounded-l-none flex items-center justify-center gap-4 bg-yellow text-white text-xl font-semibold hover:bg-gray-200"
          onClick={() => router.back()}
        >
          <ArrowLeft size={25} />
          <p>Modify</p>
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm my-2">
        <p className="text-blue font-medium">Home</p>
        <ChevronRight size={14} color="grey" />
        <p
          className="text-blue font-medium cursor-pointer"
          onClick={handleRedirected}
        >{`Hotels In ${selectedCity}`}</p>
        <ChevronRight size={14} color="grey" />
        <p className="font-medium">
          {hotelName || hotelDetails?.name || "Hotel Details"}
        </p>
      </div>

      {/* Hotel Overview Section */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h1 className="md:text-xl font-semibold">
          {hotelDetails?.name || ""}
        </h1>
        
        {/* Hotel Images */}
        <div className="flex gap-3 py-3 flex-col md:flex-row">
          <div className="w-full">
            <div className="flex w-full gap-3 md:h-96 h-60">
              {/* Main Image */}
              <div
                className="basis-4/6 h-full relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setIsModalOpenImg(true)}
              >
                <Image
                  src="/hotels/default.jpg"
                  alt="Default Image"
                  className="w-full h-full object-cover absolute z-0"
                  width={600}
                  height={400}
                  unoptimized={true}
                />

                {hotelDetails?.images?.[0]?.links?.find(
                  (link) => link.size === "Xxl"
                )?.url && (
                  <Image
                    src={
                      hotelDetails.images[0].links.find(
                        (link) => link.size === "Xxl"
                      ).url
                    }
                    alt="Hotel Image"
                    className="absolute top-0 left-0 w-full h-full object-cover z-10 transition-opacity duration-500 opacity-0"
                    width={600}
                    height={400}
                    onLoad={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    unoptimized={true}
                  />
                )}

                <div className="absolute inset-0 z-20 flex items-end p-3">
                  <p className="text-sm text-white font-semibold">
                    +{hotelDetails?.images?.length || 0} property photos
                  </p>
                </div>
              </div>

              {/* Secondary Images */}
              <div className="basis-2/6 flex flex-col justify-between h-full gap-2">
                {hotelDetails?.images?.slice(1, 3).map((image, index) => {
                  const imageUrl = image?.links?.find(
                    (link) => link.size === "Xxl"
                  )?.url;

                  return (
                    <div key={index} className="relative h-[calc(50%-6px)]">
                      <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg z-20"></div>
                      <p className="absolute text-sm bottom-3 left-3 text-white font-semibold z-30">
                        {image.caption || "Hotel Photo"}
                      </p>
                      <Image
                        src="/hotels/default.jpg"
                        alt="Loading..."
                        className="absolute top-0 left-0 h-full w-full object-cover rounded-lg z-0"
                        width={600}
                        height={100}
                        unoptimized
                      />
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt="Hotel Image"
                          className="absolute top-0 left-0 h-full w-full object-cover rounded-lg z-10 opacity-0 transition-opacity duration-500"
                          width={600}
                          height={100}
                          unoptimized
                          onLoad={(e) => {
                            e.currentTarget.style.opacity = 1;
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hotel Description */}
            <p className="leading-tight mt-2 text-gray-500 text-sm md:text-lg">
              {hotelDetails?.description || "No description available"}
            </p>

            {/* Hotel Highlights */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <span className="flex items-center gap-2 py-2 px-4 border border-yellow rounded-lg bg-yellow/20 w-full sm:w-auto">
                <Image
                  src="/hotels/spoon.png"
                  className="w-6 h-6"
                  alt="Food and Dining"
                  width={100}
                  height={100}
                />
                <p className="text-sm font-medium text-gray-700">
                  Food and Dining
                </p>
              </span>

              <span className="flex items-center gap-2 py-2 px-4 border border-yellow rounded-lg bg-yellow/20 w-full sm:w-auto">
                <Image
                  src="/hotels/location.png"
                  width={100}
                  height={100}
                  className="w-6 h-6"
                  alt="Location & Surroundings"
                />
                <p className="text-sm font-medium text-gray-700">
                  Location & Surroundings
                </p>
              </span>
            </div>

            {/* Amenities */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Amenities
              </h2>
              <ul className="py-3 flex flex-wrap items-center gap-6 md:gap-4">
                {hotelDetails?.facilities?.slice(0, 3).map((facility, index) => (
                  <li key={index} className="flex items-center gap-2 w-full sm:w-auto">
                    <Image
                      src={`/hotels/${facility.type?.toLowerCase() || 'default'}.png`}
                      width={100}
                      height={100}
                      className="w-8 h-8"
                      alt={facility.name}
                    />
                    <p className="text-gray-500 font-light text-sm">{facility.name}</p>
                  </li>
                ))}
              </ul>
              {hotelDetails?.facilities?.length > 3 && (
                <button className="text-blue font-semibold text-sm mt-3 inline-flex items-center">
                  + {hotelDetails.facilities.length - 3} More Amenities
                </button>
              )}
            </div>

            {/* Featured Highlights */}
            {hotelDetails?.highlights && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold">
                  Discover the Best of {hotelDetails?.name}
                </h2>
                <ul className="flex md:flex-row flex-col items-center gap-3 mt-2">
                  {hotelDetails.highlights.slice(0, 3).map((highlight, index) => (
                    <li key={index} className="border rounded-lg w-full flex items-center justify-between gap-2">
                      <p className="ml-3 font-medium md:w-36 text-center">
                        {highlight.title}
                      </p>
                      <span className="border-2 border-yellow rounded-lg p-0.5">
                        <Image
                          src={highlight.imageUrl || "/hotels/default-highlight.jpg"}
                          width={100}
                          height={100}
                          className="w-14 h-14 object-cover rounded-lg"
                          alt={highlight.title}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date/Guests Modification Bar */}
      <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-base md:text-lg font-semibold">
            Change Dates and Guest(s)
          </p>
          <p className="text-sm md:text-lg font-medium text-gray-500">
            Check-in: 3 PM | Check-out: 12 PM
          </p>
        </div>

        <div className="flex flex-col md:flex-row flex-wrap items-center gap-2 w-full md:w-auto">
          <button className="border py-2 px-4 rounded-lg flex items-center justify-between gap-2 w-full md:w-auto text-sm md:text-base">
            {checkInDate
              ? new Date(checkInDate).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })
              : "Select Date"}
            <Image
              src="/hotels/down.png"
              width={100}
              height={100}
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Date selector"
            />
          </button>
          <button className="border py-2 px-4 rounded-lg flex items-center justify-between gap-2 w-full md:w-auto text-sm md:text-base">
            {checkOutDate
              ? new Date(checkOutDate).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })
              : "Select Date"}
            <Image
              src="/hotels/down.png"
              width={100}
              height={100}
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Date selector"
            />
          </button>
          <button className="border py-2 px-4 rounded-lg flex items-center justify-between gap-2 w-full md:w-auto text-sm md:text-base">
            {roomPax.reduce((sum, room) => sum + room.adults, 0)} Adults,{" "}
            {roomPax.reduce((sum, room) => sum + room.children, 0)} Children
            <Image
              src="/hotels/down.png"
              width={100}
              height={100}
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Guest selector"
            />
          </button>
          <button className="border-2 border-yellow py-2 px-4 rounded-lg text-yellow font-medium w-full md:w-auto text-sm md:text-base">
            Update Search
          </button>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="md:text-lg text-sm font-semibold flex items-center gap-1">
          {mergedRoomList.length} Room Types
          <Image
            src="/hotels/down.png"
            width={100}
            height={100}
            className="w-6 h-6"
            alt="Room types"
          />
        </h2>

        {/* Room Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <button className="border py-2 px-4 rounded-lg flex items-center gap-2 text-sm md:text-base w-full sm:w-auto">
            Breakfast Included
          </button>
          <button className="border py-2 px-4 rounded-lg flex items-center gap-2 text-sm md:text-base w-full sm:w-auto">
            Breakfast & Lunch/Dinner Included
          </button>
        </div>

        {/* Promo Banner */}
        <div className="border rounded-lg mt-3 bg-blue-50 p-2">
          <p className="text-gray-500 text-sm sm:text-base">
            Deal Applied:{" "}
            <span className="text-black font-semibold text-lg sm:text-xl">
              WELCOMETRIP
            </span>
            . Big Savings! Get INR 2979 Off
          </p>
        </div>

        {/* Rooms List */}
        <div className="space-y-6 mt-4">
          {mergedRoomList.length > 0 ? (
            mergedRoomList.map((roomGroup) => (
              <div
                key={roomGroup.room.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Room Images */}
                  <div className="lg:w-1/3">
                    {roomGroup.room.images?.length > 0 ? (
                      <Slider {...sliderSettings}>
                        {roomGroup.room.images.map((image, idx) => (
                          <div key={idx} className="relative h-48">
                            <Image
                              src={image.links[0]?.url || "/hotels/default-room.jpg"}
                              alt={`Room ${idx + 1}`}
                              fill
                              className="object-cover rounded-lg"
                              unoptimized
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div className="relative h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">No images available</p>
                      </div>
                    )}
                  </div>

                  {/* Room Details */}
                  <div className="lg:w-2/3">
                    <h3 className="text-xl font-bold text-gray-800">
                      {roomGroup.room.name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {roomGroup.room.description || "No description available"}
                    </p>

                    {/* Facilities */}
                    {roomGroup.room.facilities?.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-semibold text-gray-700">Facilities:</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {roomGroup.room.facilities.slice(0, 5).map((facility, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {facility.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rates */}
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Available Rates
                      </h4>
                      <div className="space-y-3">
                        {roomGroup.rates.map((rate) => (
                          <div
                            key={rate.id}
                            className="border rounded-lg p-3 hover:bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    rate.refundable
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}>
                                    {rate.refundable ? "Refundable" : "Non-refundable"}
                                  </span>
                                  {rate.boardBasis && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                      {rate.boardBasis.description}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {rate.includes?.join(", ") || "No inclusions specified"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-800">
                                ₹{rate.baseRate.toFixed(2)}
                                  <span className="text-xs font-normal text-gray-500 ml-1">
                                    per night
                                  </span>
                                </p>
                                <p className="text-sm text-gray-600">
                                  Total: ₹{rate.totalRate.toFixed(2)}
                                </p>
                                <button
                                  className="mt-2 bg-yellow hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg text-sm"
                                  onClick={() =>
                                    handlePriceOpenModal(
                                      roomGroup,
                                      rate,
                                      roomGroup.recommendationIds[0]
                                    )
                                  }
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No rooms available for the selected dates</p>
            </div>
          )}
        </div>
      </div>

      {/* Room Details Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl w-11/12 sm:w-1/1 lg:w-2/3 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 flex items-center justify-between border-b-2 sticky top-0 bg-white z-10">
              <p className="font-semibold">
                {selectedRoom?.room?.name || "Room Details"}
              </p>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-full"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Room Features</h3>
                  <ul className="space-y-2">
                    {selectedRoom?.room?.facilities?.map((facility, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Image
                          src="/icons/dot.png"
                          width={16}
                          height={16}
                          alt="Bullet point"
                          className="mt-1"
                        />
                        <span>{facility.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Room Description</h3>
                  <p className="text-gray-600">
                    {selectedRoom?.room?.description || "No description available"}
                  </p>
                  {selectedRoom?.room?.beds?.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium">Bed Configuration:</h4>
                      <ul className="list-disc list-inside ml-2">
                        {selectedRoom.room.beds.map((bed, idx) => (
                          <li key={idx}>
                            {bed.count} {bed.type}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {isModalOpenImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsModalOpenImg(false)}
        >
          <div
            className="relative bg-white p-4 rounded-lg w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 p-2 rounded-full"
              onClick={() => setIsModalOpenImg(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {standardImages?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => openImageViewer(index)}
                  className="relative h-40 w-full cursor-pointer"
                >
                  <Image
                    src={image.url || "/hotels/default.jpg"}
                    alt={`Hotel Image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Viewer */}
      {isImageViewerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={closeImageViewer}
          >
            <FaTimes />
          </button>

          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-5xl z-10"
            onClick={goToPrevious}
          >
            &lt;
          </button>

          <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center">
            <Image
              src={standardImages[currentImageIndex].url}
              alt="Full Size Hotel Image"
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-5xl z-10"
            onClick={goToNext}
          >
            &gt;
          </button>
        </div>
      )}

      {/* Price/Rate Modal */}
      <PriceRateModal
        isOpen={isPriceRateModal}
        onClose={handlePriceCloseModal}
        selectedRoom={selectedRoom}
        hotelDetailsInfo={hotelDetails}
        checkIn={checkInDate}
        checkOut={checkOutDate}
        roomLength={roomCount}
        roomPax={roomPax}
        recommendationsId={recommendationsId}
        searchToken={searchToken}
      />
    </div>
  );
}