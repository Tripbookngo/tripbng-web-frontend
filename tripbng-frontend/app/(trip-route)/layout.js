"use client";
import { TopFlights, TravelIntro, FlightDeals, HolidaySlider, HotelSlider, Cta } from "@/components/home";
import OffersCard from "@/components/home/offers-card";
import Testimonial from "@/components/home/testimonial";
import {
  BusColorIcon, BusIcon, FlightColorIcon, FlightIcon,
  HolidayColorIcon, HolidayIcon, HotelColorIcon, HotelIcon,
  VisaColorIcon, VisaIcon
} from "@/components/icon";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import Footer from "@/components/layout/footer";

const navItems = [
  { title: "Flights", url: "/", icon: FlightIcon, activeIcon: FlightColorIcon, image: "/nav/plane.png" },
  { title: "Hotels", url: "/hotel", icon: HotelIcon, activeIcon: HotelColorIcon, image: "/nav/hotel.png" },
  { title: "Buses", url: "/bus", icon: BusIcon, activeIcon: BusColorIcon, image: "/nav/bus.png" },
  { title: "Holidays", url: "/holiday", icon: HolidayIcon, activeIcon: HolidayColorIcon, image: "/nav/holiday.png" },
  { title: "Visa", url: "/visa", icon: VisaIcon, activeIcon: VisaColorIcon, image: "/nav/visa.png" },
];

export default function Layout({ children }) {
  const pathname = usePathname();
 
  const heroBackgrounds = {
    "/": "url('/hero-image.png')",
    "/hotel": "url('/hero-image.png')",
    "/bus": "url('/hero-image.png')",
    "/holiday": "url('/hero-image.png')",
    "/visa": "url('/hero-image.png')",
  };

  const currentBackground = heroBackgrounds[pathname] || "url('/hero-image.png')";

  return (
    <>
      <div className="">
        {/* Desktop Hero + Nav */}
        <div className="relative min-h-[70vh] hidden md:block   items-center  ">
          {/* Background image with cover and bottom anchor */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: currentBackground,
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
              backgroundRepeat: 'no-repeat',
              height: '100%',
              width: '100%',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-blue-700/60"></div>
          </div>
          <div className="overlay flex flex-col flex-1">
            <div className="pt-24 md:pt-36 xl:pt-48 flex-1 flex flex-col">
              <div className="container relative">
                {/* Booking Tabs */}
                <div
                  id="booking-tabs-container"
                  className="max-w-full sm:max-w-2xl md:max-w-3xl mx-auto flex items-center gap-2 sm:gap-4 md:gap-8 xl:gap-12 shadow-xl bg-white justify-around rounded-xl md:rounded-full py-2 px-2 sm:px-6 md:px-12 xl:px-20 absolute -top-14 md:-top-20 left-1/2 -translate-x-1/2"
                >
                  {navItems.map((item) => {
                    const isActive = pathname === item.url;
                    const Icon = isActive ? item.activeIcon : item.icon;
                    return (
                      <Link href={item.url} key={item.title}>
                        <button
                          className={`flex items-center flex-col bg-white shadow-md py-2 px-2 rounded-lg md:bg-transparent md:shadow-none md:py-0 md:px-0 md:rounded-none gap-1 md:gap-2 text-xs sm:text-sm md:text-base ${
                            isActive ? "text-black" : "text-neutral-500"
                          }`}
                        >
                          <Icon className="w-5 h-5 md:w-6 md:h-6" />
                          <span className={`${isActive ? "border-b-4 border-yellow" : ""}`}>
                            {item.title}
                          </span>
                        </button>
                      </Link>
                    );
                  })}
                </div>
                {/* Main Content */}
                <div className="p-3">{children}</div>
              </div>
            </div>
            {/* Cta at the bottom of hero image, only on desktop */}
            <div className="mt-auto lg:mb-20 md:mb-8 md:flex justify-center">
        
            </div>
          </div>
          
        </div>
       
        

        {/* Mobile/Tablet Nav */}
        <div className="md:hidden md:pt-16">
          <div className="flex items-center justify-between gap-2 py-1 px-2 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link href={item.url} key={item.title}>
                  <button className="p-3 flex flex-col items-center justify-center gap-2 min-w-20 min-h-20 w-20 h-20">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                    <span
                      className={`text-xs text-center pb-1 px-2 ${
                        isActive ? "border-b-4 border-blue" : ""
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                </Link>
              );
            })}
          </div>
          <div className="p-2">{children}</div>
        </div>
        
        {/* Content Sections */}
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-8">
       <Cta/>
          <OffersCard />
          <FlightDeals />
          <HotelSlider />
          <HolidaySlider />
          <TopFlights />
          <TravelIntro />
          <Testimonial />
        </div>
        <Footer />
      </div>
    </>
  );
}
