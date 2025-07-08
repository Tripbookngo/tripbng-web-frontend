"use client";

import React, { useState, useEffect } from "react";
import { Container } from "../ui";
import Image from "next/image";
import Button from "../ui/button";
import Link from "next/link";
import { Icons } from "../icons";
import { useRouter } from "next/navigation";

const dealsData = [
  {
    title: "AirIndia",
    price: "INR 3500 Onwards",
    image: "/images/AI.png",
  },
  {
    title: "AirAsia",
    price: "INR 3000 Onwards",
    image: "/images/I5.png",
  },

  {
    title: "IndiGo",
    price: "INR 2000 Onwards",
    image: "/images/indido.png",
  },
  {
    title: "AkasaAir",
    price: "INR 2200 Onwards",
    image: "/images/QP.png",
  },
  {
    title: "Emirates",
    price: "INR 2200 Onwards",
    image: "/images/emirates.png",
  },
  {
    title: "Qatar Airways",
    price: "INR 2200 Onwards",
    image: "/images/qatar1.png",
  },
  {
    title: "Singapore Airlines",
    price: "INR 2200 Onwards",
    image: "/images/QP.png",
  },
  {
    title: "Etihad Airways",
    price: "INR 2200 Onwards",
    image: "/images/etihad1.png",
  },
];

export default function FlightDeals() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Container className="p-4 sm:p-6 md:p-8 mt-10">
      <div className="flex flex-col md:flex-row flex-wrap items-start gap-6 md:gap-10">
        {/* Left Column */}
        <div className="flex flex-col md:w-1/3 lg:w-1/4 flex-shrink-0 pl-4 md:pl-6 lg:pl-8 mb-4 md:mb-0">
          <div className="mb-4">
            <h2
              className="text-3xl md:text-5xl font-semibold mb-2 bg-gradient-to-r from-[#125C9C] to-[#47AAFF] bg-clip-text text-transparent"
            >
              Best Flight Deals
            </h2>
            <p className="text-sm md:text-base font-light">
              Choose the most suitable flight option suggested for you.
            </p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <Button 
              className="text-sm md:text-base rounded-[24px] bg-[#FF8E00] text-white border border-[#FF8E00]"
              style={{ borderRadius: 24 }}
            >
              Domestic
            </Button>
            <Button 
              className="text-sm md:text-base rounded-[24px] bg-transparent text-[#FF8E00] border border-[#FF8E00]"
              style={{ borderRadius: 24 }}
            >
              International
            </Button>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 text-yellow font-light mt-3"
          >
            Explore All
            {Icons.arrowRight}
          </Link>
        </div>

        {/* Right Column - Deals in Box */}
        <div
          onClick={() => router.push("/")}
          className="flex-1 min-w-0 border rounded-2xl p-4 sm:p-6 shadow-md bg-white"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
            {dealsData.map((deal, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border rounded-xl p-3 sm:p-4 flex-col min-w-0 w-full sm:w-[140px] md:w-[160px] bg-neutral-50 hover:shadow transition"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    width={64}
                    height={64}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium">{deal.title}</h3>
                  <p className="text-xs font-light text-yellow">{deal.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
