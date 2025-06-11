"use client";
import Simmer from "@/components/layout/simmer";
import SuccessCard from "@/components/SuccessCard/page";
import { apiService } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const success = () => {
  const router = useRouter();
  const { txn_id } = useParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState("/"); // Default to home
  const [successMessage, setSuccessMessage] = useState(
    "Your transaction was successful!"
  );

  // Verify payment once `txn_id` is available
  useEffect(() => {
    if (txn_id) {
      verifyPayment();
    }
  }, [txn_id]);

  const verifyPayment = async () => {
    try {
      const paxDetailsStr = localStorage.getItem("paxDetails");
      let paxDetails = [];
      if (paxDetailsStr) {
        try {
          paxDetails = JSON.parse(paxDetailsStr);
        } catch (error) {
          console.error("Failed to parse paxDetails", error);
        }
      }
      const response = await apiService.post(`payment/verify/${txn_id}`);
      if (response.status === 200) {
        const paymentData = response.data.data;
        const messyProductInfo = paymentData.productinfo; // ✅ FIXED

        const productType = messyProductInfo
          .split("quot")
          .map((item) => item.trim())
          .filter((item) => item.length > 0 && item !== "type")[0];

        switch (productType) {
          case "userwallet":
            await topupWallet(paymentData);
            break;
          case "flightBookingEtrav":
            const bookingRef = localStorage.getItem("bookingId");
            if (bookingRef) {
              setSuccessMessage(
                "Your flight payment has been successfully updated!"
              );
              await flightBookingEtrav(paymentData, bookingRef);
            } else {
              console.error("Booking ID is missing for flight booking");
            }
            break;
          case "flightBookingTripJack":
            const tripJackBookingId = localStorage.getItem("tripJackBookingId");
            const tripJackTotalAmount = localStorage.getItem(
              "tripJackTotalAmount"
            );
            if (tripJackBookingId && tripJackTotalAmount) {
              setSuccessMessage(
                "Your flight payment has been successfully updated!"
              );
              await flightBookingTripjack(
                paymentData,
                tripJackBookingId,
                tripJackTotalAmount,
                paxDetails
              );
            } else {
              console.error("Booking ID is missing for flight booking");
            }
            break;
            case "busBooking":
            const bookingRefBus = localStorage.getItem("bookingId");
            if (bookingRefBus) {
              setSuccessMessage(
                "Your bus payment has been successfully updated!"
              );
              await busBooking(paymentData, bookingRefBus);
            } else {
              console.error("Booking ID is missing for bus booking");
            }
            break;
          default:
            console.log("Invalid product type:", productType);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const topupWallet = async (paymentData) => {
    try {
      const response = await apiService.post("/user/addbalance", {
        amount: paymentData?.transaction_amount,
      });
      console.log(paymentData, "paymentData");

      console.log(response);
      if (response.status === 200) {
        setIsSuccess(true);
        setRedirectPath("/wallet");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const flightBookingEtrav = async (paymentData, bookingId) => {
    try {
      const response = await apiService.post("flight/addbalance", {
        RefNo: bookingId,
      });
      if (response.status === 200) {
        if (response.data?.data?.Response_Header?.Error_Desc === "SUCCESS") {
          setIsSuccess(true);
          await flightTickitEtrav(bookingId);
        }
      }
    } catch (error) {
      console.error("Flight booking update failed:", error);
    }
  };

  const flightTickitEtrav = async (bookingId) => {
    try {
      const response = await apiService.post("flight/tickt", {
        Booking_RefNo: bookingId,
        Ticketing_Type: "1",
      });
      if (response.status === 200) {
        console.log("Ticketing successful", response);
        setRedirectPath(
          `/trips/flights/booking/${bookingId}`
        );
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Flight ticketing failed:", error);
    }
  };

  const flightBookingTripjack = async (
    paymentData,
    tripJackBookingId,
    tripJackTotalAmount,
    paxDetails
  ) => {
    try {
      const response = await apiService.post("flight/flightbooking", {
        type: "",
        body: {
          ApiNo: "2",
          bookingId: tripJackBookingId,
          mobile_number: "9274597537",
          email: "parmarkrish005@gmail.com",
          pax_details: paxDetails,
          GstDetails: {
            is_gst: false,
            gst_number: "24YUPBJ6268J5Z4",
            gst_holder_name: "krish",
            address: "krish",
          },
          amount: tripJackTotalAmount,
          BookingFlightDetails: [
            {
              Search_Key: "",
              Flight_Key: "",
              BookingSSRDetails: [],
            },
          ],
          booking_remark: "",
        },
        bookingDetails: {
          flight: "",
          pax: "",
          status: "",
          TDate: "",
        },
      });
      if (
        response.status === 200 &&
        response.data?.data?.status?.success === true
      ) {
        console.log("Ticketing successful");
        localStorage.setItem("tripJackBookingId", response.data.data.bookingId);
        setRedirectPath(
          `/trips/flights/booking/${response.data.data.bookingId}`
        );
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Flight ticketing failed:", error);
    }
  };

  const busBooking = async (paymentData, bookingRefBus) => {
    try {
      const response = await apiService.post("bus/addblance", {
        RefNo: bookingRefBus,
      });
      if (response.status === 201) {
       
        
        if (response?.data?.data?.Response_Header?.Error_Desc === "SUCCESS") {
          console.log("Ticketing successful", response);
        setRedirectPath(
          `/trips/bus/booking/${bookingRefBus}`
        );
        setIsSuccess(true);
        }
      }
    } catch (error) {
      console.error("Flight booking update failed:", error);
    }
  };

  if (isLoading) {
    return <Simmer />;
  }

  if (!isSuccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p>Payment Failed or Invalid</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <SuccessCard message={successMessage} redirectPath={redirectPath} />
    </div>
  );
};

export default success;
