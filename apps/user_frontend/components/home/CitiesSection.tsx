"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const CITIES = [
  {
    name: "Bangalore",
    stat: "7K+ Active Customer",
    image: "/images/cities/bangalore.png",
  },
  {
    name: "Agartala",
    stat: "2K+ Satisfied Customers",
    image: "/images/cities/agartala.png",
  },
  {
    name: "Hyderabad",
    stat: "4K+ Pickups Completed",
    image: "/images/cities/hyderabad.png",
  },
  {
    name: "Mysore",
    stat: "2+ Devices Sold/hour",
    image: "/images/cities/mysore.png",
  },
  {
    name: "Odisha",
    stat: "50+ Pickups Every Day",
    image: "/images/cities/odisha.png",
  },
  {
    name: "Mumbai",
    stat: "3K+ Satisfied Sellers",
    image: "/images/cities/mumbai.png",
  },
];

export function CitiesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h2
        className="text-xl font-bold text-black mb-6 text-center sm:text-left"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        We Pickup In These Cities
      </motion.h2>

      {/* Desktop: 6 equal columns */}
      <div className="hidden sm:grid grid-cols-6 gap-3">
        {CITIES.map((city, i) => (
          <motion.div
            key={city.name}
            className="relative rounded-2xl overflow-hidden h-[160px] group cursor-pointer"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6 }}
          >
            <Image
              src={city.image}
              alt={city.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white font-bold text-sm">{city.name}</p>
              <p className="text-white/80 text-[10px]">{city.stat}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile: Swiper coverflow */}
      <div className="sm:hidden h-[225px] sm:h-[350px]">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop={true}
          centeredSlides={true}
          slidesPerView={2.2}
          spaceBetween={12}
          style={{ padding: "20px 0 10px 0", overflow: "visible" }}
        >
          {CITIES.map((city) => (
            <SwiperSlide key={city.name}>
              {({ isActive }) => (
                <div
                  className="transition-all duration-300"
                  style={{
                    transform: isActive
                      ? "translateY(-12px) scale(1)"
                      : "translateY(0) scale(0.9)",
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden transition-all duration-300"
                    style={{ height: isActive ? "190px" : "150px" }}
                  >
                    <Image
                      src={city.image}
                      alt={city.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white font-bold text-sm">
                        {city.name}
                      </p>
                      <p className="text-white/80 text-[10px]">{city.stat}</p>
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
