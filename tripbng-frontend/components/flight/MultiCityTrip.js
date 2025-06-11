import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import LocationSelector from "./LocationSelector";
import dayjs from "dayjs";
import Image from "next/image";
import { DatePicker } from "antd";
import FlightTraveller from "./FlightTraveller";

const MultiCityTrip = ({ trips, onChange, maxTrips = 6 }) => {
  const [openPickerId, setOpenPickerId] = useState(null); // Track which date picker is open

  React.useEffect(() => {
    if (trips.length === 0) {
      onChange([
        {
          id: "trip-1",
          origin: {
            code: "AMD",
            name: "Sardar Vallabhbhai Patel International Airport",
            country: "India",
          },
          destination: {
            code: "DEL",
            name: "Indira Gandhi International Airport",
            country: "India",
          },
          date: dayjs(),
        },
        {
          id: "trip-2",
          origin: {
            code: "DEL",
            name: "Indira Gandhi International Airport",
            country: "India",
          },
          destination: null,
          date: dayjs(),
        },
      ]);
    }
  }, []);

  const addTrip = () => {
    if (trips.length < maxTrips) {
      onChange([
        ...trips,
        {
          id: `trip-${Date.now()}`,
          origin: null,
          destination: null,
          date: dayjs(),
        },
      ]);
    }
  };

  const removeTrip = (id) => {
    if (trips.length > 2) {
      onChange(trips.filter((trip) => trip.id !== id));
    }
  };

  const updateTrip = (id, field, value) => {
    onChange(
      trips.map((trip) => (trip.id === id ? { ...trip, [field]: value } : trip))
    );
  };

  return (
    <div className="">
      {trips.map((trip, index) => (
      <div
      key={trip.id}
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-3 max-w-[1200px] mx-auto bg-white rounded-lg relative",
        "animate-fade-in transition-all duration-300"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
    
          <div className="border py-0.5 px-3 rounded-l-xl hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
            <LocationSelector
              label="From"
              placeholder="Select origin"
              value={trip.origin}
              onChange={(city) => updateTrip(trip.id, "origin", city)}
              className="md:col-span-4"
            />
          </div>
          <div className="border py-0.5 px-3 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
            <LocationSelector
              label="To"
              placeholder="Select destination"
              value={trip.destination}
              onChange={(city) => updateTrip(trip.id, "destination", city)}
              excludeCity={trip.origin}
              className="md:col-span-4"
            />
          </div>
          <div
            className="relative border py-2 px-2 hover:bg-yellow/10 transition-all duration-300 cursor-pointer"
            onClick={() => setOpenPickerId(trip.id)}
          >
            <span className="flex items-center gap-3 mb-3">
              <p className="text-xs text-neutral-400 ">Departure</p>
              <Image src="/icons/dateDown.png" width={25} height={25} />
            </span>
            <div className="flex flex-col items-start">
              <span className="flex items-baseline gap-2">
                <p className="text-3xl font-bold">
                  {trip.date ? trip.date.format("D") : "DD"}
                </p>
                <p className="text-2xl">
                  {trip.date ? trip.date.format("MMM'YY") : "MMM'YY"}
                </p>
              </span>
              <p className="text-lg text-gray">
                {trip.date ? trip.date.format("dddd") : "Day"}
              </p>
            </div>
          </div>

          {openPickerId === trip.id && (
            <div
              className="absolute z-50 bg-white p-2 shadow-lg rounded-md"
              style={{
                top: "60%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <DatePicker
                value={trip.date}
                onChange={(date) => {
                  updateTrip(trip.id, "date", date);
                  setOpenPickerId(null);
                }}
                format="D MMM'YY"
                open
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
                className="w-[250px] px-2 py-1 bg-transparent focus:outline-none font-semibold text-2xl text-black"
              />
            </div>
          )}
          {index === 0 && <FlightTraveller />}

          {trips.length > 2 && index === trips.length - 1 && (
            <button
              type="button"
              onClick={() => removeTrip(trip.id)}
              className="absolute -top-3 -right-3 bg-white rounded-full p-1.5 shadow-md border border-slate-200 text-slate-400 hover:text-destructive hover:border-destructive/30 transition-colors"
              aria-label="Remove trip"
            >
              <Trash2 size={16} />
            </button>
          )}

          {trips.length < maxTrips &&
          index !== 0 &&
          index === trips.length - 1 ? (
            <button
              type="button"
              onClick={addTrip}
              className="w-full py-3 flex items-center justify-center space-x-2 border border-dashed border-slate-300 rounded-r-lg text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
            >
              <Plus size={16} />
              <span>Add another flight</span>
            </button>
          ) : index !== 0 ? (
            <div className="w-full py-3 flex items-center justify-center space-x-2 border border-slate-300 rounded-r-lg text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"></div>
          ) : null}
        </div>
      ))}

      {trips.length >= maxTrips && (
        <div className="text-xs text-center text-slate-500">
          Maximum {maxTrips} trips allowed per booking
        </div>
      )}
    </div>
  );
};

export default MultiCityTrip;
