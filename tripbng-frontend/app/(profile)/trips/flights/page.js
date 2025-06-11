"use client";
import { FaFilter, FaFilePdf, FaFileExcel, FaDownload } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import dynamic from "next/dynamic";

import "jspdf-autotable";
import { apiService } from "@/lib/api";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const PdfDownload = dynamic(() => import("@/components/PdfDownload"), {
  ssr: false,
});

const ITEMS_PER_PAGE = 5;

export default function FlightPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [getAllFlights, setGetAllFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const filteredBookings = getAllFlights
    .filter((booking) =>
      Object.values(booking).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredBookings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
console.log(currentData);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getFlightBookings = async () => {
    try {
      setLoading(true);
      const response = await apiService.post("user/getflightbookingdetails");
      if (response.data && response.data.success) {
        setGetAllFlights(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching flight bookings:", error);
      toast.error("Failed to fetch flight bookings");
    } finally {
      setLoading(false);
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    getFlightBookings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    // Removed the .replace(",", "") that was removing the comma
  };
  return (
    <div className="container mx-auto py-10 px-4 sm:px-8">
      <div className="flex md:flex-row flex-col items-center justify-between mb-6 gap-2">
        <div className="flex items-center md:w-3/5 w-full">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="flex space-x-2 w-5/5 justify-end">
          <button className="flex items-center px-4 py-2 bg-yellow text-white rounded-md hover:bg-yellow-600">
            <FaFilter className="inline-block mr-2" /> Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            <FaFilePdf className="mr-2" /> Export PDF
          </button>
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            <FaFileExcel className="mr-2" /> Export Excel
          </button>
        </div>
      </div>

      {isLoadingData ? (
        <div className="space-y-4">
          {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 border border-gray-300 rounded-md animate-pulse bg-gray-50"
            >
              <div className="w-20 h-6 bg-gray-300 rounded-md"></div>
              <div className="w-24 h-6 bg-gray-300 rounded-md"></div>
              <div className="w-24 h-6 bg-gray-300 rounded-md"></div>
              <div className="w-24 h-6 bg-gray-300 rounded-md"></div>
              <div className="w-20 h-6 bg-gray-300 rounded-md"></div>
              <div className="w-20 h-6 bg-gray-300 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Booking ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Booking Date
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Reference No.
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Travel Date
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Passengers
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  PNR
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((booking, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {booking._id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {booking.BookingStatus ? "Confirmed" : "Pending"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {booking.BookingRefNum || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {booking.Pax}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {booking.Pnr
                        ? typeof booking.Pnr === "string"
                          ? booking.Pnr
                          : JSON.stringify(booking.Pnr)
                        : "N/A"}
                    </td>

                    <td className="border border-gray-300 px-4 py-2 text-center ">
                      <div className="flex items-center justify-center gap-4">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() =>
                          router.push(
                            `/trips/flights/booking/${booking.BookingRefNum}`
                          )
                        }
                      >
                        <Eye />
                      </button>
                      {/* <button
                        className="flex items-center gap-3 text-blue-500 hover:text-blue-700"
                      >
                        <PdfDownload booking={booking} />
                      </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center border border-gray-300 px-4 py-6 text-gray-500"
                  >
                    No flight bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center items-center mt-6 space-x-2">
        {currentPage > 1 && (
          <button
            className="px-3 py-1 rounded bg-gray-100 text-gray-700"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>
        )}
        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .filter(
            (page) =>
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
          )
          .map((page, index, filteredPages) => (
            <React.Fragment key={page}>
              {index > 0 && page > filteredPages[index - 1] + 1 && (
                <span className="px-3 py-1">...</span>
              )}
              <button
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-yellow text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </React.Fragment>
          ))}
        {currentPage < totalPages && (
          <button
            className="px-3 py-1 rounded bg-gray-100 text-gray-700"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
