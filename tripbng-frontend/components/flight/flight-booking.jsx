"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import Button from "../ui/button";
import { FlightVector } from "../icons";
import { Clock, MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FlightBooking({
  flightData,
  selectedIndex,
  searchKey,
  onClose,
}) {
  const steps = ["flight-details", "cancellation", "rescheduling"];
  const [step, setStep] = useState("flight-details");
  const [open, setOpen] = useState(true);
  console.log("hh", flightData);

  const handleNextStep = () => {
    if (step !== steps[steps.length - 1]) {
      setStep(steps[steps.indexOf(step) + 1]);
    }
  };

  const handlePrevStep = () => {
    if (step !== steps[0]) {
      setStep(steps[steps.indexOf(step) - 1]);
    }
  };
  const handleSheetClose = () => {
    setOpen(false);
    // Notify the parent to reset selectedFlight to null
    if (onClose) {
      onClose();
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: "short", day: "2-digit", month: "short" };
    return date.toLocaleDateString("en-US", options);
  }
  const serialzedData = encodeURIComponent(JSON.stringify(flightData));

  const checkoutUrl = `/flight-search/76347823/checkout?flightData=${serialzedData}&selectedIndex=${selectedIndex}`;
  return (
    <Sheet open={open} onOpenChange={handleSheetClose}>
      {/* <SheetTrigger>
        <Button>{flightData.Fares[0].FareDetails[0].Basic_Amount}</Button>
      </SheetTrigger> */}
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center space-x-10 border-b">
            {steps.map((item) => (
              <div key={item} className="text-center">
                <button
                  className={`text-sm ${
                    step === item ? "text-blue" : "text-neutral-500"
                  }`}
                  onClick={() => setStep(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
                <div
                  className={`w-full h-1 mt-2 ${
                    step === item ? "bg-blue" : "bg-gray-200"
                  } rounded-full`}
                />
              </div>
            ))}
          </div>
        </SheetHeader>

        {/* Flight Details */}
        {step === "flight-details" && (
          <div className="mt-4 border rounded-xl border-dashed p-4 grid grid-cols-1 lg:grid-cols-1 justify-between items-center gap-6">
            <div>
              <div>
                <div className="flex items-center gap-3">
                  <h4>{flightData.Segments[0].Origin_City}</h4>
                  <MoveRight />
                  <h4>
                    {flightData.Segments.length === 1
                      ? flightData.Segments[0].Destination_City
                      : flightData.Segments[flightData.Segments.length - 1]
                          .Destination_City}
                  </h4>
                </div>
                <p className="text-sm mt-2">
                  <span>{formatDate(flightData.TravelDate)}</span> *{" "}
                  <span className="text-neutral-400">
                    {flightData.Segments[0].Duration}
                  </span>
                  *<span className="text-neutral-400">Economy</span>
                </p>
              </div>
              {flightData.Segments.map((segment, index) => (
                <div key={index} className="bg-gray-500/20 p-3 mb-1 rounded-lg mt-4">
                  <div
                    key={index}
                    className="flex  md:flex-row items-center w-full gap-4  "
                  >
                    <div>
                      <Image
                        src="/images/QP.png"
                        alt="Airline Logo"
                        width={16} height={16}
                        className="w-8 h-8 md:w-16 md:h-16"
                      />
                      <div>
                        <p className="text-base font-semibold">
                          {segment.Airline_Name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {segment.Aircraft_Type} {segment.Airline_Code}
                        </p>
                        <p className="text-sm text-blue-500 font-medium">
                          Economy
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {segment.Departure_DateTime.split(" ")[1]}
                      </p>
                      <span className="text-sm text-gray-500">
                        {segment.Origin}
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-full gap-4 md:px-4">
                      <div className="border-t-2 border-dashed border-gray-400 w-full"></div>
                      <div className="flex flex-col items-center text-center">
                        <FlightVector />
                        <p className="text-xs text-blue-500 whitespace-nowrap mt-1">
                          {segment.Duration}
                        </p>
                      </div>
                      <div className="border-t-2 border-dashed border-gray-400 w-full"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {segment.Arrival_DateTime.split(" ")[1]}
                      </p>
                      <p className="text-sm text-gray-500">
                        {segment.Destination}
                      </p>
                    </div>
                  </div>
                  <div className=" border-b-2 border-white mt-2 mb-2"></div>
                  <div className="flex md:flex-row flex-col items-center gap-5">
                    <div className="flex items-center gap-1">
                      <Image src="/icons/bag.png" className="w-8 h-8" width={16} height={16} alt="Flight Img"/>
                      <div>
                        <span className="font-semibold mr-2 text-sm">
                          Cabin Baggage:
                        </span>
                        <span className="font-medium text-sm">
                          {flightData.Fares[
                            selectedIndex
                          ].FareDetails[0].Free_Baggage.Check_In_Baggage.substring(
                            0,
                            2
                          )}{" "}
                          Kgs (1 piece only) / Adult
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image src="/icons/suitcase.png" className="w-8 h-8"width={16} height={16} alt="Flight Img"/>
                      <div>
                        <span className="font-semibold mr-2 text-sm">
                          Check-In Baggage:
                        </span>
                        <span className="font-medium text-sm">
                          {flightData.Fares[
                            selectedIndex
                          ].FareDetails[0].Free_Baggage.Hand_Baggage.substring(
                            0,
                            2
                          )}{" "}
                          Kgs (1 piece only) / Adult
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-4">
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {flightData.Segments[0]?.Departure_DateTime?.split(" ")[1]}
                  </p>
                  <span className="text-sm text-gray-500">
                    {flightData.Segments[0].Origin_City}
                  </span>
                </div>
                <div className="flex items-center justify-center w-full gap-4 md:px-4">
                  <div className="border-t-2 border-dashed border-gray-400 w-full"></div>
                  <div className="flex flex-col items-center text-center">
                    <FlightVector />
                    <p className="text-xs text-blue-500 whitespace-nowrap">
                      7h 30m * Direct
                    </p>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-400 w-full"></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {flightData.Segments[0]?.Arrival_DateTime?.split(" ")[1]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {flightData.Segments.length === 1
                      ? flightData.Segments[0].Destination_City
                      : flightData.Segments[flightData.Segments.length - 1]
                          .Destination_City}{" "}
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        )}

        {/* Cancellation Step */}
        {step === "cancellation" && (
          <div className="mt-4 border rounded-xl border-dashed p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center items-center">
              <div className="text-center">
                <p className="text-sm text-gray-400">₹0 Refund</p>
                <p className="text-sm text-gray-400">(₹2999 + ₹300)*</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">₹0 Refund</p>
                <p className="text-sm text-gray-400">(₹2999 + ₹300)*</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 my-4" />
            <div className="grid grid-cols-3 justify-center items-center">
              <div className="text-center">
                <p className="text-sm text-gray-400">Now</p>
                <p className="text-sm text-gray-400">14:31</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Now</p>
                <p className="text-sm text-gray-400">14:31</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Now</p>
                <p className="text-sm text-gray-400">14:31</p>
              </div>
            </div>
            <div className="text-sm space-y-4 mt-10">
              <p>
                *Cancellation charges applicable (Airline fee + tripbookngo fee)
              </p>
              <p>
                Total refund amount applicable for 1 traveller. In case of
                partial cancellation, refund amount will vary.
              </p>
              <p className="text-blue">View Terms & Conditions</p>
            </div>
          </div>
        )}

        {/* Rescheduling Step */}
        {step === "rescheduling" && (
          <div className="mt-4 border rounded-xl border-dashed p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center items-center">
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  ₹4500 + Fare difference Refund
                </p>
                <p className="text-sm text-gray-400">(₹2999 + ₹300)*</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  ₹4500 + Fare difference Refund
                </p>
                <p className="text-sm text-gray-400">(₹2999 + ₹300)*</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 my-4" />
            <div className="grid grid-cols-3 justify-center items-center">
              <div className="text-center">
                <p className="text-sm text-gray-400">Now</p>
                <p className="text-sm text-gray-400">14:31</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Now</p>
                <p className="text-sm text-gray-400">14:31</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Now</p>
                <p className="text-sm text-gray-400">14:31</p>
              </div>
            </div>
            <div className="text-sm space-y-4 mt-10">
              <p>
                *Cancellation charges applicable (Airline fee + tripbookngo fee)
              </p>
              <p>
                Total refund amount applicable for 1 traveller. In case of
                partial cancellation, refund amount will vary.
              </p>
              <p className="text-blue">View Terms & Conditions</p>
            </div>
          </div>
        )}

        {/* Booking Info & Action */}
        <div className="absolute bottom-4 flex justify-between  border-t-2 pt-2 px-4 sm:px-8 left-1 w-full right-4">
          <div className="flex flex-col items-end">
            <p className="text-xl font-bold text-red-600">
              ₹
              {flightData.Fares[selectedIndex || 0].FareDetails[0].Basic_Amount}
            </p>
            <p className="text-sm text-gray-400 line-through">₹46,000</p>
          </div>
          {/* <Link href={"/flight-search/76347823/checkout"} > */}
          <Link href={checkoutUrl}>
            <Button>BOOK NOW</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
