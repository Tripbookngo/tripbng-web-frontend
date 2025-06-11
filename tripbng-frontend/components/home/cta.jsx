"use client";
import React from 'react';
import { Icons } from '../icons';
import Image from 'next/image';

const ctaData = [
    { title: "Where 2 go", icon: Icons.globe },
    { title: "Insurance For International Trips", icon: Icons.boarding },
    { title: "Gift Cards", icon: Icons.giftCard },
    { title: "MICE", icon: Icons.people },
    { title: "Explore International Flights", icon: Icons.earth },
    { title: "Travel Guide", icon: Icons.compass }
];

const Cta = () => {
    return (
        <div 
            className="relative w-full py-14 md:py-16 flex items-center justify-center rounded-md"
          
        >
            {/* CTA Content */}
            <div className="relative z-10  p-4 rounded-xl   max-w-6xl w-full mx-4">
                <div className="
                   flex justify-center flex-wrap items-center divide-y md:mt-4 divide-gray-200 md:divide-y-0 md:divide-x-2 border p-6 rounded-xl bg-white/60 shadow-lg max-w-6xl w-full
                ">
                  {ctaData.map((item, index) => (
                    <div key={index} className="flex w-full md:w-auto items-center gap-4 px-4 py-2">
                        <div className="flex-shrink-0">
                            <Image src={item.icon} alt={item.title} width={24} height={24} />
                        </div>
                        <h3 className="text-sm font-normal">{item.title}</h3>
                    </div>
                ))}
                </div>
            </div>
            <img
        src="banner2.png"
        alt="Bangalore"
        className="w-full h-52 object-cover absolute rounded-xl"
      />
        </div>
    );
}

export default Cta