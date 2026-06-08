"use client";

import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { PlaceholderCard, Button } from "@repo/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";

const TRENDING_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: "₹54,999",
    originalPrice: "₹1,34,900",
    age: "3 month Old",
    href: "/product/iphone-15-pro-1",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    price: "₹54,999",
    originalPrice: "₹1,34,900",
    age: "Grade A+",
    href: "/product/iphone-15-pro-2",
  },
  {
    id: 3,
    name: "Samsung Galaxy S23",
    price: "₹74,999",
    originalPrice: "₹1,13,989",
    age: "1 month Old",
    href: "/product/samsung-s23",
  },
  {
    id: 4,
    name: "OnePlus 11",
    price: "₹58,999",
    originalPrice: "₹61,999",
    age: "2 months Old",
    href: "/product/oneplus-11",
  },
  {
    id: 5,
    name: "iPhone 14",
    price: "₹49,999",
    originalPrice: "₹79,900",
    age: "4 months Old",
    href: "/product/iphone-14",
  },
  {
    id: 6,
    name: "Samsung Galaxy S22",
    price: "₹39,999",
    originalPrice: "₹72,999",
    age: "6 months Old",
    href: "/product/samsung-s22",
  },
];

export function TrendingSection() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">
            Featured Products
          </p>
          <h2 className="text-xl lg:text-3xl font-extrabold text-primary uppercase">
            Trending on HelloFi
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-sm font-semibold text-primary hover:underline whitespace-nowrap"
        >
          SEE ALL &raquo;
        </Link>
      </div>

      <div className="relative">
        {/* Prev */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => swiperInstance?.slidePrev()}
          className="hidden lg:flex absolute left-0 top-[45%] -translate-y-1/2 -translate-x-1/2 z-10 rounded-full shadow-md hover:bg-primary hover:text-white hover:border-primary cursor-pointer"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </Button>

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => swiperInstance?.slideNext()}
          className="hidden lg:flex absolute right-0 top-[45%] -translate-y-1/2 translate-x-1/2 z-10 rounded-full shadow-md hover:bg-primary hover:text-white hover:border-primary cursor-pointer"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </Button>

        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          spaceBetween={16}
          slidesPerView={1.2}
          onSwiper={setSwiperInstance}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4 },
          }}
          style={{ padding: "1rem 0.25rem" }}
        >
          {TRENDING_PRODUCTS.map((product) => (
            <SwiperSlide key={product.id} style={{ userSelect: "none" }}>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow select-none">
                <div className="relative">
                  <PlaceholderCard
                    width="100%"
                    height={200}
                    label={product.name}
                    className="rounded-none"
                  />
                  <span className="absolute top-3 left-3 bg-primary-surface text-primary text-xs border border-primary font-semibold px-2.5 py-1 rounded-full select-none">
                    {product.age}
                  </span>
                </div>
                <div className="p-4 pb-6">
                  <p className="font-semibold text-black text-sm mb-2 select-none">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-black text-sm select-none">
                      {product.price}
                    </span>
                    <span className="text-gray-400 text-xs line-through select-none">
                      {product.originalPrice}
                    </span>
                  </div>
                  <Link
                    href={product.href}
                    draggable={false}
                    className="block w-full text-center text-xs font-semibold text-primary border border-primary rounded-full py-3 hover:bg-primary hover:text-white transition-colors select-none cursor-pointer"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
