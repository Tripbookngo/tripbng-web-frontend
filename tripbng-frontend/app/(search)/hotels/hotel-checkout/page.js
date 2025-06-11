"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Simmer from "@/components/layout/simmer";
import axios from "axios";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { apiPost } from "@/lib/apiServiceHotel";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const [checkoutData, setCheckoutData] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [roomCount, setRoomCount] = useState(null);
  const [roomPax, setRoomPax] = useState([]);
  const [formData, setFormData] = useState([]);
  const [errors, setErrors] = useState({});
  const [billingContact, setBillingContact] = useState({
    title: "Mr",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  console.log(checkoutData);

  useEffect(() => {
    const checkIn = localStorage.getItem("checkIn");
    const checkOut = localStorage.getItem("checkOut");
    const storedRoomPax = localStorage.getItem("roomPax");

    if (checkIn) setCheckInDate(dayjs(checkIn).format("DD MMM YYYY"));
    if (checkOut) setCheckOutDate(dayjs(checkOut).format("DD MMM YYYY"));

    try {
      if (
        storedRoomPax &&
        checkoutData?.hotel?.rooms &&
        checkoutData?.hotel?.rates
      ) {
        const parsedRoomPax = JSON.parse(storedRoomPax);
        setRoomPax(parsedRoomPax);

        setFormData(
          parsedRoomPax.map((room, index) => ({
            roomid: checkoutData.hotel.rooms[index]?.id || `room-${index + 1}`, // Dynamically use room ID
            rateid: checkoutData.hotel.rates[index]?.id || `rate-${index + 1}`, // Dynamically use rate ID
            guests: Array.from({ length: room.adults }, () => ({
              type: "Adult",
              title: "Mr",
              firstname: "",
              lastname: "",
              age: 25,
              email: "",
            })).concat(
              Array.from({ length: room.children }, () => ({
                type: "Child",
                firstname: "",
                lastname: "",
                age: "",
                email: "",
              }))
            ),
          }))
        );
      }
    } catch (error) {
      console.error("Error parsing roomPax from localStorage:", error);
    }
  }, [checkoutData]); // Depend on checkoutData to update when available

  console.log(formData);

  const handleInputChange = (roomIndex, guestIndex, field, value) => {
    setFormData((prev) =>
      prev.map((room, rIdx) =>
        rIdx === roomIndex
          ? {
              ...room,
              guests: room.guests.map((guest, gIdx) =>
                gIdx === guestIndex ? { ...guest, [field]: value } : guest
              ),
            }
          : room
      )
    );
  };
  const validateForm = () => {
    let newErrors = {};
    formData.forEach((room, roomIndex) => {
      room.guests.forEach((guest, guestIndex) => {
        if (!guest.firstname || !guest.lastname) {
          newErrors[`${roomIndex}-${guestIndex}`] =
            "First and last name are required";
        }
        if (guest.type === "Adult" && !guest.email.includes("@")) {
          newErrors[`${roomIndex}-${guestIndex}-email`] =
            "Valid email required";
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const rate = checkoutData?.hotel?.rates?.[0]; // Get the first rate entry
  const roomName =
    checkoutData?.hotel?.rooms?.find(
      (r) => r.id === rate?.occupancies?.[0]?.roomId
    )?.name || "Premier Double or Twin Room";
  const roomPrice = rate?.baseRate || 0;
  const totalPrice = rate?.totalRate || 0;
  const taxes = rate?.taxes?.reduce((acc, tax) => acc + tax.amount, 0) || 0;
  const currency = rate?.currency || "USD";
  const refundability = rate?.refundable ? "Refundable" : "Non-refundable";

  useEffect(() => {
    const checkIn = localStorage.getItem("checkIn");
    const checkOut = localStorage.getItem("checkOut");
    const roomLength = localStorage.getItem("roomLength");
    const storedRoomPax = localStorage.getItem("roomPax");

    if (checkIn) setCheckInDate(dayjs(checkIn).format("DD MMM YYYY"));
    if (checkOut) setCheckOutDate(dayjs(checkOut).format("DD MMM YYYY"));
    if (roomLength) setRoomCount(roomLength);

    try {
      if (storedRoomPax) setRoomPax(JSON.parse(storedRoomPax));
    } catch (error) {
      console.error("Error parsing roomPax from localStorage:", error);
      setRoomPax([]);
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("checkoutData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setCheckoutData(parsedData);
      fetchHotelDetails(parsedData?.hotel?.id);
    }
  }, []);
  const handleBillingContactChange = (field, value) => {
    if (field.includes("address.")) {
      const addressField = field.split("address.")[1];
      setBillingContact((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setBillingContact((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  const fetchHotelDetails = async (hotelId) => {
    try {
      const response = await axios.post(
        "https://nexus.prod.zentrumhub.com/api/content/hotelcontent/getHotelContent",
        {
          channelId: "tripbng-ratehawklive-channel",
          hotelIds: [hotelId],
          culture: "en-US",
          contentFields: ["Basic"],
        },
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "customer-ip": "122.170.186.146",
            correlationId: "58497bbd-8c3c-72e3-c981-46825d71b261",
            accountId: "tripbng-live-account",
            apiKey: "bc46745f-8af7-473a-aeba-c6ce4efa18e5",
          },
        }
      );

      if (response.status === 200) {
        setHotelDetails(response.data.hotels[0]);
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
    }
  };

  const generateBookingRefId = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleBooking = async () => {
    if (!validateForm()) {
      console.log("Validation failed", errors);
      return;
    }

    try {
      if (!checkoutData) {
        console.log("Missing checkout data");
        return;
      }

      const bookingRefId = generateBookingRefId();
      const correlationId = localStorage.getItem("correlationId");

      if (!correlationId) {
        console.log(
          "Error: Missing correlationId. Please restart your search."
        );
        return;
      }
      const billingContactData = {
        ...billingContact,
        contact: {
          phone: billingContact.phone,
          address: {
            line1: billingContact.address.line1,
            line2: billingContact.address.line2,
            city: {
              name: billingContact.address.city,
              code: "",
            },
            state: {
              name: billingContact.address.state,
              code: "",
            },
            country: {
              name: billingContact.address.country,
              code: "",
            },
            postalCode: billingContact.address.postalCode,
          },
          email: billingContact.email,
        },
      };
      const response = await apiPost(
        `hotel/${checkoutData.hotel.id}/${checkoutData.token}/book`,
        {
          rateIds: checkoutData.hotel.rates.map((rate) => rate.id),
          bookingRefId,
          specialRequests: ["Need an early check-in"],
          roomsAllocations: formData,
          billingContact: billingContactData
        }
      );

      if (response.status === 200) {
        console.log("Booking successful", response.data);
        // localStorage.removeItem("correlationId");
      } else {
        console.error("Booking failed:", response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error("Booking failed. Response data:", error.response.data);
        console.error("Status Code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Error during booking request:", error.message);
      }
    }
  };

  // const handleBooking = async () => {
  //   try {
  //     const headers = {
  //       "Content-Type": "application/json; charset=utf-8",
  //       "Accept-Encoding": "gzip, deflate",
  //       accountId: "tripbng-live-account",
  //       "customer-ip": "27.57.180.167",
  //       // correlationId: "95fb5510-3ed2-410f-ba6e-20be5cd59dec",
  //       apiKey: "bc46745f-8af7-473a-aeba-c6ce4efa18e5",
  //     };

  //     const body = {
  //       rateIds: ["2a97281e-4522-49fd-a0fe-79b3d93ec415"],
  //       bookingRefId: "12asdassdadadada4f",
  //       specialRequests: ["Need an early check-in"],
  //       roomsAllocations: [
  //         {
  //           roomid: "b023ea45-d410-4d4c-8915-c86264c599b9",
  //           rateid: "2a97281e-4522-49fd-a0fe-79b3d93ec415",
  //           guests: [
  //             {
  //               type: "Adult",
  //               title: "Mr",
  //               firstname: "John",
  //               lastname: "Doe",
  //               age: 25,
  //               email: "john.doe@mail.com",
  //             },
  //           ],
  //         },
  //       ],
  //       billingContact: {
  //         title: "Mr",
  //         firstName: "John",
  //         lastName: "Doe",
  //         age: 25,
  //         contact: {
  //           phone: "8383838383",
  //           address: {
  //             line1: "addr line one",
  //             line2: "addr line two",
  //             city: {
  //               name: "",
  //               code: "",
  //             },
  //             state: {
  //               name: "",
  //               code: "",
  //             },
  //             country: {
  //               name: "",
  //               code: "",
  //             },
  //             postalCode: "",
  //           },
  //           email: "john.doe@mail.com",
  //         },
  //       },
  //     };

  //     const response = await fetch(
  //       `https://nexus.prod.zentrumhub.com/api/hotel/39678710/fdca8ca5-45b5-40a5-b770-71e8a0e23a45/book`,
  //       {
  //         method: "POST",
  //         headers: headers,
  //         body: JSON.stringify(body),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("Booking successful:", data);
  //   } catch (error) {
  //     console.error("Booking failed:", error);
  //     toast.error(error.message);
  //   }
  // };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return dayjs(checkOutDate, "DD MMM YYYY").diff(
      dayjs(checkInDate, "DD MMM YYYY"),
      "day"
    );
  };

  const totalNights = calculateNights();

  return (
    <div className="my-10 mt-28 max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">SECURE CHECKOUT</h2>
<p className="text-red-600 font-medium mb-4">
  ⚠️ ACT FAST! Rates and availability change quickly.
</p>

<div className="flex flex-col lg:flex-row gap-6 mt-3">
  {/* Left Section */}
  <div className="w-full lg:w-2/3">
    {/* Hotel Info */}
    <div className="flex flex-col lg:flex-row gap-4 border p-4 rounded-lg shadow-lg">
      <div className="w-full lg:w-1/3">
        <Image
          src={hotelDetails?.heroImage}
          width={300}
          height={200}
          alt="Hotel"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="flex flex-col justify-between w-full lg:w-2/3">
      <h3 className="text-xl font-semibold mb-2">{hotelDetails?.name}</h3>

        <div className="flex flex-col gap-1 mb-4 text-sm text-gray-600">
          <p>{hotelDetails?.contact?.address?.line1}</p>
          <p>
            {hotelDetails?.contact?.address?.city?.name}, {hotelDetails?.contact?.address?.state?.name}
          </p>
          <p>
            {hotelDetails?.contact?.address?.country?.name} - {hotelDetails?.contact?.address?.postalCode}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <p className="bg-gray-200 px-3 py-1 rounded-md text-sm">
            Check-in: {checkInDate || "N/A"}
          </p>
          <p className="bg-gray-200 px-3 py-1 rounded-md text-sm">
            {totalNights} Nights
          </p>
          <p className="bg-gray-200 px-3 py-1 rounded-md text-sm">
            Check-out: {checkOutDate || "N/A"}
          </p>
        </div>
      </div>
     </div>
     
          {/* Guest Details */}
          <h3 className="font-semibold text-lg mt-6">Guest Details</h3>

{/* Guest Info */}
<div className="mt-6 border p-4 rounded-lg space-y-6">
  {formData.map((room, roomIndex) => (
    <div key={room.roomid} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Room {roomIndex + 1}</h2>
      {room.guests.map((guest, guestIndex) => (
        <div
          key={`${roomIndex}-${guestIndex}`}
          className="border p-4 rounded-md bg-gray-50 space-y-4"
        >
          <div className="flex flex-col gap-6">
            {/* Title field for Adult */}
            {guest.type === "Adult" && (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <select
                  className="border p-2 rounded w-full text-gray-700"
                  value={guest.title}
                  onChange={(e) =>
                    handleInputChange(roomIndex, guestIndex, "title", e.target.value)
                  }
                >
                  <option>Mr.</option>
                  <option>Ms.</option>
                </select>
              </div>
            )}

            {/* First Name */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                className="border p-3 rounded w-full text-gray-700"
                placeholder="First Name"
                value={guest.firstname}
                onChange={(e) =>
                  handleInputChange(roomIndex, guestIndex, "firstname", e.target.value)
                }
              />
            </div>

            {/* Last Name */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                className="border p-3 rounded w-full text-gray-700"
                placeholder="Last Name"
                value={guest.lastname}
                onChange={(e) =>
                  handleInputChange(roomIndex, guestIndex, "lastname", e.target.value)
                }
              />
            </div>

            {/* Email field for Adult */}
            {guest.type === "Adult" && (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="border p-3 rounded w-full text-gray-700"
                  placeholder="Email"
                  value={guest.email}
                  onChange={(e) =>
                    handleInputChange(roomIndex, guestIndex, "email", e.target.value)
                  }
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {errors[`${roomIndex}-${guestIndex}`] && (
            <p className="text-red-500 text-sm mt-2">{errors[`${roomIndex}-${guestIndex}`]}</p>
          )}
        </div>
      ))}
    </div>
  ))}
</div>


{/* Billing Info */}
<div className="mt-6 border p-4 rounded-lg space-y-4">
  <h3 className="font-semibold text-lg mb-2">Billing Address</h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      type="text"
      placeholder="First Name"
      className="border p-2 rounded w-full"
      value={billingContact.firstName}
      onChange={(e) => handleBillingContactChange("firstName", e.target.value)}
    />
    <input
      type="text"
      placeholder="Last Name"
      className="border p-2 rounded w-full"
      value={billingContact.lastName}
      onChange={(e) => handleBillingContactChange("lastName", e.target.value)}
    />
    <input
      type="email"
      placeholder="Email"
      className="border p-2 rounded w-full"
      value={billingContact.email}
      onChange={(e) => handleBillingContactChange("email", e.target.value)}
    />
    <input
      type="text"
      placeholder="Phone"
      className="border p-2 rounded w-full"
      value={billingContact.phone}
      onChange={(e) => handleBillingContactChange("phone", e.target.value)}
    />
  </div>

  <input
    type="text"
    placeholder="Address Line 1"
    className="border p-2 rounded w-full"
    value={billingContact.address.line1}
    onChange={(e) => handleBillingContactChange("address.line1", e.target.value)}
  />
  <input
    type="text"
    placeholder="Address Line 2"
    className="border p-2 rounded w-full"
    value={billingContact.address.line2}
    onChange={(e) => handleBillingContactChange("address.line2", e.target.value)}
  />

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <input
      type="text"
      placeholder="City"
      className="border p-2 rounded w-full"
      value={billingContact.address.city}
      onChange={(e) => handleBillingContactChange("address.city", e.target.value)}
    />
    <input
      type="text"
      placeholder="State"
      className="border p-2 rounded w-full"
      value={billingContact.address.state}
      onChange={(e) => handleBillingContactChange("address.state", e.target.value)}
    />
    <input
      type="text"
      placeholder="Postal Code"
      className="border p-2 rounded w-full"
      value={billingContact.address.postalCode}
      onChange={(e) => handleBillingContactChange("address.postalCode", e.target.value)}
    />
  </div>

  <input
    type="text"
    placeholder="Country"
    className="border p-2 rounded w-full"
    value={billingContact.address.country}
    onChange={(e) => handleBillingContactChange("address.country", e.target.value)}
  />

  {/* Billing Errors */}
  {errors["billingContactName"] && (
    <p className="text-red-500 text-sm">{errors["billingContactName"]}</p>
  )}
  {errors["billingContactEmail"] && (
    <p className="text-red-500 text-sm">{errors["billingContactEmail"]}</p>
  )}
  {errors["billingContactPhone"] && (
    <p className="text-red-500 text-sm">{errors["billingContactPhone"]}</p>
  )}
</div>


        
          

          {/* Terms & Checkout Button */}
          <div className="mt-6">
          <p className="text-gray-600 text-sm text-center sm:text-left leading-relaxed px-2 sm:px-0">
            By continuing to pay, I understand and agree with the{" "}
            <a href="#" className="text-blue-600 underline hover:text-blue-800 transition-colors">
              privacy policy
            </a>
            , the{" "}
            <a href="#" className="text-blue-600 underline hover:text-blue-800 transition-colors">
              user agreement
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 underline hover:text-blue-800 transition-colors">
              terms of service
            </a>
            .
          </p>

          <button
            className="bg-yellow hover:bg-yellow transition-colors text-white font-semibold px-6 py-3 rounded-lg mt-4 w-full sm:w-auto block mx-auto sm:mx-0"
            onClick={handleBooking}
          >
            Book Now
          </button>
        </div>

        </div>

        {/* Right Section - Room Details */}
        <div className="w-full md:w-1/3 border p-4 rounded-lg bg-gray-50 self-start">
          <h3 className="font-semibold text-xl mb-3 text-center md:text-left">Room Details</h3>

          {/* Room Info Section */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 rounded-lg p-3">
            <p className="text-base font-medium">{roomName}</p>
            <p className="text-gray-600 text-sm mt-2 md:mt-0">{rate?.boardBasis?.description || "Room Only"}</p>
          </div>

          {/* Refundability */}
          <p
            className={`mt-4 font-semibold text-center ${
              rate?.refundable ? "text-green-600" : "text-red-600"
            }`}
          >
            {refundability}
          </p>

          {/* Price Details */}
          <div className="mt-4 border-t pt-3 text-gray-700 space-y-2">
            <p className="flex items-center justify-between">
              <span>Room Price:</span>
              <span className="font-medium">₹{roomPrice.toFixed(2)}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Tax & Service Fee:</span>
              <span className="font-medium">₹{taxes.toFixed(2)}</span>
            </p>
          </div>

          {/* Total Payable Section */}
          <div className="mt-4 bg-yellow text-white text-center p-2 rounded-lg font-bold text-lg">
            <p>Total Payable: </p> 
            <p>₹{totalPrice.toFixed(2)}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
