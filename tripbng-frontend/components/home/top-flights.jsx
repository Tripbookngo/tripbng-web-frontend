"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "../ui";
import Button from "../ui/button";

const flightData = [
  {
    image: "/home/flight1.png",
  },
  {
    image: "/home/flight2.png",
  },
  {
    image: "/home/flight3.png",
  },
  {
    image: "/home/flight4.png",
  },
  {
    image: "/home/flight5.png",
  },
];

export default function TopFlights() {
  const [selected, setSelected] = useState("Domestic");
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? flightData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === flightData.length - 1 ? 0 : prev + 1));
  };

  const prevIndex = (currentIndex - 1 + flightData.length) % flightData.length;
  const nextIndex = (currentIndex + 1) % flightData.length;

  return (
    <div className="w-full py-14 bg-gradient">
      <Container className="py-10 px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-5xl font-bold text-[#125a9b] mb-3">
              Top Popular Flights
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Discover the best flight packages that fit your budget for your
              favorite destinations.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="text-sm md:text-base hover:bg-blue-50 hover:text-blue-600"
            >
              Domestic
            </Button>
            <Button
              variant="outline"
              className="text-sm md:text-base hover:bg-blue-50 hover:text-blue-600"
            >
              International
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-5xl mx-auto flex justify-center items-center">
          {/* Previous Image */}
          <div className="absolute left-0 translate-y-[10%] w-[280px] h-[200px] rounded-xl overflow-hidden shadow-md opacity-90 z-0 transition-all duration-300">
            <img
              src={flightData[prevIndex].image}
              alt="Previous Flight"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-black/80 to-transparent text-white p-3 flex flex-col justify-end">
              <h3 className="text-lg font-bold">
                {flightData[prevIndex].city}
              </h3>
            </div>
          </div>

          <div className="relative w-[420px] h-[260px] rounded-2xl overflow-hidden shadow-2xl z-10 mx-8">
            <img
              src={flightData[currentIndex].image}
              alt={flightData[currentIndex].city}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full h-[60%] bg-gradient-to-t from-black/80 to-transparent text-white p-4 flex flex-col justify-end">
              <h3 className="text-xl font-bold leading-tight">
                {flightData[currentIndex].city}
              </h3>
            </div>
          </div>

          <div className="absolute right-0 translate-y-[10%] w-[280px] h-[200px] rounded-xl overflow-hidden shadow-md opacity-90 z-0 transition-all duration-300">
            <img
              src={flightData[nextIndex].image}
              alt="Next Flight"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-black/80 to-transparent text-white p-3 flex flex-col justify-end">
              <h3 className="text-lg font-bold">
                {flightData[nextIndex].city}
              </h3>
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={handlePrev}
            style={{ backgroundColor: "#125a9b" }}
            className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 p-3 text-white rounded-full shadow-lg z-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            style={{ backgroundColor: "#125a9b" }}
            className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 p-3 text-white rounded-full shadow-lg z-20"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {flightData.map((_, idx) => (
            <span
              key={idx}
              className={`h-3 w-3 rounded-full transition ${
                currentIndex === idx ? "bg-orange-400" : "bg-gray"
              }`}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
