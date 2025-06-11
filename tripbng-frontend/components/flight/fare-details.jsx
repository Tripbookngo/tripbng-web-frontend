"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import moment from "moment";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { motion } from "framer-motion";

export default function FAREDETAILS({ flightData, closeModal }) {
  const router = useRouter();
  const { onward, return: returnFlight } = flightData;
  console.log(onward);
  const [visibleCards, setVisibleCards] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [originName, setOriginName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [selectedType, setSelectedType] = useState("onward");
  const [selectedOnward, setSelectedOnward] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [searchKey, setSearchKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedFareId, setClickedFareId] = useState(null);
  console.log("selectedOnward", selectedOnward);

  const [direction, setDirection] = useState("left");

  console.log("selectedOnward", selectedOnward);
  console.log("selectedReturn", selectedReturn);

  const handleTabChange = (type) => {
    if (type === selectedType) return;
    setDirection(type === "return" ? 1 : -1); // right or left
    setSelectedType(type);
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      position: "absolute",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
      transition: { duration: 0.3 },
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      position: "absolute",
      transition: { duration: 0.3 },
    }),
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = localStorage.getItem("searchKey");
      setSearchKey(key);
    }
  }, []);

  // const toatlFare =
  //   selectedOnward?.FareDetails[0].Total_Amount +
  //   selectedReturn?.FareDetails[0].Total_Amount;
  const toatlFare = 5000 + 5000;

  useEffect(() => {
    if (onward?.Amount && onward.Amount.length > 0 && !selectedOnward) {
      setSelectedOnward(onward.Amount[0]);
    }

    if (
      returnFlight?.Amount &&
      returnFlight.Amount.length > 0 &&
      !selectedReturn
    ) {
      setSelectedReturn(returnFlight.Amount[0]);
    }
  }, [onward, returnFlight]);

  const updateVisibleCards = () => {
    const width = window.innerWidth;
    if (width < 640) {
      setVisibleCards(1); // Mobile screens
    } else if (width >= 640 && width < 1024) {
      setVisibleCards(2); // Tablet screens
    } else {
      setVisibleCards(3); // Desktop screens
    }
  };

  useEffect(() => {
    updateVisibleCards(); // Set initial value
    window.addEventListener("resize", updateVisibleCards); // Update on resize

    return () => {
      window.removeEventListener("resize", updateVisibleCards); // Cleanup listener
    };
  }, []);
  const cardWidth = 100 / visibleCards;
  const cards = [1, 2, 3, 4, 5];

  const formattedDate = moment(flightData?.TDate).format("ddd, DD MMM YY");

  useEffect(() => {
    const storedTrip = localStorage.getItem("selectedTrip");
    if (storedTrip) {
      const parsedTrip = JSON.parse(storedTrip);

      setOriginName(parsedTrip.origin.municipality);
      setDestinationName(parsedTrip.destination.municipality);
    }
  }, []);

  const handleNext = () => {
    if (currentIndex < cards.length - visibleCards) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      setDeltaX(e.touches[0].clientX - startX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (deltaX > 50 && currentIndex > 0) {
      handlePrev();
    } else if (deltaX < -50 && currentIndex < cards.length - visibleCards) {
      handleNext();
    }
    setDeltaX(0);
  };
  const productClassNames = {
    TT: "Economy Value",
    Y: "Economy",
    PE: "Premium Economy",
    C: "Business Class",
    F: "First Class",
    J: "Business Flex",
  };

  const handleCheckReturnSelected = () => {
    if (selectedType === "return") {
      handleBookNow();
    } else {
      setSelectedType("return");
    }
  };

  const handleBookNow = async (fareID) => {
    setIsLoading(true);
    setClickedFareId(fareID);
    try {
      const isReturn = Boolean(returnFlight);

      const airRepriceRequests = isReturn
        ? [
            {
              Flight_Key: onward?.Additional2?.FlightKey,
              Fare_Id: selectedOnward?.Fare_Id,
            },
            {
              Flight_Key: returnFlight?.Additional2?.FlightKey,
              Fare_Id: selectedReturn?.Fare_Id,
            },
          ]
        : [
            {
              Flight_Key: onward?.Additional2.FlightKey,
              Fare_Id: fareID,
            },
          ];
      const response = await apiService.post("flight/reprice", {
        ApiNo: onward.ApiNo,
        Api1Data: {
          Search_Key: searchKey,
          AirRepriceRequests: airRepriceRequests,
          Customer_Mobile: "63551335405",
          GST_Input: false,
          SinglePricing: true,
        },
        Api2Data: {
          id: isReturn
            ? [selectedOnward?.id || fareID, selectedReturn?.id]
            : [fareID || selectedOnward?.id],
        },
      });

      if (response.status === 200) {
        const API1 = response.data?.data?.AirRepriceResponses;
        const API2 = response.data?.data?.tripInfos;

        console.log("API1", API1);
        console.log("API2", API2);

        localStorage.setItem("repriceData", JSON.stringify(response));

        let checkoutUrl = "";

        const isRoundTripAPI1 = API1?.length > 1 && API1[1]?.Flight;
        const isRoundTripAPI2 = API2?.length > 1;

        if (onward.ApiNo === 1) {
          const onwardFlight = API1?.[0]?.Flight;
          const onwardFareId = onwardFlight?.Fares?.[0]?.Fare_Id;
          const onwardFlightId = onwardFlight?.Flight_Id;
          const onwardFlightKey = onwardFlight?.Flight_Key;

          if (!onwardFareId || !onwardFlightId) {
            console.warn("Missing onward flight data");
            return;
          }

          localStorage.setItem("ofk", onwardFlightKey || "");

          if (isRoundTripAPI1) {
            const returnFlight = API1[1]?.Flight;
            const returnFareId = returnFlight?.Fares?.[0]?.Fare_Id;
            const returnFlightId = returnFlight?.Flight_Id;
            const returnFlightKey = returnFlight?.Flight_Key;

            if (!returnFareId || !returnFlightId) {
              console.warn("Missing return flight data");
              return;
            }

            localStorage.setItem("rfk", returnFlightKey || "");

            checkoutUrl = `/flight-search/checkout?of=${onwardFareId}&ofid=${onwardFlightId}&rf=${returnFareId}&rfid=${returnFlightId}`;
          } else {
            checkoutUrl = `/flight-search/checkout?of=${onwardFareId}&ofid=${onwardFlightId}`;
          }
        }

        if (onward.ApiNo === 2) {
          if (isRoundTripAPI2) {
            checkoutUrl = `/flight-search/checkout?onwardId=${selectedOnward?.id}&returnId=${selectedReturn?.id}`;
          } else {
            checkoutUrl = `/flight-search/checkout?onwardId=${selectedOnward?.id}`;
          }
        }

        console.log("Final checkout URL:", checkoutUrl);

        if (checkoutUrl) {
          router.push(checkoutUrl);
        } else {
          console.warn("Checkout URL not formed, navigation skipped.");
        }
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
      setClickedFareId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      onClick={closeModal}
    >
      {onward?.Amount.length > 0 && !returnFlight?.Amount.length > 0 && (
        <div
          className="bg-white rounded-xl md:w-9/12 w-full overflow-hidden mx-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-lg text-yellow font-semibold">
                {/* {flightData?.Amount.length} FARE OPTIONS */}
                {onward?.Amount.length > 0 && returnFlight?.Amount.length > 0
                  ? "MORE FARE OPTIONS"
                  : `${onward?.Amount.length} FARE OPTIONS `}
              </h1>
              <h2 className="text-sm sm:text-lg font-semibold">
                available for your trip.
              </h2>
            </div>

            <button
              onClick={closeModal}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-full"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">
                {originName} → {destinationName}
              </h2>
              <h2 className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">
                {onward.AirlineName} · {formattedDate} · Departure at{" "}
                {onward.ApiNo === 1
                  ? onward.Origin.DepartTime.split(" ")[1]
                  : onward?.Additional1?.sagment?.[0]?.dt?.split("T")[1]}{" "}
                - Arrival at{" "}
                {onward.ApiNo === 1
                  ? onward.Destination.ArrivalTime.split(" ")[1]
                  : onward.Additional1.sagment[
                      onward.Additional1.sagment.length - 1
                    ]?.at.split("T")[1]}
              </h2>
            </div>

            <div className="flex items-center justify-center gap-4 mt-3 overflow-hidden relative">
              <div
                className="flex transition-transform duration-300 md:p-4 md:gap-3 gap-1"
                style={{
                  transform: `translateX(calc(-${
                    currentIndex * (100 / visibleCards)
                  }% + ${deltaX}px))`,
                  width: `calc(${cardWidth}% * ${visibleCards})`,
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={(e) => {
                  setIsDragging(true);
                  setStartX(e.clientX);
                }}
                onMouseMove={(e) => {
                  if (isDragging) {
                    setDeltaX(e.clientX - startX);
                  }
                }}
                onMouseUp={() => {
                  setIsDragging(false);
                  if (deltaX > 50 && currentIndex > 0) {
                    handlePrev();
                  } else if (
                    deltaX < -50 &&
                    currentIndex < cards.length - visibleCards
                  ) {
                    handleNext();
                  }
                  setDeltaX(0);
                }}
                onMouseLeave={() => setIsDragging(false)}
              >
                {onward?.Amount.map((fare, index) => {
                  // Support for both API structures
                  const fareDetails =
                    fare.FareDetails?.[0] ||
                    (fare.fd?.ADULT && {
                      Total_Amount: fare.fd.ADULT.fC.TF,
                      ProductClass: fare.fareIdentifier || "ECONOMY",
                      Free_Baggage: {
                        Hand_Baggage: fare.fd.ADULT.bI?.cB || "0",
                        Check_In_Baggage: fare.fd.ADULT.bI?.iB || "0",
                      },
                      Refundable: fare.fd.ADULT.rT === 1,
                    });

                  if (!fareDetails) return null;

                  return (
                    <div
                      key={index}
                      className="flex-shrink-0 border rounded-md shadow-md bg-white "
                      style={{
                        width: `calc(100% / ${visibleCards})`,
                      }}
                    >
                      <div className="p-4">
                        <div className="flex items-baseline gap-1">
                          <h1 className="text-black text-xl font-semibold">
                            ₹{fareDetails.Total_Amount}
                          </h1>
                          <p className="text-sm text-gray-500 font-medium">
                            per adult
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                          {fareDetails.ProductClass}
                        </p>
                      </div>
                      <div className="border-b-2"></div>
                      <div className="p-4">
                        <div className="mb-5">
                          <h4 className="text-sm font-medium text-black">
                            Baggage
                          </h4>
                          <ul className="mt-2">
                            <li className="flex items-center gap-2">
                              <Image
                                className="w-5"
                                src="/icons/mark.png"
                                alt=""
                                width={100}
                                height={100}
                              />
                              <span className="text-sm font-light text-black">
                                {fareDetails.Free_Baggage.Hand_Baggage} cabin
                                baggage
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Image
                                className="w-5"
                                src="/icons/mark.png"
                                alt="Flight"
                                width={100}
                                height={100}
                              />
                              <span className="text-sm font-light text-black">
                                {fareDetails.Free_Baggage.Check_In_Baggage}{" "}
                                check-in baggage
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="mb-5">
                          <h4 className="text-sm font-medium text-black">
                            Flexibility
                          </h4>
                          <ul className="mt-2">
                            <li className="flex items-center gap-2">
                              <Image
                                className="w-5"
                                src="/icons/minus.png"
                                alt="Flight"
                                width={100}
                                height={100}
                              />
                              <span className="text-sm font-light text-black">
                                {fareDetails.Refundable
                                  ? "Free cancellation available"
                                  : "Non-refundable (Cancellation fee applies)"}
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-10">
                          <button
                            className="bg-yellow text-white font-medium py-1 px-4 rounded-[20px] shadow-[0_4px_8px_rgba(0,0,0,0.1)] min-w-[100px] h-[40px] flex items-center justify-center"
                            onClick={() =>
                              handleBookNow(fare.Fare_Id || fare.id || "")
                            }
                          >
                            {clickedFareId ===
                            (fare.Fare_Id || fare.id || "") ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin font-semibold"></div>
                            ) : (
                              <span className="font-semibold">Book Now</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handlePrev}
                className={`absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full ${
                  currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentIndex === 0}
              >
                &lt;
              </button>
              <button
                onClick={handleNext}
                className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full ${
                  currentIndex >= cards.length - visibleCards
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentIndex >= cards.length - visibleCards}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
      {onward?.Amount.length > 0 && returnFlight?.Amount.length > 0 && (
        <div
          className="bg-white rounded-xl md:w-9/12 w-full overflow-hidden mx-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className=" mb-4  shadow-lg">
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-lg text-yellow font-semibold">
                  {onward?.Amount.length > 0 && returnFlight?.Amount.length > 0
                    ? "MORE FARE OPTIONS"
                    : `${onward?.Amount.length} FARE OPTIONS `}
                </h1>
                <h2 className="text-sm sm:text-lg font-semibold">
                  available for your round trip.
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-full"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center justify-center font-semibold text-lg">
              <button
                className={`w-1/2 py-3 border-b-4 transition-all duration-200 ${
                  selectedType === "onward"
                    ? "border-blue text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
                onClick={() => handleTabChange("onward")}
              >
                ONWARD
              </button>
              <button
                className={`w-1/2 py-3 border-b-4 transition-all duration-200 ${
                  selectedType === "return"
                    ? "border-blue text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
                onClick={() => handleTabChange("return")}
              >
                RETURN
              </button>
            </div>
          </div>
          <motion.div
            key={selectedType}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full"
          >
            {selectedType === "onward" ? (
              <div className="p-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">
                    {originName} → {destinationName}
                  </h2>
                  <h2 className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">
                    {onward.AirlineName} · {formattedDate} · Departure at{" "}
                    {onward.ApiNo === 1
                      ? onward.Origin.DepartTime.split(" ")[1]
                      : onward?.Additional1?.sagment?.[0]?.dt?.split(
                          "T"
                        )[1]}{" "}
                    - Arrival at{" "}
                    {onward.ApiNo === 1
                      ? onward.Destination.ArrivalTime.split(" ")[1]
                      : onward.Additional1.sagment[
                          onward.Additional1.sagment.length - 1
                        ]?.at.split("T")[1]}
                  </h2>
                </div>

                <div className="flex items-center justify-center gap-4 mt-3 overflow-hidden relative">
                  <div
                    className="flex transition-transform duration-300 md:p-4 md:gap-3"
                    style={{
                      transform: `translateX(calc(-${
                        currentIndex * (100 / visibleCards)
                      }% + ${deltaX}px))`,
                      width: `calc(${cardWidth}% * ${visibleCards})`,
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={(e) => {
                      setIsDragging(true);
                      setStartX(e.clientX);
                    }}
                    onMouseMove={(e) => {
                      if (isDragging) {
                        setDeltaX(e.clientX - startX);
                      }
                    }}
                    onMouseUp={() => {
                      setIsDragging(false);
                      if (deltaX > 50 && currentIndex > 0) {
                        handlePrev();
                      } else if (
                        deltaX < -50 &&
                        currentIndex < cards.length - visibleCards
                      ) {
                        handleNext();
                      }
                      setDeltaX(0);
                    }}
                    onMouseLeave={() => setIsDragging(false)}
                  >
                    {onward?.Amount.map((fare, index) => {
                      const fareDetails =
                        fare.FareDetails?.[0] ||
                        (fare.fd?.ADULT && {
                          Total_Amount: fare.fd.ADULT.fC.TF,
                          ProductClass: fare.fareIdentifier || "ECONOMY",
                          Free_Baggage: {
                            Hand_Baggage: fare.fd.ADULT.bI?.cB || "0",
                            Check_In_Baggage: fare.fd.ADULT.bI?.iB || "0",
                          },
                          Refundable: fare.fd.ADULT.rT === 1,
                        });

                      if (!fareDetails) return null;
                      console.log("fareDetails", fare);

                      const isSelected =
                        (selectedOnward?.Fare_Id &&
                          selectedOnward?.Fare_Id === fare?.Fare_Id) ||
                        (selectedOnward?.id &&
                          selectedOnward?.id === fare?.Fare_Id) ||
                        (selectedOnward?.Fare_Id &&
                          selectedOnward?.Fare_Id === fare?.id) ||
                        (selectedOnward?.id && selectedOnward?.id === fare?.id);

                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedOnward(fare)} // Single-click anywhere
                          className={`flex-shrink-0 border rounded-md shadow-md bg-white cursor-pointer ${
                            isSelected ? "border-2 border-blue" : ""
                          }`}
                          style={{
                            width: `calc(100% / ${visibleCards})`,
                          }}
                        >
                          <div className="flex items-start gap-3 p-4">
                            <input
                              type="radio"
                              name="onward"
                              checked={isSelected}
                              readOnly // control purely by state
                              className="accent-yellow-500 w-5 h-5"
                            />

                            <div>
                              <div className="flex items-baseline gap-1">
                                <h1 className="text-black text-xl font-semibold">
                                  ₹{fareDetails.Total_Amount}
                                </h1>
                                <p className="text-sm text-gray-500 font-medium">
                                  per adult
                                </p>
                              </div>
                              <p className="text-sm text-gray-500 font-medium">
                                {fare.ProductClass} VALUE
                              </p>
                            </div>
                          </div>

                          <div className="border-b-2"></div>

                          <div className="p-4">
                            <div className="mb-5">
                              <h4 className="text-sm font-medium text-black">
                                Baggage
                              </h4>
                              <ul className="mt-2">
                                <li className="flex items-center gap-2">
                                  <Image
                                    className="w-5"
                                    src="/icons/mark.png"
                                    alt=""
                                    width={100}
                                    height={100}
                                  />
                                  <span className="text-sm font-light text-black">
                                    {fareDetails.Free_Baggage.Hand_Baggage}{" "}
                                    cabin baggage
                                  </span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <Image
                                    className="w-5"
                                    src="/icons/mark.png"
                                    alt="Flight"
                                    width={100}
                                    height={100}
                                  />
                                  <span className="text-sm font-light text-black">
                                    {fareDetails.Free_Baggage.Check_In_Baggage}{" "}
                                    check-in baggage
                                  </span>
                                </li>
                              </ul>
                            </div>
                            <div className="mb-5">
                              <h4 className="text-sm font-medium text-black">
                                Flexibility
                              </h4>
                              <ul className="mt-2">
                                <li className="flex items-center gap-2">
                                  <Image
                                    className="w-5"
                                    src="/icons/minus.png"
                                    alt="Flight"
                                    width={100}
                                    height={100}
                                  />
                                  <span className="text-sm font-light text-black">
                                    {fare.Refundable
                                      ? "Free cancellation available"
                                      : "Non-refundable (Cancellation fee applies)"}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={handlePrev}
                    className={`absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full ${
                      currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={currentIndex === 0}
                  >
                    &lt;
                  </button>
                  <button
                    onClick={handleNext}
                    className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full ${
                      currentIndex >= cards.length - visibleCards
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={currentIndex >= cards.length - visibleCards}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">
                    {destinationName} → {originName}
                  </h2>
                  <h2 className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">
                    {returnFlight.AirlineName} · {formattedDate} · Departure at{" "}
                    {returnFlight.ApiNo === 1
                      ? returnFlight.Origin.DepartTime.split(" ")[1]
                      : returnFlight?.Additional1?.sagment?.[0]?.dt?.split(
                          "T"
                        )[1]}{" "}
                    - Arrival at{" "}
                    {returnFlight.ApiNo === 1
                      ? returnFlight.Destination.ArrivalTime.split(" ")[1]
                      : returnFlight.Additional1.sagment[
                          returnFlight.Additional1.sagment.length - 1
                        ]?.at.split("T")[1]}
                  </h2>
                </div>

                <div className="flex items-center justify-center gap-4 mt-3 overflow-hidden relative">
                  <div
                    className="flex transition-transform duration-300 md:p-4 md:gap-3"
                    style={{
                      transform: `translateX(calc(-${
                        currentIndex * (100 / visibleCards)
                      }% + ${deltaX}px))`,
                      width: `calc(${cardWidth}% * ${visibleCards})`,
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={(e) => {
                      setIsDragging(true);
                      setStartX(e.clientX);
                    }}
                    onMouseMove={(e) => {
                      if (isDragging) {
                        setDeltaX(e.clientX - startX);
                      }
                    }}
                    onMouseUp={() => {
                      setIsDragging(false);
                      if (deltaX > 50 && currentIndex > 0) {
                        handlePrev();
                      } else if (
                        deltaX < -50 &&
                        currentIndex < cards.length - visibleCards
                      ) {
                        handleNext();
                      }
                      setDeltaX(0);
                    }}
                    onMouseLeave={() => setIsDragging(false)}
                  >
                    {returnFlight?.Amount.map((fare, index) => {
                      const fareDetails =
                        fare.FareDetails?.[0] ||
                        (fare.fd?.ADULT && {
                          Total_Amount: fare.fd.ADULT.fC.TF,
                          ProductClass: fare.fareIdentifier || "ECONOMY",
                          Free_Baggage: {
                            Hand_Baggage: fare.fd.ADULT.bI?.cB || "0",
                            Check_In_Baggage: fare.fd.ADULT.bI?.iB || "0",
                          },
                          Refundable: fare.fd.ADULT.rT === 1,
                        });

                      if (!fareDetails) return null;
                      const isSelected =
                        (selectedReturn?.Fare_Id &&
                          selectedReturn?.Fare_Id === fare?.Fare_Id) ||
                        (selectedReturn?.id &&
                          selectedReturn?.id === fare?.Fare_Id) ||
                        (selectedReturn?.Fare_Id &&
                          selectedReturn?.Fare_Id === fare?.id) ||
                        (selectedReturn?.id && selectedReturn?.id === fare?.id);

                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedReturn(fare)} // Single-click anywhere
                          className={`flex-shrink-0 border rounded-md shadow-md bg-white cursor-pointer ${
                            isSelected ? "border-2 border-blue" : ""
                          }`}
                          style={{
                            width: `calc(100% / ${visibleCards})`,
                          }}
                        >
                          <div className="flex items-start gap-3 p-4">
                            <input
                              type="radio"
                              name="return"
                              checked={isSelected}
                              readOnly // control purely by state
                              className="accent-yellow-500 w-5 h-5"
                            />

                            <div>
                              <div className="flex items-baseline gap-1">
                                <h1 className="text-black text-xl font-semibold">
                                  ₹{fareDetails.Total_Amount}
                                </h1>
                                <p className="text-sm text-gray-500 font-medium">
                                  per adult
                                </p>
                              </div>
                              <p className="text-sm text-gray-500 font-medium">
                                {fare.ProductClass} VALUE
                              </p>
                            </div>
                          </div>

                          <div className="border-b-2"></div>

                          <div className="p-4">
                            <div className="mb-5">
                              <h4 className="text-sm font-medium text-black">
                                Baggage
                              </h4>
                              <ul className="mt-2">
                                <li className="flex items-center gap-2">
                                  <Image
                                    className="w-5"
                                    src="/icons/mark.png"
                                    alt=""
                                    width={100}
                                    height={100}
                                  />
                                  <span className="text-sm font-light text-black">
                                    {fareDetails.Free_Baggage.Hand_Baggage}{" "}
                                    cabin baggage
                                  </span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <Image
                                    className="w-5"
                                    src="/icons/mark.png"
                                    alt="Flight"
                                    width={100}
                                    height={100}
                                  />
                                  <span className="text-sm font-light text-black">
                                    {fareDetails.Free_Baggage.Check_In_Baggage}{" "}
                                    check-in baggage
                                  </span>
                                </li>
                              </ul>
                            </div>
                            <div className="mb-5">
                              <h4 className="text-sm font-medium text-black">
                                Flexibility
                              </h4>
                              <ul className="mt-2">
                                <li className="flex items-center gap-2">
                                  <Image
                                    className="w-5"
                                    src="/icons/minus.png"
                                    alt="Flight"
                                    width={100}
                                    height={100}
                                  />
                                  <span className="text-sm font-light text-black">
                                    {fare.Refundable
                                      ? "Free cancellation available"
                                      : "Non-refundable (Cancellation fee applies)"}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={handlePrev}
                    className={`absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full ${
                      currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={currentIndex === 0}
                  >
                    &lt;
                  </button>
                  <button
                    onClick={handleNext}
                    className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full ${
                      currentIndex >= cards.length - visibleCards
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={currentIndex >= cards.length - visibleCards}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          <div className="relative bg-white shadow-md">
            <div className="absolute -top-2 left-0 w-full h-2 shadow-md z-10 rounded-t-md pointer-events-none"></div>

            <div className="p-4 flex items-center justify-end gap-3">
              <div className="flex flex-col items-end">
                <h2 className="text-xl font-semibold">
                  ₹ {toatlFare.toLocaleString("en-IN")}
                </h2>
                <p className="text-sm text-gray font-medium">
                  ROUNDTRIP FOR 1 ADULT
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="bg-yellow text-white font-semibold rounded-full py-1 px-3"
                  onClick={() => {
                    handleCheckReturnSelected();
                  }}
                >
                  BOOK NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
