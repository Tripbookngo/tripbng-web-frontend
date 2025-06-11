"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Button from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../ui";
import { Icons } from "../icons";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

export default function HolidaySlider() {
  const router = useRouter();

  return (
    <Container className="pt-10 pl-6 pr-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="mb-4 md:mb-0 pl-4 md:pl-6">
          <h2
            className="text-3xl md:text-5xl font-semibold mb-2"
            style={{ color: "#125a9b" }}
          >
            Enjoy Top Holiday Packages
          </h2>
          <p className="text-sm md:text-base font-light">
            Discover the best holiday packages that fit your budget for your
            favorite destinations.
          </p>
        </div>
        <div className="flex items-center gap-4 md:mt-0 mt-3 pr-4">
          <Button className="text-sm md:text-base">Domestic</Button>
          <Button className="text-sm md:text-base bg-white border border-yellow text-yellow hover:bg-yellow-50">
            International
          </Button>
        </div>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        modules={[Navigation]}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 15 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 25 },
        }}
      >
        {SliderHolidayData.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-[320px]">
              {" "}
              {/* Adjusted card height */}
              <div
                onClick={() => router.push("/holiday")}
                className="relative w-full h-[180px] bg-neutral-100 cursor-pointer" // Adjusted image container height
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-3 flex flex-col justify-between h-[140px]">
                {" "}
                {/* Adjusted padding */}
                <div className="flex justify-between items-center mb-2 bg-blue-50 p-2 rounded-md">
                  <h3 className="text-blue text-base font-semibold truncate">
                    {slide.title}
                  </h3>
                  <p className="text-yellow text-base font-semibold whitespace-nowrap">
                    ₹{slide.price}
                  </p>
                </div>
                <Button
                  className="mt-auto w-full bg-yellow text-white text-sm hover:bg-yellow-600"
                  onClick={() => router.push("/holiday")}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="swiper-button-prev-custom absolute top-[40%] left-0 z-10 cursor-pointer">
          <ArrowLeft className="w-8 h-8 text-yellow" />
        </div>
        <div className="swiper-button-next-custom absolute top-[40%] right-0 z-10 cursor-pointer">
          <ArrowRight className="w-8 h-8 text-yellow" />
        </div>
      </Swiper>

      <Link
        href={"/"}
        className="flex items-center gap-3 text-yellow font-light mt-3 justify-end pr-4"
      >
        Explore All
        {Icons.arrowRight}
      </Link>
    </Container>
  );
}
