'use client';

import React from 'react';
import { Container } from '../ui';
import { useRouter } from "next/navigation";

const travelStats = [
  {
    title: "13+",
    subtitle: "Years of Experience",
  },
  {
    title: "17k+",
    subtitle: "Happy Customers",
  },
  {
    title: "1798",
    subtitle: "Destinations",
  }
];

export default function TravelIntro() {
  const router = useRouter();

  return (
    <Container>
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="md:w-1/2 lg:w-1/3 pl-6 pb-6">
          <div className="flex justify-center">
            <img
              src="/home/travel-info.png"
              alt="Travel Destination"
              width={500}
              height={500}
              className="rounded-lg object-cover"
            />
          </div>
        </div>

        <div className="md:w-1/2 lg:w-2/3 rounded-2xl p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold mb-2" style={{ color: "#125a9b" }}>
                Access All Major Travel Services
              </h2>
            </div>

            <div className="mb-16 flex flex-wrap gap-6 justify-center md:justify-start mt-6">
              {travelStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-6"
                >
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{stat.title}</h3>
                    <p className="text-sm font-medium  text-black">{stat.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className=" text-sm md:text-lg font-medium">
                Your adventure starts here! As one of the leading travel agencies, providing domestic
                 and international travel packages, including flights, visas, buses, and hotels. 
                 Our dedication to exceptional customer service ensures that your journey is not only 
                 seamless but also unforgettable. let us help handle everything, leaving you with memories 
                 to cherish for a lifetime.          
                 </div>
          </div>

        </div>
      </div>
    </Container>
  );
}
