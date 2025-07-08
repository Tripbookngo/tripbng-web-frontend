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
          >
            <span className="text-black">Enjoy </span>
            <span className="bg-gradient-to-r from-[#125C9C] to-[#47AAFF] bg-clip-text text-transparent">Top Holiday Packages</span>
          </h2>
          <p className="text-sm md:text-base font-light">
            Discover the best holiday packages that fit your budget for your
            favorite destinations.
          </p>
        </div>
        <div className="flex items-center gap-4 md:mt-0 mt-3 pr-4">
          <Button className="text-sm md:text-base rounded-[24px]">Domestic</Button>
          <Button className="text-sm md:text-base rounded-[24px] text-[#FF8E00] border border-[#FF8E00] bg-white">International</Button>
        </div>
      </div>

      <div className="relative">
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
              <div
                className="bg-black rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-xs mx-auto cursor-pointer flex flex-col"
                style={{ minHeight: 250 }}
                onClick={() => router.push("/holiday")}
              >
                <div className="flex justify-center items-center p-2 flex-[0_0_70%]">
                  <div className="relative w-[90%] h-full bg-neutral-900 rounded-xl overflow-hidden">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover w-full h-full rounded-xl"
                    />
                  </div>
                </div>
                <div className="p-3 flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white text-base font-semibold truncate">
                      {slide.title}
                    </h3>
                    <span className="text-yellow text-sm font-bold whitespace-nowrap">
                      INR {slide.price}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Navigation icons as siblings, not children */}
        <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 -left-6 z-20 cursor-pointer">
          <Image src="/icons/arrowLeft.png" alt="Previous" width={16} height={16} />
        </div>
        <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 -right-6 z-20 cursor-pointer">
          <Image src="/icons/arrowRight.png" alt="Next" width={16} height={16} />
        </div>
      </div>

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
