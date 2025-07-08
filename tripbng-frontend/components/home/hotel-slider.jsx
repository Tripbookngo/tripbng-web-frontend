import React from "react";
import { Container } from "../ui";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Button from "../ui/button";
import Link from "next/link";
import { Icons } from "../icons";
import { useRouter } from "next/navigation";

const SliderHolidayData = [
  {
    title: "Ahmedabad",
    image: "/images/place1.png",
    price: 6000,
  },
  {
    title: "Jaipur",
    image: "/images/place2.png",
    price: 15000,
  },
  {
    title: "Udaipur",
    image: "/images/place3.png",
    price: 15000,
  },
  {
    title: "Nainital",
    image: "/images/place4.png",
    price: 30000,
  },
  {
    title: "Kochi",
    image: "/images/place5.png",
    price: 15000,
  },
];

export default function HotelSlider() {
  const router = useRouter();

  return (
    <Container>
      <div className="flex flex-col md:flex-row flex-wrap items-start md:gap-10 px-4 md:px-10 py-6">
        {/* Left Sidebar */}
        <div style={{boxShadow:'100px 0px 100px rgb(255, 255, 255)',zIndex:10}} className="flex flex-col md:w-1/3 lg:w-1/4 flex-shrink-0 mb-4 md:mb-0">
          <div className="mb-4">
            <h2 className="text-3xl md:text-5xl font-semibold mb-2 bg-gradient-to-r from-[#125C9C] to-[#47AAFF] bg-clip-text text-transparent">
              Top Hotel Deals
            </h2>
            <p className="text-sm md:text-base font-light">
              Book hotels worldwide at affordable rates with ease.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Button className="text-sm md:text-base rounded-[24px]">Domestic</Button>
            <Button className="text-sm md:text-base rounded-[24px] text=[#FF8E00]" color="outline_yellow">
              International
            </Button>
          </div>
        </div>

        {/* Carousel with Box View */}
        <div className="flex-1 min-w-0 md:w-2/3 lg:w-3/4">
          <Carousel
            opts={{ align: "start", slidesToShow: 4 }}
            className="w-full"
          >
            <CarouselContent>
              {SliderHolidayData.map((item, i) => (
                <CarouselItem
                  key={i}
                  className="md:basis-1/4 lg:basis-1/4 px-2"
                >
                  <div
                    className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer h-[220px] flex flex-col justify-between"
                    onClick={() => router.push("/hotel")}
                  >
                    {/* Smaller image */}
                    <div className="relative w-full overflow-hidden rounded-t-xl h-[180px]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-t-xl"
                        width={320}
                        height={180}
                      />
                    </div>
                    <div className="px-4 py-2 bg-[#115794] rounded-b-xl">
                      <h3 className="text-white text-base font-bold">
                        {item.title}
                      </h3>
                      <p className="text-yellow text-sm font-semibold inline-block">
                        INR {item.price} Onward
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows */}
            <div className="flex justify-center mt-4 gap-4">
              <CarouselPrevious className="h-4 w-4 mt-2" />
              <CarouselNext className="h-4 w-4  mr-7" />
            </div>
          </Carousel>
          {/* Add Explore All below carousel, aligned right */}
          <div className="flex justify-end mt-4">
            <Link
              href={"/"}
              className="flex items-center gap-3 text-yellow font-light mt-3"
            >
              Explore All
              {Icons.arrowRight}
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
