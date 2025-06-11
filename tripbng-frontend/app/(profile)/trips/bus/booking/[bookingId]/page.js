"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Mail, Phone, ChevronDown, FileText, Ticket, User, Bed, MapPin, Clock, Calendar, Bus } from 'lucide-react';
import moment from "moment";
import { FaVenusMars } from "react-icons/fa";
import { apiService } from "@/lib/api";

const Page = () => {
  const router = useRouter();
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  const getBookingDetails = async () => {
    try {
      const response = await apiService.post("bus/getbookingdetails", {
        Booking_RefNo: bookingId,
      });
      if (response.status === 200) {
        setBookingDetails(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  useEffect(() => {
    getBookingDetails();
  }, []);

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="pt-24 pb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Bus Journey Details</h1>
              <p className="text-gray-500 mt-1">
                Booking reference: <span className="font-medium text-gray-700">{bookingDetails.Booking_RefNo}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Completed
              </span>
              <span className="text-sm text-gray-500">
                Booked on {moment(bookingDetails.BookingDate, 'DD/MM/YYYY HH:mm:ss').format('DD MMM YYYY, h:mm A')}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Journey Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Journey Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <h2 className="text-xl font-bold">{bookingDetails.Bus_Detail.From_City}</h2>
                    <ArrowRight className="mx-2 text-gray-500" size={20} />
                    <h2 className="text-xl font-bold">{bookingDetails.Bus_Detail.To_City}</h2>
                    <span className="ml-2 text-gray-600">{moment(bookingDetails.BookingDate, 'DD/MM/YYYY HH:mm:ss').format('DD MMM, YYYY')}</span>
                  </div>
                  <div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-lg font-semibold">{bookingDetails.Bus_Detail.Departure_Time}</div>
                    <div className="text-lg font-medium">{bookingDetails.Bus_Detail.From_City}</div>
                    <div className="text-sm text-gray-600">
                      Boarding Point - {bookingDetails.Bus_Detail.BoardingDetails.Boarding_Name},
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    
                    <div className="text-gray-500 text-sm font-semibold">Travel Date</div>
                    <div className="text-gray-500 text-sm">{moment(bookingDetails.Bus_Detail.TravelDate, 'DD/MM/YYYY HH:mm:ss').format('DD MMM, YYYY')}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold">{bookingDetails.Bus_Detail.Arrival_Time}</div>
                    <div className="text-lg font-medium">{bookingDetails.Bus_Detail.To_City}</div>
                    <div className="text-sm text-gray-600">
                      Drop Point - {bookingDetails.Bus_Detail.DroppingDetails.Dropping_Name}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                    <div>
                      <div className="font-medium">{bookingDetails.Bus_Detail.Operator_Name}</div>
                      <div className="text-sm text-gray-600">{bookingDetails.Bus_Detail.Bus_Type}</div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-md">Bus ID:{" "}
                        {bookingDetails.Bus_Detail.Operator_Id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            {/* Travellers Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  <div className="p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
      <User className="text-blue-500 mr-2" size={20} />
      <span className="bg-gradient-to-r from-blue/90 to-blue/40 bg-clip-text text-transparent">
        Traveller Details
      </span>
    </h2>
    
    <div className="space-y-4">
      {bookingDetails.PAX_Details.map((traveller, index) => (
        <div 
          key={index} 
          className="relative flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-all duration-200"
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 rounded-lg bg-blue-100 opacity-20 blur-sm"></div>
          
          <div className="flex items-center z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue to-blue-400 rounded-full flex items-center justify-center mr-4 shadow-sm">
              <User className="text-black" size={18} />
            </div>
            <div>
              <div className="font-medium text-gray-900 flex items-center">
                {traveller.PAX_Name}
                <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-blue text-white rounded-full">
                  {index === 0 ? 'Primary' : 'Co-traveller'}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1 flex items-center space-x-2">
                <span className="flex items-center">
                  <Calendar className="mr-1" size={14} />
                  {traveller.Age}yrs
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <FaVenusMars className="mr-1" size={14} />
                  {traveller.Gender === 1 ? 'Male' : 'Female'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-xs hover:shadow-sm transition-shadow z-10">
            <Bed className="text-blue-500 mr-2" size={16} />
            <span className="font-medium text-gray-700">Seat {traveller.Seat_Number}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

            {/* Contact & Payment Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-4 py-2 font-medium ${activeTab === "details" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                    onClick={() => setActiveTab("details")}
                  >
                    Contact Details
                  </button>
                  <button
                    className={`px-4 py-2 font-medium ${activeTab === "payment" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                    onClick={() => setActiveTab("payment")}
                  >
                    Payment Details
                  </button>
                </div>

                {activeTab === "details" ? (
                  <div className="pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Contact Information</h3>
                    <p className="text-gray-500 mb-6">
                      All communications regarding this booking will be sent to these contact details.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                          <Mail className="text-blue-600" size={18} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="font-medium text-gray-900">{bookingDetails.CustomerDetail.Customer_Email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                          <Phone className="text-blue-600" size={18} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Mobile Number</p>
                          <p className="font-medium text-gray-900">{bookingDetails.CustomerDetail.Customer_Mobile}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Payment Summary</h3>
                    
                    <div className="space-y-4">
                      {bookingDetails.BookingPaymentDetails.map((payment, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              {payment.Payment_Mode === 2 ? 'Wallet Payment' : 'Bank Transfer'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {moment(payment.Payment_Date, 'DD/MM/YYYY HH:mm:ss').format('DD MMM YYYY, h:mm A')}
                            </p>
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            ₹{payment.Payment_Amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Summary */}
          <div className="space-y-6">
            {/* Download Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="text-blue-500 mr-2" size={20} />
                  Download Documents
                </h2>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <FileText className="text-blue-600 mr-3" size={18} />
                      <span className="font-medium">Booking Invoice</span>
                    </div>
                    <ChevronDown className="text-gray-400" size={18} />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <Ticket className="text-blue-600 mr-3" size={18} />
                      <span className="font-medium">Travel Ticket</span>
                    </div>
                    <ChevronDown className="text-gray-400" size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Fare Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare ({bookingDetails.NoofPax} {bookingDetails.NoofPax > 1 ? 'Travellers' : 'Traveller'})</span>
                    <span className="font-medium">₹{bookingDetails.PAX_Details[0].Fare.Base_Amount * bookingDetails.NoofPax}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">₹{(bookingDetails.PAX_Details[0].Fare.Total_Amount - bookingDetails.PAX_Details[0].Fare.Base_Amount) * bookingDetails.NoofPax}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Discount Applied</span>
                    <span className="font-medium text-green-600">-₹129</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total Amount Paid</span>
                    <span className="text-xl font-bold text-gray-900">
                      ₹{(bookingDetails.PAX_Details[0].Fare.Total_Amount * bookingDetails.NoofPax) - 129}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-600 mb-4">
                  For any queries regarding your booking, please contact our customer support.
                </p>
                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;