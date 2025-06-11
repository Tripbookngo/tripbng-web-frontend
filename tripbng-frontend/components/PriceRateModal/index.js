import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/apiServiceHotel";

const PriceRateModal = ({
  isOpen,
  onClose,
  selectedRoom,
  hotelDetailsInfo,
  checkIn,
  checkOut,
  roomPax,
  recommendationsId,
  searchToken,
}) => {
  const router = useRouter();
  if (
    !isOpen ||
    !selectedRoom ||
    !hotelDetailsInfo ||
    !recommendationsId ||
    !searchToken
  ) {
    return null;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { address } = hotelDetailsInfo.contact || {};
  const formattedAddress = address
    ? `${address.line1}, ${address.city?.name}, ${address.state?.name}, ${address.country?.name}, ${address.postalCode}`
    : "Address not available";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  useEffect(() => {
    if (isOpen) {
      priceRecommendation();
    }
  }, [isOpen]);

  const priceRecommendation = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const hotelId = hotelDetailsInfo?.id;
      if (!hotelId) {
        throw new Error("Hotel ID is missing");
      }

      const response = await apiGet(`hotel/${hotelId}/${searchToken}/price/recommendation/${recommendationsId}`);

      if (response.status === 200) {
        setSuccessMessage("Congratulations! Your selection is available.");
        localStorage.setItem("checkoutData", JSON.stringify(response.data));

        setTimeout(() => {
          router.push(`/hotels/hotel-checkout`);
        }, 2000);
      } else {
        setErrorMessage(`Error: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          `Error: ${error.response.status} - ${
            error.response.data?.message || "Something went wrong"
          }`
        );
      } else if (error.request) {
        setErrorMessage("No response from server. Please check your network.");
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-4 sm:p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        className="absolute top-3 right-4 text-gray-600 hover:text-gray-900 text-2xl"
        onClick={onClose}
      >
        ✕
      </button>
  
      {/* Loading or Success */}
      {isLoading ? (
        <p className="my-5 text-center font-medium text-blue-500">
          Checking price and availability...
        </p>
      ) : (
        <div className="my-5">
          <div className="flex items-center justify-center gap-3 bg-yellow py-2 rounded-md">
            <Image
              src="/icons/checked.png"
              className="w-5 h-5"
              width={100}
              height={100}
              alt="Checked Icon"
            />
            <p className="text-center font-medium text-white">
              {successMessage}
            </p>
          </div>
          <p className="text-center text-sm mt-2">
            Redirecting you to the payment page...
          </p>
        </div>
      )}
  
      {errorMessage && (
        <p className="text-red-600 text-center text-sm">{errorMessage}</p>
      )}
  
      {/* Hotel Info */}
      <div className="flex flex-col sm:flex-row sm:space-x-6 mt-4 space-y-4 sm:space-y-0">
        {/* Hotel Image */}
        {hotelDetailsInfo?.images?.[0]?.links?.find(
          (link) => link.size === "Standard"
        )?.url && (
          <div className="w-full sm:w-1/3">
            <Image
              src={
                hotelDetailsInfo.images[0].links.find(
                  (link) => link.size === "Standard"
                ).url
              }
              className="h-40 w-full rounded-lg object-cover"
              width={300}
              height={200}
              alt="Hotel Image"
              unoptimized
            />
          </div>
        )}
  
        {/* Hotel Content */}
        <div className="w-full sm:w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
              {hotelDetailsInfo.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{formattedAddress}</p>
  
            <div className="border-b my-2"></div>
  
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-700 text-sm">Room: {selectedRoom?.room?.name}</p>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  ₹{selectedRoom.rates[0].totalRate}
                </p>
                <p className="text-gray-500 text-sm">Per Night</p>
              </div>
            </div>
  
            <div className="border-b mt-2"></div>
          </div>
        </div>
      </div>
  
      {/* Check-In / Check-Out */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 mt-4 text-sm">
        <p>
          <strong>Check-In:</strong> {formatDate(checkIn)}
        </p>
        <p>
          <strong>Check-Out:</strong> {formatDate(checkOut)}
        </p>
      </div>
  
      <div className="border-b mt-3 mb-3"></div>
  
      {/* Guest & Room Info */}
      <div className="space-y-2 text-sm">
        {roomPax.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
            <p>
              <strong>Guests:</strong> {item.adults} Adults, {item.children} Children
            </p>
            <p>
              <strong>Room {index + 1}:</strong> {selectedRoom?.room?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
  
  );
};

export default PriceRateModal;
