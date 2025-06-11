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
      <div className="flex flex-col md:flex-row items-center md:gap-10 px-4 md:px-10 py-6">
        {/* Carousel with Box View */}
        <div className="md:w-2/3 lg:w-3/4">
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
                  <div className="bg-white rounded-xl shadow hover:shadow-lg transition h-[320px]">
                    {" "}
                    {/* Adjust height as needed */}
                    <div
                      onClick={() => router.push("/hotel")}
                      className="relative w-full overflow-hidden rounded-t-xl h-[250px]" // Adjust height as needed
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-t-xl"
                        width={400}
                        height={250} // Adjust height as needed
                      />
                    </div>
                    <div className="flex justify-between items-center px-4 py-2 bg-[#115794] rounded-b-xl">
                      <div>
                        <h3 className="text-white text-base font-medium">
                          {item.title}
                        </h3>
                        <p className="text-yellow text-sm font-semibold inline-block">
                          ₹{item.price}
                        </p>
                      </div>
                      <Button
                        className="bg-yellow text-white text-sm px-4 py-1 hover:bg-yellow-600"
                        onClick={() => router.push("/hotel")}
                      >
                        Book Now
                      </Button>
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
        </div>

        {/* Left Sidebar */}
        <div className="flex flex-col md:w-1/3 lg:w-1/4">
          <div className="mb-4">
            <h2 className="text-3xl md:text-5xl font-semibold mb-2 text-[#125a9b]">
              Top Hotel Deals
            </h2>
            <p className="text-sm md:text-base font-light">
              Book hotels worldwide at affordable rates with ease.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button className="text-sm md:text-base">Domestic</Button>
            <Button className="text-sm md:text-base" color="outline_yellow">
              International
            </Button>
          </div>
          <Link
            href={"/"}
            className="flex items-center gap-3 text-yellow font-light mt-3"
          >
            Explore All
            {Icons.arrowRight}
          </Link>
        </div>
      </div>
    </Container>
  );
}
