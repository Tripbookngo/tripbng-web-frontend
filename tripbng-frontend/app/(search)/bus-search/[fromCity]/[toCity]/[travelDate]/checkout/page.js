"use client";
import { Container } from "@/components/ui";
import { indianStates } from "@/constants/data/indianStates";
import { ChevronDown, ChevronUp, User, User2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Simmer from "@/components/layout/simmer";
import SlideInLogin from "@/components/SlideInLogin";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seats = searchParams.get("seats")?.split(",") || [];
  const pickupId = searchParams.get("pickup");
  const dropId = searchParams.get("drop");

  const [selectedGender, setSelectedGender] = useState({});
  const [showGST, setShowGST] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [busData, setBusData] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [gstDetails, setGstDetails] = useState({
    gstNumber: "",
    companyName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    passenger: [],
  });
  console.log(busData);

  // Fetch bus data from localStorage on component mount
  useEffect(() => {
    const storedBusData = localStorage.getItem("selectedBus");
    if (storedBusData) {
      try {
        setBusData(JSON.parse(storedBusData));
      } catch (error) {
        console.error("Error parsing bus data:", error);
        toast.error("Failed to load bus information");
        router.push("/bus/search");
      }
    } else {
      toast.error("No bus selected. Please search again.");
      router.push("/bus/search");
    }
  }, [router]);

  // Initialize passenger details when seats are available
  useEffect(() => {
    if (seats.length > 0 && passengerDetails.length === 0) {
      const initialDetails = seats.map((seat) => ({
        seat,
        name: "",
        age: "",
        gender: "",
      }));
      setPassengerDetails(initialDetails);
      setErrors({
        ...errors,
        passenger: seats.map(() => ({
          name: "",
          age: "",
          gender: "",
        })),
      });
    }
  }, [seats, passengerDetails.length]);

  const handleChange = (selectedOption) => {
    setSelectedState(selectedOption);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateMobile = (mobile) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(mobile);
  };

  const validatePassengerDetails = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      mobile: "",
      passenger: [],
    };

    // Validate email
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate mobile
    if (!mobile) {
      newErrors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!validateMobile(mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
      isValid = false;
    }

    // Validate passenger details
    const passengerErrors = passengerDetails.map((passenger) => {
      const passengerError = {
        name: "",
        age: "",
        gender: "",
      };

      if (!passenger.name) {
        passengerError.name = "Name is required";
        isValid = false;
      }

      if (!passenger.age) {
        passengerError.age = "Age is required";
        isValid = false;
      } else if (isNaN(passenger.age)) {
        passengerError.age = "Age must be a number";
        isValid = false;
      } else if (parseInt(passenger.age) < 1 || parseInt(passenger.age) > 100) {
        passengerError.age = "Age must be between 1 and 100";
        isValid = false;
      }

      if (!passenger.gender) {
        passengerError.gender = "Gender is required";
        isValid = false;
      }

      return passengerError;
    });

    newErrors.passenger = passengerErrors;
    setErrors(newErrors);

    return isValid;
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };
    setPassengerDetails(updatedDetails);

    if (field === "gender") {
      setSelectedGender((prev) => ({
        ...prev,
        [index]: value,
      }));

      // Clear gender error when selected
      const updatedErrors = [...errors.passenger];
      updatedErrors[index] = {
        ...updatedErrors[index],
        gender: "",
      };
      setErrors({
        ...errors,
        passenger: updatedErrors,
      });
    }

    // Clear other errors when fields are filled
    if (field === "name" && value) {
      const updatedErrors = [...errors.passenger];
      updatedErrors[index] = {
        ...updatedErrors[index],
        name: "",
      };
      setErrors({
        ...errors,
        passenger: updatedErrors,
      });
    }

    if (field === "age" && value) {
      const updatedErrors = [...errors.passenger];
      updatedErrors[index] = {
        ...updatedErrors[index],
        age: "",
      };
      setErrors({
        ...errors,
        passenger: updatedErrors,
      });
    }
  };

  const handleGstChange = (field, value) => {
    setGstDetails({
      ...gstDetails,
      [field]: value,
    });
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setIsUserLoggedIn(!!storedUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Always prevent default first

    if (!isUserLoggedIn) {
      setShowLogin(true);
      return; // Stop further execution
    }
  

    if (!validatePassengerDetails()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsLoading(true);

    try {
      if (!isUserLoggedIn) {
        setShowLogin(true);
        return;
      }
      // Prepare passenger data for API
      const paxDetails = passengerDetails.map((passenger, index) => ({
        Age: parseInt(passenger.age),
        DOB: "01/01/1990", // You might want to calculate this from age or add a DOB field
        Fare: [],
        Gender: passenger.gender === "Male" ? 1 : 2,
        Id_Number: index + 1,
        Id_Type: 4, // Assuming 4 is for no ID provided
        Ladies_Seat: false,
        PAX_Id: index + 1,
        PAX_Name: passenger.name,
        Penalty_Charge: "0",
        Primary: index === 0, // First passenger is primary
        Seat_Number: passenger.seat,
        Status: "",
        Ticket_Number: "",
        Title: passenger.gender === "Male" ? "Mr" : "Ms",
      }));

      const bookingPayload = {
        Boarding_Id: pickupId,
        CorporatePaymentMode: 1,
        CorporateStatus: "0",
        CostCenterId: 2147483647,
        Customer_Mobile: mobile,
        Deal_Key: "",
        Dropping_Id: dropId,
        GST: showGST && gstDetails.gstNumber !== "",
        GSTIN: showGST ? gstDetails.gstNumber : "",
        GSTINHolderAddress: "",
        GSTINHolderName: showGST ? gstDetails.companyName : "",
        PAX_Details: paxDetails,
        Passenger_Email: email,
        Passenger_Mobile: mobile,
        ProjectId: 1,
        Remarks: `Bus ${busData?.From_City} - ${busData?.To_City} - ${busData?.TravelDate}`,
        Search_Key: busData?.searchKey || "",
        Bus_Key: Object.keys(busData?.seatMap || {})[0] || "",
        SeatMap_Key: busData?.seatMapKey || "",
        SendEmail: true,
        SendSMS: true,
      };

      const response = await axios.post(
        "https://api.tripbng.com/bus/tempbooking",
        bookingPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const bookingRef = response.data?.data?.data?.Booking_RefNo; // Check if this matches your structure
        console.log("Booking Ref:", bookingRef);

        if (bookingRef) {
          localStorage.setItem("bookingId", bookingRef);
          makePayment();
        } else {
          toast.error("Booking reference not found");
        }
      } else {
        toast.error(
          "Booking Failed: " + (response.data?.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to complete booking. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const makePayment = async () => {
    try {
      const response = await axios.post(
        "https://api.tripbng.com/payment/paymentinti",
        {
          amount:
            busData?.bus?.FareMasters?.[0]?.Total_Amount?.toFixed(2) || "0.00",
          type: "busBooking",
          firstname: "hetuk",
          lastname: "kumar",
          email: email,
          phone: mobile,
        }
      );

      const html = response.data;
      const newWindow = window.open();
      newWindow.document.write(html);
      newWindow.document.close();
    } catch (error) {
      console.error("Error making payment:", error.message);
    }
  };

  if (!busData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Simmer />
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="bg-black text-white py-3 px-4 sm:px-8 md:px-16 lg:px-64 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h1 className="text-lg sm:text-xl font-semibold">
          Complete your booking
        </h1>
        <p className="text-sm sm:text-base font-semibold">
          {busData?.From_City || "Ahmedabad"} to {busData?.To_City || "Mumbai"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-4 mt-10 px-4 sm:px-8 md:px-16 lg:px-64">
          <div className="w-full lg:w-3/4">
            <div className="border border-gray-200 p-4 sm:p-6 rounded-lg mb-5 bg-white shadow-sm">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {busData?.Operator_Name || "TESTING ACCOUNT"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {busData?.Bus_Type || "Tata A/C Seater/Sleeper (2+1)"}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md inline-block">
                    <span className="font-medium">Seat No: </span>
                    {busData?.selectedSeats?.join(", ") || seats.join(", ")}
                  </div>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    View Policies
                  </button>
                </div>
              </div>

              {/* Journey Timeline */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="w-full sm:w-auto text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
                    <p className="text-xl sm:text-2xl font-semibold text-gray-800">
                      {busData?.Departure_Time || "10:00 PM"}
                    </p>
                    <span className="text-gray-500 text-sm bg-gray-50 px-2 py-1 rounded">
                      {busData?.TravelDate
                        ? (() => {
                            try {
                              const [day, month, year] =
                                busData.TravelDate.split("/");
                              const date = new Date(`${month}/${day}/${year}`);
                              const monthName = date.toLocaleString("default", {
                                month: "short",
                              });
                              return `${parseInt(day)} ${monthName}'${year
                                .toString()
                                .slice(-2)}`;
                            } catch {
                              return "16 May'25";
                            }
                          })()
                        : "16 May'25"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {busData?.pickup?.Boarding_Name || "Satellite (Pickup Bus)"}
                  </p>
                </div>

                <div className="hidden sm:block flex-1 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 border-dashed"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="bg-white p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
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
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full inline-block">
                      {busData?.Duration || "7:00 hrs"}
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
                    <p className="text-xl sm:text-2xl font-semibold text-gray-800">
                      {busData?.Arrival_Time || "5:00 AM"}
                    </p>
                    <span className="text-gray-500 text-sm bg-gray-50 px-2 py-1 rounded">
                      {busData?.TravelDate
                        ? (() => {
                            try {
                              const [day, month, year] =
                                busData.TravelDate.split("/");
                              const date = new Date(`${month}/${day}/${year}`);
                              const monthName = date.toLocaleString("default", {
                                month: "short",
                              });
                              return `${parseInt(day)} ${monthName}'${year
                                .toString()
                                .slice(-2)}`;
                            } catch {
                              return "16 May'25";
                            }
                          })()
                        : "16 May'25"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {busData?.drop?.Dropping_Name || "Borivali (E)"}
                  </p>
                </div>
              </div>

              {/* Points Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
                    <h3 className="font-medium text-gray-800">
                      Boarding Point
                    </h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      {busData?.pickup?.pickup?.Boarding_Address ||
                        "Manas Complex"}
                    </p>
                    <p>
                      <span className="font-medium">Landmark:</span>{" "}
                      {busData?.pickup?.pickup?.Boarding_Landmark ||
                        "Opp. Star bazar"}
                    </p>
                    <p>
                      <span className="font-medium">Contact:</span>{" "}
                      {busData?.pickup?.pickup?.Boarding_Contact ||
                        "079-123456"}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {busData?.pickup?.pickup?.Boarding_Time || "10:00 PM"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
                    <h3 className="font-medium text-gray-800">
                      Dropping Point
                    </h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      {busData?.drop?.drop?.Dropping_Address ||
                        "Borivali (E) National Park"}
                    </p>
                    <p>
                      <span className="font-medium">Landmark:</span>{" "}
                      {busData?.drop?.drop?.Dropping_Landmark ||
                        "National Park"}
                    </p>
                    <p>
                      <span className="font-medium">Contact:</span>{" "}
                      {busData?.drop?.drop?.Dropping_Contact ||
                        "022-28916622/28915436/9324644137/9320026622"}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {busData?.drop?.drop?.Dropping_Time || "5:00 AM"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {isUserLoggedIn && (
            <div>
            <div className="border p-5 rounded-lg mb-5">
              <h2 className="text-lg font-semibold mb-5">Traveller Details</h2>

              {passengerDetails.map((passenger, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center mb-4"
                >
                  <div className="flex items-center gap-3">
                    <label className="block text-gray">Seat</label>
                    <p className="font-semibold">{passenger.seat}</p>
                  </div>

                  <div>
                    <label className="block text-gray font-semibold">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className={`w-full bg-transparent border rounded-lg py-2 px-3 ${
                        errors.passenger[index]?.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      value={passenger.name}
                      onChange={(e) =>
                        handlePassengerChange(index, "name", e.target.value)
                      }
                    />
                    {errors.passenger[index]?.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.passenger[index].name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray font-semibold">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="eg: 24"
                      min="1"
                      max="100"
                      className={`w-full bg-transparent border rounded-lg py-2 px-3 ${
                        errors.passenger[index]?.age
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      value={passenger.age}
                      onChange={(e) =>
                        handlePassengerChange(index, "age", e.target.value)
                      }
                    />
                    {errors.passenger[index]?.age && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.passenger[index].age}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray font-semibold">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4 flex-wrap">
                      {[
                        { label: "Male", icon: <User size={20} /> },
                        { label: "Female", icon: <User2 size={20} /> },
                      ].map(({ label, icon }) => (
                        <button
                          type="button"
                          key={label}
                          className={`w-full sm:w-36 py-2 px-2 flex items-center justify-center gap-2 border rounded-lg font-medium transition-all
                            ${
                              selectedGender[index] === label
                                ? "bg-yellow/50 text-yellow font-semibold border-yellow"
                                : "bg-white text-black border hover:bg-yellow/50 hover:border-yellow hover:text-yellow"
                            } ${
                            errors.passenger[index]?.gender &&
                            !selectedGender[index]
                              ? "border-red-500"
                              : ""
                          }`}
                          onClick={() =>
                            handlePassengerChange(index, "gender", label)
                          }
                        >
                          {icon} {label}
                        </button>
                      ))}
                    </div>
                    {errors.passenger[index]?.gender && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.passenger[index].gender}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border p-5 rounded-lg mb-5">
              <span className="flex items-baseline gap-3 mb-5">
                <h2 className="text-lg font-semibold">Contact Details</h2>
                <p className="text-gray text-sm">We'll send your ticket here</p>
              </span>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="w-full sm:w-1/2">
                  <label className="block text-gray font-semibold">
                    Email Id <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Type here"
                    className={`w-full bg-transparent border rounded-lg py-2 px-3 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email && validateEmail(e.target.value)) {
                        setErrors({ ...errors, email: "" });
                      }
                    }}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-gray font-semibold">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Type here"
                    maxLength="10"
                    className={`w-full bg-transparent border rounded-lg py-2 px-3 ${
                      errors.mobile ? "border-red-500" : "border-gray-300"
                    }`}
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setMobile(value);
                      if (errors.mobile && validateMobile(value)) {
                        setErrors({ ...errors, mobile: "" });
                      }
                    }}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>
              </div>

              <div className="border-b my-5"></div>

              <div>
                <div
                  className="flex items-center cursor-pointer w-fit mb-3"
                  onClick={() => setShowGST(!showGST)}
                >
                  <p className="text-lg font-semibold">
                    Enter GST details (optional)
                  </p>
                  {showGST ? (
                    <ChevronUp className="ml-2 text-yellow font-bold" />
                  ) : (
                    <ChevronDown className="ml-2 text-yellow font-bold" />
                  )}
                </div>
                {showGST && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray font-semibold">
                        GST Number
                      </label>
                      <input
                        type="text"
                        placeholder="22AAAAA0000A1Z5"
                        className="w-full bg-transparent border border-gray-300 rounded-lg py-2 px-3"
                        value={gstDetails.gstNumber}
                        onChange={(e) =>
                          handleGstChange("gstNumber", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-gray font-semibold">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="w-full bg-transparent border border-gray-300 rounded-lg py-2 px-3"
                        value={gstDetails.companyName}
                        onChange={(e) =>
                          handleGstChange("companyName", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border p-5 rounded-lg mb-5">
              <span className="flex flex-col sm:flex-row items-baseline gap-3 mb-5">
                <h2 className="text-lg font-semibold">
                  Your pincode and state
                </h2>
                <p className="text-gray text-sm">
                  (Required for GST purpose on your tax invoice. You can edit
                  this anytime later in your profile section.)
                </p>
              </span>

              <div>
                <label className="text-gray font-medium">
                  Select the State <span className="text-red-500">*</span>
                </label>
                <Select
                  options={indianStates}
                  value={selectedState}
                  onChange={handleChange}
                  placeholder="Select a state"
                  className="border text-black w-full sm:w-64 rounded-lg overflow-hidden"
                  isSearchable
                  // required
                />

                <div className="flex items-center gap-2 mt-5">
                  <input
                    type="checkbox"
                    id="saveBilling"
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="saveBilling"
                    className="text-gray-700 cursor-pointer"
                  >
                    Confirm and save billing details to your profile
                  </label>
                </div>
              </div>
            </div>
            </div>)}

          </div>
            {showLogin && <SlideInLogin onClose={() => setShowLogin(false)} />}

          <div className="w-full lg:w-1/4">
            <div className="border p-4 rounded-lg shadow-sm bg-white sticky top-4">
              <h2 className="text-lg font-semibold mb-3">Price details</h2>

              {/* Base Fare */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-3">
                <p className="text-gray-600">Base Fare</p>
                <p className="font-semibold">
                  ₹
                  {busData?.bus?.FareMasters?.[0]?.Basic_Amount?.toFixed(2) ||
                    "0.00"}
                </p>
              </div>

              {/* Other Amount */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-3">
                <p className="text-gray-600">Other Amount</p>
                <p className="font-semibold">
                  ₹
                  {busData?.bus?.FareMasters?.[0]?.Other_Amount?.toFixed(2) ||
                    "0.00"}
                </p>
              </div>

              {/* Service Fee */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-3">
                <p className="text-gray-600">Service Fee</p>
                <p className="font-semibold">
                  ₹
                  {busData?.bus?.FareMasters?.[0]?.Service_Fee_Amount?.toFixed(
                    2
                  ) || "0.00"}
                </p>
              </div>

              <div className="border-b my-2"></div>

              {/* Total Amount */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-3">
                <p className="text-gray-600 font-semibold">Total Amount</p>
                <p className="font-semibold text-lg">
                  ₹
                  {busData?.bus?.FareMasters?.[0]?.Total_Amount?.toFixed(2) ||
                    "0.00"}
                </p>
              </div>

              <p className="text-gray-500 text-xs text-justify mb-3">
                Final payable amount will be updated on the next page
              </p>

              {/* Continue Button */}
              <button
                type="submit"
                className="text-lg font-semibold bg-yellow hover:bg-yellow-600 text-white w-full mt-3 mb-2 p-2 h-12 rounded-lg flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Continue"}
              </button>

              {/* Terms and Conditions */}
              <p className="text-xs text-gray-600 text-justify">
                By proceeding, I agree to MakeMyTrip's{" "}
                <span className="text-yellow underline">User Agreement</span>,{" "}
                <span className="text-yellow underline">Terms of Service</span>{" "}
                and{" "}
                <span className="text-yellow underline">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
