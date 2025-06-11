"use client";

import React from "react";
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

  return (
    <Container className="p-4 sm:p-6 md:p-8 mt-10">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* Left Column */}
        <div className="flex flex-col md:w-1/3 lg:w-1/4 pl-4 md:pl-6 lg:pl-8">
          <div className="mb-4">
            <h2
              className="text-3xl md:text-5xl font-semibold mb-2"
              style={{ color: "#125a9b" }}
            >
              Best Flight Deals
            </h2>
            <p className="text-sm md:text-base font-light">
              Choose the most suitable flight option suggested for you.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button className="text-sm md:text-base" color="outline_yellow">
              Domestic
            </Button>
            <Button className="text-sm md:text-base">International</Button>
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
          className="w-full border rounded-2xl p-6 shadow-md bg-white"
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {dealsData.map((deal, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border rounded-xl p-4 flex-col w-[120px] sm:w-[140px] md:w-[160px] bg-neutral-50 hover:shadow transition"
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
