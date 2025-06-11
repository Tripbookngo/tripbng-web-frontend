"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Users, Users2 } from "lucide-react";

const FlightTraveller = ({ travelerCounts, setTravelerCounts, module }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleCountChange = (type, value) => {
    setTravelerCounts((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleDone = () => {
    setDropdownOpen(false); // Close dropdown when "Done" is clicked
  };
  return (
    <div className="py-2 px-2 rounded-r-xl w-full hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
      {module === "FlightList" ? (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Users size={12} /> Travellers & Class
        </p>
      ) : (
        <p className="text-xs text-neutral-400 lg:mb-5">Travelers & Class</p>
      )}
      <Select
        open={isDropdownOpen}
        onOpenChange={(isOpen) => setDropdownOpen(isOpen)}
      >
        <SelectTrigger
          className={module === "FlightList" ? "lg:-mt-1" : "w-full lg:mt-1"}
        >
          <SelectValue
            placeholder={
              <div className="flex flex-col items-start h-[100%]">
                <span className="flex items-baseline gap-1  text-base font-semibold">
                  <p
                    className={` ${
                      module === "FlightList"
                        ? "text-base font-semibold text-gray-900"
                        : "lg:text-2xl"
                    }`}
                  >
                    {travelerCounts.a + travelerCounts.c + travelerCounts.i}
                  </p>
                  <p
                    className={`${
                      module === "FlightList"
                        ? "text-base font-semibold text-gray-900"
                        : "lg:text-xl"
                    }`}
                  >
                    {travelerCounts.a + travelerCounts.c + travelerCounts.i > 1
                      ? "Travelers,"
                      : "Traveler,"}{" "}
                    {module === "FlightList" && (
                      <span className="truncate">
                        {
                          [
                            "Economy",
                            "Premium Economy",
                            "Business",
                            "First Class",
                          ][travelerCounts.tp]
                        }
                      </span>
                    )}
                  </p>
                </span>
                {module !== "FlightList" && (
                  <span className="text-sm -mt-2 lg:mt-0 lg:text-sm text-gray font-medium">
                    {
                      ["Economy", "Premium Economy", "Business", "First Class"][
                        travelerCounts.tp
                      ]
                    }
                  </span>
                )}
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent className="bg-white p-2 shadow-md rounded-md h-auto max-h-none ">
          {/* Adults Selector */}
          <h1 className="text-xl font-semibold mb-3">Travellers</h1>
          <div className="flex items-start justify-between gap-5 mb-3">
            <div className="flex flex-col w-28">
              <span className="text-sm">ADULTS </span>
              <span className="text-xs text-gray">(12y +)</span>
            </div>
            <div className="flex bg-gray-200 rounded-sm mt-1 items-center w-full justify-start">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={`adult-${num}`}
                  className={`px-3 py-1 rounded-md text-lg ${
                    travelerCounts.a === num
                      ? "bg-yellow text-white font-semibold"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleCountChange("a", num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          {/* Children Selector */}
          <div className="flex items-start justify-between gap-5 mb-3">
            <div className="flex flex-col w-28">
              <span className="text-sm">CHILDREN </span>
              <span className="text-xs text-gray">(2y - 12y)</span>
            </div>
            <div className="flex bg-gray-200 rounded-sm mt-1 items-center w-full justify-start">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={`children-${num}`}
                  className={`px-3 py-1 rounded-md text-lg ${
                    travelerCounts.c === num
                      ? "bg-yellow text-white font-semibold"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleCountChange("c", num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          {/* Infants Selector */}
          <div className="flex items-start justify-between gap-5 mb-3">
            <div className="flex flex-col w-28">
              <span className="text-sm">INFANTS </span>
              <span className="text-xs text-gray">(below 2y)</span>
            </div>
            <div className="flex bg-gray-200 rounded-sm mt-1 items-center justify-start  w-full">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={`infant-${num}`}
                  className={`px-3 py-1 rounded-md text-lg ${
                    travelerCounts.i === num
                      ? "bg-yellow text-white font-semibold"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleCountChange("i", num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray/20 rounded-lg p-2 mt-2 flex gap-2">
            <Users2 size={20} className="mt-1" />
            <div className="flex flex-col">
              <p>
                Planning a trip for{" "}
                <span className="font-semibold">more than 9 travellers?</span>
              </p>
              <p className="text-yellow font-semibold underline text-sm">
                Create Group Booking
              </p>
            </div>
          </div>
          {/* Travel Class Selector */}
          <div className="mt-1">
            <span className="text-lg font-semibold">Travel Class</span>
            <div className="flex bg-gray-200 rounded-sm">
              {["Economy", "Premium Economy", "Business", "First Class"].map(
                (type, index) => (
                  <button
                    key={`travelType-${index}`}
                    className={`px-2 py-1 rounded-md ${
                      travelerCounts.tp === index
                        ? "bg-yellow text-white font-semibold"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleCountChange("tp", index)}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="flex">
            <button
              onClick={handleDone}
              className="bg-yellow text-white font-semibold ml-auto py-2 rounded-md mt-4 px-5"
            >
              Done
            </button>
          </div>{" "}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FlightTraveller;
