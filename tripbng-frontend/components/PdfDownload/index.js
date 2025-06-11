import React from "react";
import html2pdf from "html2pdf.js";
import { Printer, Briefcase, Luggage } from "lucide-react";

const PdfDownload = ({ booking }) => {
  const downloadPDF = () => {
    function parseCustomDate(dateTimeStr) {
      if (!dateTimeStr) return null;
      const [datePart, timePart] = dateTimeStr.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hour, minute, second] = timePart.split(":").map(Number);
      return new Date(year, month - 1, day, hour, minute, second);
    }

    const formatDate = (dateString) => {
      const date = parseCustomDate(dateString);
      if (!date) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    };

    const formatTime = (dateString) => {
      const date = parseCustomDate(dateString);
      if (!date) return "N/A";
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    const formatFlightTime = (dateString) => {
      const date = parseCustomDate(dateString);
      if (!date) return "N/A";
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    const formatFlightDate = (dateString) => {
      const date = parseCustomDate(dateString);
      if (!date) return "N/A";
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const formatSegmentDate = (dateString) => {
      const date = parseCustomDate(dateString);
      if (!date) return "N/A";
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const getCityName = (airportString) => {
      if (!airportString) return "N/A";
      const match = airportString.match(/^\w+/);
      return match
        ? match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase()
        : airportString;
    };

    const getAirportCode = (airportString) => {
      if (!airportString) return "N/A";
      const parts = airportString.split(" (");
      return parts.length > 1 ? parts[1].replace(")", "") : airportString;
    };

    const getPassengerTitle = (gender, type) => {
      if (type === 2) return "Infant";
      return gender === 0 ? "Mr" : "Ms";
    };

    const element = document.createElement("div");
    element.innerHTML = `
      <style>
        body {
          font-family: Arial, sans-serif !important;
          background: #fff !important;
          -webkit-print-color-adjust: exact !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .container {
          width: 210mm !important;
          min-height: 297mm !important;
          margin: 0 auto !important;
          padding: 10mm 15mm !important;
          box-sizing: border-box !important;
          background: #fff !important;
        }
        .header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          margin-bottom: 5mm !important;
        }
        .header img {
          width: 55mm !important;
          height: auto !important;
        }
        .section-title {
          color: #0a4fa3 !important;
          font-weight: bold !important;
          font-size: 16px !important;
          margin-bottom: 8px !important;
        }
        .section-subtitle {
          color: #333 !important;
          font-size: 14px !important;
          margin-bottom: 5px !important;
        }
        .divider {
          border-bottom: 1px solid #c6d6e2 !important;
          margin: 10px 0 !important;
        }
        .booking-details {
          margin-bottom: 20px !important;
        }
        .booking-details p {
          font-size: 14px !important;
          margin: 5px 0 !important;
        }
        .passenger-info {
          margin-top: 18px !important;
          font-size: 14px !important;
          letter-spacing: 0.5px !important;
          border-bottom: 1.5px solid #0a4fa3 !important;
          padding-bottom: 4px !important;
        }
        .flight-details {
          border-bottom: 1px solid #ccc !important;
          padding-bottom: 4mm !important;
          margin-bottom: 4mm !important;
        }
        .flight-row {
          display: flex !important;
          justify-content: space-between !important;
          margin-bottom: 2mm !important;
        }
        .passenger-info table {
          width: 100% !important;
          border-collapse: collapse !important;
          page-break-inside: avoid !important;
        }
        .passenger-info th, .passenger-info td {
          border: 1px solid #ccc !important;
          padding: 3mm !important;
          font-size: 14px !important;
          page-break-inside: avoid !important;
        }
        .price-table {
          width: 100% !important;
          border: 1.2px solid #c6d6e2 !important;
          border-radius: 6px !important;
          margin-top: 10px !important;
          font-size: 14px !important;
        }
        .price-table-row {
          display: flex !important;
          justify-content: space-between !important;
          padding: 8px 18px !important;
          border-bottom: 1px solid #eaf3fb !important;
        }
        .price-table-row:last-child {
          border-bottom: none !important;
        }
        .price-table-total {
          font-weight: bold !important;
          color: #0a4fa3 !important;
          font-size: 14px !important;
          padding-top: 7px !important;
          border-top: 1.5px solid #c6d6e2 !important;
        }
        .important-info-title {
          color: #0a4fa3 !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          margin-bottom: 8px !important;
        }
        .important-info {
          font-size: 12px !important;
          color: #222 !important;
          margin-top: 2px !important;
        }
        .important-info p {
          margin: 0 0 5px 0 !important;
          text-indent: -8px !important;
          padding-left: 16px !important;
        }
        .page-break {
          page-break-before: always !important;
        }
        .footer {
          font-size: 12px !important;
          text-align: center !important;
          color: #666 !important;
        }
        .footer .footer-company {
          font-size: 14px !important;
          font-weight: bold !important;
          color: #0a4fa3 !important;
          margin-bottom: 3px !important;
        }
        .footer .footer-divider {
          border-bottom: 1px solid #d6e2ef !important;
          margin: 10px 0 !important;
        }
        .pnr-section {
          display: flex !important;
          gap: 10px !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 5px 0 18px 0 !important;
        }
        .pnr-label {
          font-size: 13px !important;
          letter-spacing: 1px !important;
          color: #888 !important;
          font-weight: 500 !important;
          margin-bottom: 2px !important;
        }
        .pnr-value {
          font-size: 13px !important;
          font-weight: bold !important;
          color: #0a4fa3 !important;
        }
        .flight-rote-flex-container {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
        }
        .flight-rote-flex-group {
          display: flex !important;
          align-items: center !important;
          gap: 1rem !important;
        }
        .flight-rote-company-logo {
          width: 2.5rem !important;
          height: 2.5rem !important;
          object-fit: contain !important;
        }
        .flight-rote-company-name {
          font-weight: 500 !important;
          color: #374151 !important;
        }
        .flight-rote-flight-details {
          font-size: 0.875rem !important;
          color: #6b7280 !important;
        }
        .flight-rote-airport-code {
          font-size: 1.125rem !important;
          line-height: 1.75rem !important;
          font-weight: 700 !important;
        }
        .flight-rote-city-name {
          font-size: 0.75rem !important;
          line-height: 1rem !important;
          color: #6b7280 !important;
        }
        .flight-rote-flight-icon {
          width: 2rem !important;
          height: 2rem !important;
        }
        .flight-rote-date-text {
          font-size: 0.875rem !important;
          color: #374151 !important;
        }
        .flight-details-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 16px !important;
        }
        .flight-details-text-2xl {
          font-size: 1.5rem !important;
          font-weight: bold !important;
        }
        .flight-details-text-sm {
          font-size: 0.875rem !important;
          color: #718096 !important;
        }
        .flight-details-text-xs {
          font-size: 0.75rem !important;
          color: #a0aec0 !important;
        }
        .flight-details-font-bold {
          font-weight: bold !important;
        }
        .flight-details-mb-6 {
          margin-bottom: 24px !important;
        }
        .flight-details-flex {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .flight-details-w-24 {
          width: 96px !important;
        }
        .flight-details-h-px {
          height: 1px !important;
        }
        .flight-details-bg-gray-300 {
          background-color: #e2e8f0 !important;
        }
        .flight-details-my-2 {
          margin-top: 8px !important;
          margin-bottom: 8px !important;
        }
        .flight-details-mx-auto {
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .flight-details-text-right {
          text-align: right !important;
        }
        .flight-details-mt-1 {
          margin-top: 4px !important;
        }
        .pax_details-container {
          overflow-x: auto !important;
          border: 1px solid #ccc;
          border-radius: 10px;
          margin-top: 1rem;
        }
        .pax_details-table {
          min-width: 100% !important;
          width: 100% !important;
        }
        .pax_details-thead {
          background-color: #f9fafb !important;
        }
        .pax_details-th {
          padding: 0.75rem 1.25rem !important;
          text-align: left !important;
          font-size: 0.75rem !important;
          font-weight: bold !important;
          color: #000000 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .pax_details-tbody {
          background-color: white !important;
        }
        .pax_details-tr {
          border-bottom: 1px solid #e5e7eb !important;
        }
        .pax_details-td {
          padding: 1rem 1.25rem !important;
          white-space: nowrap !important;
          vertical-align: top !important;
        }
        .pax_details-passenger-name {
          font-weight: 500 !important;
          color: #111827 !important;
        }
        .pax_details-passenger-email {
          font-size: 0.875rem !important;
          color: #6b7280 !important;
        }
        .pax_details-passenger-phone {
          font-weight: 500 !important;
          color: #2563eb !important;
          font-size: 0.875rem !important;
        }
        .pax_details-ticket-number {
          font-family: monospace !important;
          color: #111827 !important;
        }
        .pax_details-baggage-container {
          display: flex !important;
          gap: 0.75rem !important;
        }
        .pax_details-baggage-item {
          display: flex !important;
          align-items: center !important;
          gap: 0.375rem !important;
        }
        .pax_details-icon {
          width: 1rem !important;
          height: 1rem !important;
          color: #6b7280 !important;
        }
        .pax_details-baggage-text {
          color: #374151 !important;
          font-size: 0.875rem !important;
        }
        .airline-logo-fallback {
          width: 40px !important;
          height: 40px !important;
          background-color: #f0f0f0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 4px !important;
          font-size: 12px !important;
          font-weight: bold !important;
          color: #666 !important;
        }
        @media print {
          body, .container {
            background: #fff !important;
            color: #222 !important;
          }
          .header {
            margin-bottom: 10px !important;
          }
          .section-title {
            margin-top: 20px !important;
          }
          .price-table {
            margin-top: 15px !important;
          }
          .divider, .footer-divider {
            border-color: #c6d6e2 !important;
          }
        }
      </style>

      <div class="container">
        <!-- Header Section -->
        <div class="header">
          <div>
            <img src="/logo.png" class="w-40 mb-2" alt="pdfFlight" style="width: 150px !important; margin-bottom: 8px !important;"/>
          </div>
          <div style="text-align: right !important;">
            <p style="font-size: 14px !important;"><b>Booking ID:</b> <span style="color: #0a4fa3 !important;">${
              booking?.data?.data?.Booking_RefNo || "N/A"
            }</span></p>
            <p style="font-size: 14px !important;"><b>Booking Date:</b> <span style="color: #0a4fa3 !important;"> ${formatDate(
              booking?.data?.data?.Booking_DateTime
            )} (${formatTime(booking?.data?.data?.Booking_DateTime)})</span></p>
            <p style="font-size: 14px !important;"><b>Booking Status:</b> <span style="color: #0a4fa3 !important;">${
              booking?.data?.data?.Booking_Type === 1 ? "Confirmed" : "Pending"
            }</span></p>
          </div>
        </div>

        <!-- Flight Details -->
        ${booking?.data?.data?.AirPNRDetails?.map((pnr, pnrIndex) => {
          return `
            <div key="pnr-${pnrIndex}" style="margin-bottom: 16px;">
              ${pnr.Flights?.map((flight, flightIndex) => {
                const flightDuration = flight.Segments?.[0]?.Duration || "N/A";
                return `
                  <div key="flight-${pnrIndex}-${flightIndex}" style="margin-bottom: 24px;">
                    <div class="flex justify-between bg-blue/30 rounded-lg items-center px-2" style="display: flex !important; justify-content: space-between !important; align-items: center !important; padding-left: 8px !important; padding-right: 8px !important; background-color: rgba(96, 165, 250, 0.3) !important; border-radius: 0.5rem !important; margin-bottom: 1rem">
                      <p class="font-semibold text-blue" style="font-size: 14px !important; font-weight: 600 !important; color: #2563eb !important;">${flight.Origin.replace(
                        /\s*\(.*?\)/g,
                        ""
                      )} To ${flight.Destination.replace(
                  /\s*\(.*?\)/g,
                  ""
                )}</p>
                      <p class="font-semibold text-blue" style="font-size: 14px !important; font-weight: 600 !important; color: #2563eb !important;">${
                        flightDuration || "N/A"
                      }</p>
                    </div>
                    
                    <div style="border: 1px solid #e5e7eb; padding: 8px; border-radius: 12px; margin-bottom: 24px;">
                      <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
                        PNR: <span style="font-weight: 600; color: #2563eb;">${
                          pnr.Airline_PNR || "N/A"
                        }</span>
                      </p>
                      
                      ${flight.Segments?.map((segment, segmentIndex) => {
                        const departureDate = parseCustomDate(
                          segment.Departure_DateTime
                        );
                        const arrivalDate = parseCustomDate(
                          segment.Arrival_DateTime
                        );

                        return `
                          <div key="segment-${pnrIndex}-${flightIndex}-${segmentIndex}" style="margin-bottom: 24px;">
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 24px;">
                              <div style="display: flex; align-items: center; gap: 16px;">
                                ${
                                  segment.Airline_Code
                                    ? `<img
                                        src="https://tripbng-airline.s3.us-east-1.amazonaws.com/AirlinesLogo/${
                                          segment.Airline_Code
                                        }.png"
                                        alt="${segment.Airline_Name || "Airline"}"
                                        style="width: 40px; height: 40px; object-fit: contain;"
                                        onerror="this.parentNode.innerHTML='<div class=\\'airline-logo-fallback\\'>${
                                          segment.Airline_Code || "AL"
                                        }</div>';"
                                      />`
                                    : `<div class="airline-logo-fallback">${
                                        segment.Airline_Code || "AL"
                                      }</div>`
                                }
                                <div>
                                  <p style="font-weight: 500; color: #374151; margin: 0;">${
                                    segment.Airline_Name || "N/A"
                                  }</p>
                                  <p style="font-size: 14px; color: #6b7280; margin: 0;">
                                    Flight ${segment.Airline_Code || "N/A"}-${
                          segment.Aircraft_Type || "N/A"
                        }
                                  </p>
                                </div>
                              </div>
                              <div style="display: flex; align-items: center; gap: 16px;">
                                <div style="text-align: center;">
                                  <p style="font-size: 18px; font-weight: 700; margin: 0;">${getAirportCode(
                                    segment.Origin
                                  )}</p>
                                  <p style="font-size: 12px; color: #6b7280; margin: 0;">${getCityName(
                                    segment.Origin
                                  )}</p>
                                </div>
                                <img
                                  src="/icons/flightList.png"
                                  alt="flight"
                                  style="width: 32px; height: 32px;"
                                />
                                <div style="text-align: center;">
                                  <p style="font-size: 18px; font-weight: 700; margin: 0;">${getAirportCode(
                                    segment.Destination
                                  )}</p>
                                  <p style="font-size: 12px; color: #6b7280; margin: 0;">${getCityName(
                                    segment.Destination
                                  )}</p>
                                </div>
                              </div>
                              <div>
                                <p style="font-size: 14px; color: #374151; margin: 0;">
                                  ${
                                    departureDate
                                      ? formatFlightDate(
                                          segment.Departure_DateTime
                                        )
                                      : "N/A"
                                  }
                                </p>
                              </div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
                              <div>
                                <p style="font-size: 24px; font-weight: 700; margin: 0;">
                                  ${
                                    departureDate
                                      ? formatFlightTime(
                                          segment.Departure_DateTime
                                        )
                                      : "N/A"
                                  }
                                </p>
                                <p style="font-size: 14px; color: #4b5563; margin: 4px 0 0 0;">
                                  ${
                                    departureDate
                                      ? formatSegmentDate(
                                          segment.Departure_DateTime
                                        )
                                      : "N/A"
                                  }
                                </p>
                                <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0;">
                                  ${
                                    segment.Origin
                                      ? segment.Origin.split(" (")[0]
                                      : "N/A"
                                  }
                                </p>
                                <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0;">
                                  Terminal ${segment.Origin_Terminal || "N/A"}
                                </p>
                              </div>
                              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                ${
                                  flight.Segments.length === 1
                                    ? '<p style="color: #6b7280; font-weight: 500; margin: 0;">Non-stop</p>'
                                    : `<p style="color: #6b7280; font-weight: 500; margin: 0;">
                                    ${flight.Segments.length - 1} stop${
                                        flight.Segments.length - 1 > 1
                                          ? "s"
                                          : ""
                                      }
                                  </p>`
                                }
                                <p style="color: #6b7280; font-weight: 500; margin: 4px 0 0 0;">
                                  ${
                                    segment.Duration
                                      ? `${parseInt(
                                          segment.Duration.split(":")[0] || 0
                                        )}h ${parseInt(
                                          segment.Duration.split(":")[1] || 0
                                        )}m Duration`
                                      : "N/A"
                                  }
                                </p>
                              </div>
                              <div style="text-align: right;">
                                <p style="font-size: 24px; font-weight: 700; margin: 0;">
                                  ${
                                    arrivalDate
                                      ? formatFlightTime(
                                          segment.Arrival_DateTime
                                        )
                                      : "N/A"
                                  }
                                </p>
                                <p style="font-size: 14px; color: #4b5563; margin: 4px 0 0 0;">
                                  ${
                                    arrivalDate
                                      ? formatSegmentDate(
                                          segment.Arrival_DateTime
                                        )
                                      : "N/A"
                                  }
                                </p>
                                <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0;">
                                  ${
                                    segment.Destination
                                      ? segment.Destination.split(" (")[0]
                                      : "N/A"
                                  }
                                </p>
                                <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0;">
                                  Terminal ${
                                    segment.Destination_Terminal || "N/A"
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        `;
                      }).join("")}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          `;
        }).join("")}

        <!-- Passenger Table -->
        <h2 style="font-size: 18px !important; font-weight: bold !important; color: #000000 !important;">
          Traveller Information
        </h2>
        <div class="pax_details-container">
          <table class="pax_details-table">
            <thead class="pax_details-thead">
              <tr class="pax_details-tr">
                <th class="pax_details-th">Passenger</th>
                <th class="pax_details-th">Gender</th>
                <th class="pax_details-th">Ticket No.</th>
                <th class="pax_details-th">Baggage</th>
              </tr>
            </thead>
            <tbody class="pax_details-tbody">
              ${booking?.data?.data?.AirPNRDetails[0]?.PAXTicketDetails?.map(
                (pax, paxIndex) => {
                  const ticketNumber = 
                    pax.TicketDetails?.[0]?.Ticket_Number || "N/A";
                  const handBaggage = 
                    pax.Fares?.[0]?.FareDetails?.[0]?.Free_Baggage?.Hand_Baggage || "N/A";
                  const checkInBaggage = 
                    pax.Fares?.[0]?.FareDetails?.[0]?.Free_Baggage?.Check_In_Baggage || "N/A";
                  
                  return `
                    <tr class="pax_details-tr" key="pax-${paxIndex}">
                      <td class="pax_details-td">
                        <div class="pax_details-passenger-name">
                          ${getPassengerTitle(pax.Gender, pax.Pax_Type)} ${
                            pax.First_Name || ""
                          } ${pax.Last_Name || ""}
                        </div>
                        <img src="/barcode.png" alt="barcode" style="width: 200px !important; height: 70px !important; margin-top: 1rem !important;" />
                      </td>
                      <td class="pax_details-td">
                        ${pax.Gender === 0 ? "Male" : "Female"}
                      </td>
                      <td class="pax_details-td pax_details-ticket-number">
                        ${ticketNumber}
                      </td>
                      <td class="pax_details-td">
                        <div class="pax_details-baggage-container">
                          <div class="pax_details-baggage-item">
                            <span class="pax_details-icon">✈️</span>
                            <span class="pax_details-baggage-text">${handBaggage} kg</span>
                          </div>
                          <div class="pax_details-baggage-item">
                            <span class="pax_details-icon">🧳</span>
                            <span class="pax_details-baggage-text">${checkInBaggage} kg</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  `;
                }
              ).join("")}
            </tbody>
          </table>
        </div>

        <!-- Price Information -->
        <div class="page-break"></div>
        <h2 style="font-size: 18px !important; font-weight: bold !important; color: #000000 !important; margin-top: 1rem;">
          Price Information
        </h2>
        <div style="width:100%;border:1.2px solid #c6d6e2;border-radius:6px;margin:10px 0 15px;font-size:14px;background:#fff; margin-top: 1rem; overflow: hidden;">
          <div style="display:flex;justify-content:space-between;padding-bottom:15px;padding-left:20px;padding-right:20px;border-bottom:1px solid #eaf3fb;">
            <span>Base Fare</span>
            <span style="font-weight:500;color:#2d2d2d">₹ ${
              booking?.data?.data?.Total_BaseFare || "0.00"
            }</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding-bottom:15px;padding-left:20px;padding-right:20px;border-bottom:1px solid #eaf3fb;">
            <span>Taxes & Fees</span>
            <span style="font-weight:500;color:#2d2d2d">₹ ${
              booking?.data?.data?.Total_Tax || "0.00"
            }</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding-bottom:15px;padding-left:20px;padding-right:20px;border-bottom:1px solid #eaf3fb;">
            <span>Add-on Services</span>
            <span style="font-weight:500;color:#2d2d2d">₹ 0.00</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding-bottom:15px;padding-left:20px;padding-right:20px;background:#f5f9ff;border-top:1.5px solid #c6d6e2;">
            <span style="font-weight:600;color:#0a4fa3">Net Sale Amount</span>
            <span style="font-weight:600;color:#0a4fa3">₹ ${
              booking?.data?.data?.Total_Amount || "0.00"
            }</span>
          </div>
        </div>

        <!-- Important Information -->
        <div class="flex justify-between bg-blue/30 rounded-lg items-centerpx-2" style="display: flex !important; justify-content: space-between !important; align-items: center !important; padding-left: 8px !important; padding-right: 8px !important; background-color: rgba(96, 165, 250, 0.3) !important; border-radius: 0.5rem !important;">
          <p class="font-semibold text-blue" style="font-size: 14px !important; font-weight: 600 !important; color: #2563eb !important;">Important Information</p>
        </div>
        <div class="important-info">
          <p style="font-size: 12px !important;">• Carry a printed copy of this e-ticket and present it to the airline counter at time of check-in.</p>
          <p style="font-size: 12px !important;">• Check-in starts 2 hours before scheduled departure, and closes 60 minutes prior to the departure. It is recommended for you to report at the check-in counter at least 2 hours prior to departure time.</p>
          <p style="font-size: 12px !important;">• It is mandatory to carry Government recognised photo identification (ID) along with your E-Ticket. Valid documents: Driving License, Passport, PAN Card, Voter ID Card or any other ID issued by the Government of India. For infant passengers, it is mandatory to carry their Birth Certificate.</p>
          <p style="font-size: 12px !important;">• Passengers must confirm terminal and gate number for flight with the airline, as these can change before departure. Use PNR number for all direct communication you make with the airline, which are subject to or related to this booking.</p>
          <p style="font-size: 12px !important;">• Your Ticket number serves as confirmation of your ticket status.</p>
        </div>
        <div class="divider"></div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-company">BONTON HOLIDAYS PVT. LTD.</div>
          <div>09TH FLOOR, 909, The Summit - Business Bay, Off Andheri Kurla Road Near WEH Metro Station Opp PVR Cinema, ANDHERI, Mumbai City, Maharashtra, 400093</div>
          <div>Contact No.: +91 90237 29780 | GST No.: 27AADCB8487C3ZH</div>
          <div class="divider"></div>
          <div style="font-weight: bold !important; font-size: 14px !important; margin-bottom: 1rem !important;">©️ 2025 BONTON HOLIDAYS PVT. LTD.</div>
        </div>
      </div>
    `;

    document.body.appendChild(element);

    // PDF Generation Settings
    html2pdf(element, {
      filename: `${booking._id}_booking_details.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 3, // Tripled resolution for HD output
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        compress: true,
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
        avoid: ["tr", "td"],
      },
    }).then(() => {
      document.body.removeChild(element);
    });
  };

  return (
    <button onClick={downloadPDF} className="flex items-center gap-3">
      <Printer className="w-4 h-4" /> Print
    </button>
  );
};

export default PdfDownload;