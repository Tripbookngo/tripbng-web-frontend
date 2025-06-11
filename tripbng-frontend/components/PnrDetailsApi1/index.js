import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle,
  Download,
  HelpCircle,
  Luggage,
  Printer,
  Share2,
} from "lucide-react";
import React from "react";
import PdfDownload from "../PdfDownload";

const PnrDetailsApi1 = ({ bookingData }) => {
  const SuccessBanner = () => (
    <div className="flex flex-col items-center bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm mb-6">
      <CheckCircle className="text-green-600 w-16 h-16 animate-bounce mb-2" />
      <h2 className="text-2xl font-bold text-green-900 mb-1">
        Congratulations, your flight is booked!
      </h2>
      <p className="text-green-800 mb-2">
        Your tickets have been successfully issued. Get ready for your journey!
      </p>
      <div className="flex gap-3 mt-2 justify-center">
        <button className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Download className="w-4 h-4" /> Download Ticket
        </button>
        <button className="flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
          
          <PdfDownload booking={bookingData} />
        </button>
        <button className="flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
          <Share2 className="w-4 h-4" /> Share
        </button>
        <button className="flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
          <Calendar className="w-4 h-4" /> Add to Calendar
        </button>
      </div>
    </div>
  );

  const DestinationBanner = () => (
    <div className="relative rounded-xl overflow-hidden mb-8 shadow-md">
      <img
        src="/images/pnr.jpg"
        alt="Bangalore"
        className="w-full h-40 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center pl-8">
        <h3 className="text-white text-2xl font-bold">
          {bookingData?.data?.data?.AirPNRDetails[0]?.Flights[0]?.Destination.match(
            /^\w+/
          )[0]
            .charAt(0)
            .toUpperCase() +
            bookingData?.data?.data?.AirPNRDetails[0]?.Flights[0]?.Destination.match(
              /^\w+/
            )[0]
              .slice(1)
              .toLowerCase()}{" "}
          Awaits!
        </h3>
        <p className="text-white text-md">
          Discover vibrant culture, gardens, and cuisine. Safe travels!
        </p>
      </div>
    </div>
  );
  const SupportWidget = () => (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="flex items-center gap-2 bg-blue text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition">
        <HelpCircle className="w-5 h-5" /> Need Help?
      </button>
    </div>
  );
  return (
    <div className="container max-w-7xl mt-36 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-10 mb-5">
        <div>
          <SuccessBanner />
          <DestinationBanner />
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Flight Booking Details
                </h1>
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-800 font-semibold rounded-full py-1.5 px-4 border border-green-200">
                <CheckCircle className="w-5 h-5" />
                <span>Confirmed</span>
              </div>
            </div>
            {bookingData?.data?.data?.AirPNRDetails?.map((pnr, pnrIndex) => (
              <div key={`pnr-${pnrIndex}`}>
                {pnr.Flights.map((flight, flightIndex) => (
                  <div
                    key={`flight-${pnrIndex}-${flightIndex}`}
                    className="flex items-center gap-3 mb-2 font-semibold"
                  >
                    <h2>{flight.Origin}</h2>
                    <ArrowRight />
                    <h2>{flight.Destination}</h2>
                  </div>
                ))}
                <div className="border p-2 rounded-xl mb-6">
                  <p className="text-gray-500">
                    PNR:{" "}
                    <span className="font-semibold text-blue-600">
                      {pnr.Airline_PNR}
                    </span>
                  </p>
                  {pnr.Flights.map((flight, flightIndex) => (
                    <div key={`flight-${pnrIndex}-${flightIndex}`}>
                      {flight.Segments.map((segment, segmentIndex) => (
                        <div
                          key={`segment-${pnrIndex}-${flightIndex}-${segmentIndex}`}
                        >
                          <div className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-200 rounded-xl mb-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={`https://tripbng-airline.s3.us-east-1.amazonaws.com/AirlinesLogo/${segment.Airline_Code}.png`}
                                alt="SpiceJet"
                                className="w-10 h-10 object-contain"
                              />
                              <div>
                                <p className="font-medium text-gray-700">
                                  {segment.Airline_Name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Flight {segment.Airline_Code}-
                                  {segment.Aircraft_Type}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <p className="text-lg font-bold">
                                  {segment.Origin.split(" (")[1].replace(
                                    ")",
                                    ""
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {segment.Origin.match(/^\w+/)[0]
                                    .charAt(0)
                                    .toUpperCase() +
                                    segment.Origin.match(/^\w+/)[0]
                                      .slice(1)
                                      .toLowerCase()}
                                </p>
                              </div>
                              <img
                                src="/icons/flightList.png"
                                alt="flight"
                                className="w-8 h-8"
                              />
                              <div className="text-center">
                                <p className="text-lg font-bold">
                                  {segment.Destination.split(" (")[1].replace(
                                    ")",
                                    ""
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {segment.Destination.match(/^\w+/)[0]
                                    .charAt(0)
                                    .toUpperCase() +
                                    segment.Origin.match(/^\w+/)[0]
                                      .slice(1)
                                      .toLowerCase()}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-700">
                                Wed, 16 Apr 2025
                              </p>
                            </div>
                          </div>
                          {/* Times */}
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-2xl font-bold">
                                {new Date(
                                  segment.Departure_DateTime
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(
                                  segment.Departure_DateTime
                                ).toLocaleDateString("en-US", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Delhi Indira Gandhi Intl
                              </p>
                              <p className="text-xs text-gray-500">
                                Terminal {segment.Origin_Terminal}
                              </p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              {flight.Segments.length === 1 ? (
                                <p className="text-gray-500 font-medium">
                                  Non-stop
                                </p>
                              ) : (
                                <p className="text-gray-500 font-medium">
                                  {flight.Segments.length - 1} stop
                                  {flight.Segments.length - 1 > 1 && "s"}
                                </p>
                              )}
                              <p className="text-gray-500 font-medium">
                                {`${parseInt(
                                  segment.Duration.split(":")[0]
                                )}h:${parseInt(
                                  segment.Duration.split(":")[1]
                                )}m`}{" "}
                                Duration
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold">
                                {new Date(
                                  segment.Arrival_DateTime
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(
                                  segment.Arrival_DateTime
                                ).toLocaleDateString("en-US", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Bangalore Intl Airport
                              </p>
                              <p className="text-xs text-gray-500">
                                Terminal {segment.Destination_Terminal}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {/* Traveller Information */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Traveller Information
              </h2>
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700">
                    Passenger Details
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Passenger
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket No.
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Baggage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Example rows, replace with dynamic data */}
                      {bookingData?.data?.data?.AirPNRDetails[0]?.PAXTicketDetails.map((pax, paxIndex)=>(
                        <tr key={`flight-${paxIndex}`}>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {pax.First_Name}{" "}{pax.Last_Name}
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-gray-700">
                          {pax.Gender === 0 ? "Male":"Female"}
                        </td>
                          {pax?.TicketDetails.map((ticket, indexTicket)=>(
                        <td key={`flight-${paxIndex}-${indexTicket}`} className="px-5 py-4 whitespace-nowrap font-mono text-gray-900">
                            {ticket.Ticket_Number}
                        </td>
                          ))}
                          {pax?.Fares[0].FareDetails.map((fare, fareIndex)=>(
                            <td key={`flight-${paxIndex}-${fareIndex}`} className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{fare.Free_Baggage.Hand_Baggage} kg</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Luggage className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{fare.Free_Baggage.Check_In_Baggage} kg</span>
                            </div>
                          </div>
                        </td>
                          ))}
                        
                      </tr>
                      ))
}
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6 border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Booking Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking Reference</p>
                  <p className="font-medium text-blue-600">{bookingData?.data?.data?.Booking_RefNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">PNR Number</p>
                  <p className="font-medium text-blue-600">XFILPG</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trip Type</p>
                  <p className="font-medium">
                  {bookingData?.data?.data?.AirPNRDetails.length>0? "Rounded" :"One Way"} •{" "}
                    <span className="text-red-500">Non-Refundable</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departure</p>
                  <p className="font-medium">16 Apr 2025, 20:50</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passengers</p>
                  <p className="font-medium">
  {bookingData?.data?.data?.Adult_Count > 0 && (
    <span>
      {`${bookingData.data.data.Adult_Count} ${
        bookingData.data.data.Adult_Count > 1 ? "Adults" : "Adult"
      }`}
    </span>
  )}
  {bookingData?.data?.data?.Child_Count > 0 && (
    <span>
      {`, ${bookingData.data.data.Child_Count} ${
        bookingData.data.data.Child_Count > 1 ? "Children" : "Child"
      }`}
    </span>
  )}
  {bookingData?.data?.data?.Infant_Count > 0 && (
    <span>
      {`, ${bookingData.data.data.Infant_Count} ${
        bookingData.data.data.Infant_Count > 1 ? "Infants" : "Infant"
      }`}
    </span>
  )}
</p>

                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Date</p>
                  <p className="font-medium">15 Apr 2025, 17:58</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Price Information */}
        <div className="bg-white shadow-md rounded-lg mb-8">
          {" "}
          {/* Removed extra margin */}
          <h2 className="text-lg font-bold p-4">Price Information</h2>
          <div className="border-b border-gray-200"></div>
          <div className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-gray-700 font-medium">Base Fare</p>
              <p className="text-gray-700 font-medium">INR 13423.60</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-700 font-medium">
                Seat / Meal / Extra Baggage
              </p>
              <p className="text-gray-700 font-medium">INR 0</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-700 font-medium">Taxes & Fees</p>
              <p className="text-gray-700 font-medium">INR 256.8</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-black font-semibold">Amount Payable</p>
              <p className="text-black font-semibold">INR 12406.8</p>
            </div>

            <div className="border-b border-gray-200 border-dashed my-2"></div>
            <div className="flex items-center justify-between">
              <p className="text-black font-semibold">Total Amount</p>
              <p className="text-black font-semibold">INR 13106.8</p>
            </div>
          </div>
        </div>
      </div>
      <SupportWidget />
    </div>
  );
};

export default PnrDetailsApi1;
