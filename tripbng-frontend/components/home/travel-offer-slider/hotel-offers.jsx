import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from 'next/image';
import { TravelOfferData } from './offer-data';
import Button from '@/components/ui/button';

export default function HotelOffers() {
  return (
    <div className="mx-4 md:mx-6 lg:mx-10 my-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-black">
          Hotel Offers
        </h2>
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {TravelOfferData.allOffers.map((item, i) => (
              <CarouselItem
                key={i}
                className="basis-[100%] sm:basis-[50%] md:basis-[33.33%] lg:basis-[25%] px-2"
              >
                <div className="bg-[#f1f5f9] p-3 rounded-xl shadow-sm flex flex-col h-full">
                  <div className="relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 100vw,
                             (max-width: 1200px) 50vw,
                             25vw"
                    />
                  </div>
                  <h3 className="text-black text-lg font-semibold line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#666] mb-2 line-clamp-2">
                    {item.desc}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-[#999] text-sm">{item.tag}</span>
                    <Button className="text-sm px-3 py-1">BOOK NOW</Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-4">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
