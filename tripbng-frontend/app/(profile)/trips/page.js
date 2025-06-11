"use client";

import { useState } from "react";
import HotelPage from "./hotel/page";
import BusPage from "./bus/page";
import VisaPage from "./visa/page";
import FlightsPage from "./flights/page";

export default function Page() {
  const [activeTab, setActiveTab] = useState("flights"); // Default to "flights"

  const renderContent = () => {
    switch (activeTab) {
      case "flights":
        return <FlightsPage />;
      case "hotels":
        return <HotelPage />;
      case "holidays":
        return <div>Holidays Section</div>;
      case "visa":
        return <VisaPage />;
      default:
        return <FlightsPage />;
    }
  };

  return (
    <div className="container py-10">
      <h1 className="font-semibold text-2xl">My Bookings</h1>
      <div className="mt-10 bg-white shadow-lg rounded-lg">
        <nav className="tab-navigation flex items-center justify-between border-b ">
          {["flights", "hotels", "holidays", "visa"].map((tab) => (
            <button
              key={tab}
              className={`tab-button text-xl px-4 py-2 w-full font-medium ${
                activeTab === tab
                  ? "border-b-4 border-yellow text-yellow"
                  : "border-b-4 border-transparent"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        <div className="tab-content mt-5">{renderContent()}</div>
      </div>
    </div>
  );
}
