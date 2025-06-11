"use client";
import PnrDetailsApi1 from "@/components/PnrDetailsApi1";
import PnrDetailsApi2 from "@/components/PnrDetailsApi2";
import { apiService } from "@/lib/api";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);

  const getBookingDetails = async () => {
    try {
      const response = await apiService.post("/flight/getbookingdetails", {
        ApiNo: bookingId.startsWith("TJ") ? "2" : "1",
        Api1Data: {
          Booking_RefNo: bookingId,
        },
        Api2Data: {
          bookingId: bookingId,
          requirePaxPricing: true,
        },
      });
      if (response.status === 200) {
        setBookingDetails(response);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  useEffect(() => {
    getBookingDetails();
  }, []);

  return (
    <div>
      {bookingId.startsWith("TJ")?<PnrDetailsApi2 bookingData={bookingDetails}/>:<PnrDetailsApi1 bookingData={bookingDetails}/>}
      
    </div>
  );
};

export default Page;
