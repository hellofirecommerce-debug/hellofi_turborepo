"use client";

import React, { useState, useRef, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { VideoStory } from "./StoriesAndReviewsSection";
import "swiper/css";

interface Props {
  stories: VideoStory[];
}

export const VideoTestimonialCarousel: React.FC<Props> = ({ stories = [] }) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeRealIndex, setActiveRealIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  // Replicate the stories so Swiper always has enough slides for a clean,
  // gap-free centered loop (avoids blank slides + off-center start).
  const slides = useMemo(() => {
    if (stories.length === 0) return [];
    let out = [...stories];
    while (out.length < 12) {
      out = [...out, ...stories];
    }
    return out;
  }, [stories]);

  if (stories.length === 0) return null;

  const playActive = (sw: SwiperType, stopAutoplay = true) => {
    const realIndex = sw.realIndex;
    setActiveRealIndex(realIndex);
    Object.entries(videoRefs.current).forEach(([key, vid]) => {
      if (!vid) return;
      if (Number(key) === realIndex) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
        if (stopAutoplay) sw.autoplay?.stop();
      } else {
        vid.pause();
      }
    });
  };

  const handleSlideChange = (sw: SwiperType) => {
    playActive(sw);
  };

  const handleCardClick = (i: number) => {
    if (!swiper) return;
    if (i === activeRealIndex) return;
    swiper.slideToLoop(i);
  };

  const handleVideoEnded = (sw: SwiperType | null) => {
    if (!sw) return;
    sw.slideNext();
  };

  return (
    <motion.section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <div className="relative">
        {/* Prev */}
        <button
          type="button"
          title="Previous"
          onClick={() => swiper?.slidePrev()}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-md items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        {/* Next */}
        <button
          type="button"
          title="Next"
          onClick={() => swiper?.slideNext()}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-md items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>

        <Swiper
          modules={[Autoplay]}
          onSwiper={(sw) => {
            setSwiper(sw);
            setTimeout(() => playActive(sw, false), 100);
          }}
          onSlideChange={handleSlideChange}
          centeredSlides
          loop
          slidesPerView={1.2}
          spaceBetween={16}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3.4, spaceBetween: 28 },
          }}
          style={{ padding: "30px 0" }}
        >
          {slides.map((story, i) => (
            <SwiperSlide key={i}>
              {({ isActive }) => (
                <div
                  className="transition-all duration-500 flex justify-center cursor-pointer"
                  onClick={() => handleCardClick(i)}
                  style={{
                    transform: isActive ? "scale(1)" : "scale(0.82)",
                    opacity: isActive ? 1 : 0.85,
                  }}
                >
                  <div
                    className={`relative rounded-2xl overflow-hidden bg-gray-900 w-full ${
                      isActive ? "shadow-2xl" : ""
                    }`}
                    style={{ aspectRatio: "9 / 13" }}
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={story.videoUrl}
                      poster={story.thumbnailUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      playsInline
                      muted={muted}
                      onEnded={() => handleVideoEnded(swiper)}
                    />

                    {isActive && (
                      <button
                        type="button"
                        title={muted ? "Unmute" : "Mute"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMuted((m) => !m);
                        }}
                        className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        {muted ? (
                          <VolumeX size={16} className="text-white" />
                        ) : (
                          <Volume2 size={16} className="text-white" />
                        )}
                      </button>
                    )}

                    {!isActive && story.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white text-xs font-medium line-clamp-2">
                          {story.title}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.section>
  );
};
