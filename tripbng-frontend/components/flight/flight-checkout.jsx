import { Clock, MoveRight } from "lucide-react";
import React from "react";
import { FlightVector } from "../icons";
import Image from "next/image";

export default function FlightCheckout() {
  return (
    <div>
      {" "}
      <div className="mt-4 border rounded-xl border-dashed p-4 grid grid-cols-2 justify-between items-center gap-10">
        <div>
          <div>
            <div className="flex items-center gap-3">
              <h4>Rajkot</h4>
              <MoveRight />
              <h4>Mumbai</h4>
            </div>
            <p className="text-sm mt-2">
              <span>wed, 28 Aug</span> *{" "}
              <span className="text-neutral-400">1h 0m</span>*
              <span className="text-neutral-400">Economy</span>
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 min-w-fit mt-4">
            <div>
              <Image
                src="/images/QP.png"
                alt="Airline Logo"
                className="w-12 h-12"
              />
              <div>
                <p className="text-base font-semibold">Air India</p>
                <p className="text-sm text-gray-500">AO 465, AI 164</p>
                <p className="text-sm text-blue-500 font-medium">Economy</p>
              </div>
            </div>
            <div className="text-sm flex items-center gap-2 text-green-500 bg-green-500/20 p-1 w-fit rounded-xl">
              <Clock size={14} />
              <span>99% On time</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-4">
            <div className="text-center">
              <p className="text-lg font-semibold">07:00</p>
              <span className="text-sm text-gray-500">AMD</span>
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
              <p className="text-lg font-semibold">13:30</p>
              <p className="text-sm text-gray-500">Phuket</p>
            </div>
          </div>
        </div>
        <div className="text-sm">
          <div className="flex justify-between items-center gap-4">
            <div>
              <p>Baggage</p>
              <p>Per Traveller</p>
            </div>
            <div>
              <p>Cabin</p>
              <p>7 Kg (1 piece per person)</p>
            </div>
            <div>
              <p>Check-in</p>
              <p>15 Kb (1 piece only)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
