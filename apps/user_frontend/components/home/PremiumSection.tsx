"use client";

import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Button, PlaceholderCard } from "@repo/ui";
import "swiper/css";

const PREMIUM_PRODUCTS = [
  { id: 1, label: "iPhone 15 Pro Max" },
  { id: 2, label: "MacBook Pro M3" },
  { id: 3, label: "Samsung S24 Ultra" },
  { id: 4, label: "iPad Pro" },
  { id: 5, label: "OnePlus 12" },
];

const TAGS = ["Save up to 30%", "Like New Condition", "24 Hours Support"];

function PremiumCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      loop={true}
      centeredSlides={true}
      slidesPerView={3}
      spaceBetween={16}
      onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      onSwiper={(swiper) => setActiveIndex(swiper.realIndex)}
      breakpoints={{
        0: { slidesPerView: 1.6, spaceBetween: 12 },
        768: { slidesPerView: 2.4, spaceBetween: 16 },
        1024: { slidesPerView: 3, spaceBetween: 16 },
      }}
      style={{ padding: "20px 0 40px 0" }}
    >
      {PREMIUM_PRODUCTS.map((product, i) => (
        <SwiperSlide key={product.id}>
          {({ isActive }) => (
            <div
              className="transition-all duration-300 flex justify-center"
              style={{
                transform: isActive
                  ? "translateY(-20px) scale(1)"
                  : "translateY(0) scale(0.88)",
                opacity: isActive ? 1 : 0.5,
              }}
            >
              <PlaceholderCard
                width="100%"
                height={isActive ? 240 : 180}
                label={product.label}
                className="transition-all duration-300"
                style={{ background: isActive ? "#e2e8f0" : "#94a3b8" }}
              />
            </div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export function PremiumSection() {
  return (
    <section className="bg-[#0a0f1e] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center gap-10">
        {/* Mobile — carousel first */}
        <div className="lg:hidden w-full">
          <PremiumCarousel />
        </div>

        {/* Left — text */}
        <div className="lg:w-[45%] ">
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">
            HelloFi Luxe
          </p>
          <h2 className="text-gradient-gold text-3xl lg:text-4xl font-light leading-tight mb-5 tracking-wide">
            Premium Devices
            <br />
            Unmatched Value
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Explore our curated premium collection of flagship pre-owned phones,
            laptops, MacBooks, tablets, smartwatches, and more complete with
            original box, accessories, and bill. Every device is thoroughly
            verified, backed by brand warranty, and maintained in like-new
            condition to deliver the feel of unboxing a brand new product. Easy
            EMI options available for a smarter and more affordable upgrade.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center justify-center border border-primary text-gray-300 text-xs font-bold px-4 py-2 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <Button
            asChild
            variant="default"
            size="md"
            className="rounded-full bg-white text-black hover:bg-gray-200 font-bold tracking-wide"
          >
            <Link href="/premium">BROWSE PREMIUM</Link>
          </Button>
        </div>

        {/* Desktop — carousel right */}
        <div className="hidden lg:block lg:w-[55%] overflow-hidden">
          <PremiumCarousel />
        </div>
      </div>
    </section>
  );
}
