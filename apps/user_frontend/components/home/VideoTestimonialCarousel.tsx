"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { VideoStory } from "./StoriesAndReviewsSection";
import "swiper/css";
import "swiper/css/effect-coverflow";

interface Props {
  stories: VideoStory[];
}

export const VideoTestimonialCarousel: React.FC<Props> = ({ stories = [] }) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setReady(true)),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const playActive = (sw: SwiperType, stopAutoplay = true) => {
    setActiveIndex(sw.activeIndex);
    sw.el.querySelectorAll("video").forEach((v) => {
      (v as HTMLVideoElement).pause();
    });
    const activeSlide = sw.slides[sw.activeIndex];
    const activeVideo = activeSlide?.querySelector(
      "video",
    ) as HTMLVideoElement | null;
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.muted = muted;
      const p = activeVideo.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
      if (stopAutoplay) sw.autoplay?.stop();
    }
  };

  const handleSlideChange = (sw: SwiperType) => {
    playActive(sw);
  };

  const handleCardClick = (i: number) => {
    if (!swiper) return;
    if (i === activeIndex) return;
    swiper.slideTo(i);
  };

  const handleVideoEnded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!swiper) return;
    const endedVideo = e.currentTarget;
    const activeSlide = swiper.slides[swiper.activeIndex];
    const activeVideo = activeSlide?.querySelector("video");
    if (endedVideo === activeVideo) {
      // loop manually: go next, or back to start at the end
      if (swiper.activeIndex >= stories.length - 1) {
        swiper.slideTo(0);
      } else {
        swiper.slideNext();
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const activeSlide = swiper?.slides[swiper.activeIndex];
    const activeVideo = activeSlide?.querySelector(
      "video",
    ) as HTMLVideoElement | null;
    const next = !muted;
    if (activeVideo) {
      activeVideo.muted = next;
      if (!next) {
        const p = activeVideo.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    }
    setMuted(next);
  };

  if (stories.length === 0) return null;

  return (
    <motion.section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1a1a2e] mb-8 tracking-tight uppercase">
        Customer Testimonials
      </h2>

      <div className="relative">
        {/* Prev */}
        <button
          type="button"
          title="Previous"
          onClick={() => swiper?.slidePrev()}
          className="flex absolute left-1 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} className="text-gray-700" />
        </button>

        {/* Next */}
        <button
          type="button"
          title="Next"
          onClick={() => swiper?.slideNext()}
          className="flex absolute right-1 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ChevronRight size={18} className="text-gray-700" />
        </button>

        {ready && (
          <Swiper
            modules={[Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            speed={500}
            watchSlidesProgress
            initialSlide={Math.floor(stories.length / 2)}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 400,
              modifier: 1,
              slideShadows: false,
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            onSwiper={(sw) => {
              setSwiper(sw);
              sw.update();
              playActive(sw, false);
            }}
            onSlideChange={handleSlideChange}
            className="!py-6"
          >
            {stories.map((story, i) => (
              <SwiperSlide
                key={i}
                className="!w-[140px] sm:!w-[200px] md:!w-[225px] !h-[250px] sm:!h-[350px] md:!h-[400px]"
              >
                {({ isActive }) => (
                  <div
                    className="relative w-full h-full rounded-[18px] overflow-hidden bg-gray-900 cursor-pointer"
                    onClick={() => handleCardClick(i)}
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.28) 0px 0px 18px",
                    }}
                  >
                    <video
                      src={story.videoUrl}
                      poster={story.thumbnailUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      playsInline
                      onEnded={handleVideoEnded}
                    />

                    {story.duration && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex items-center gap-1 bg-black/55 text-white text-[10px] sm:text-[11px] font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md">
                        {story.duration}
                      </span>
                    )}

                    {isActive && (
                      <button
                        type="button"
                        title={muted ? "Unmute" : "Mute"}
                        onClick={toggleMute}
                        className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                      >
                        {muted ? (
                          <VolumeX size={15} className="text-white" />
                        ) : (
                          <Volume2 size={15} className="text-white" />
                        )}
                      </button>
                    )}

                    {!isActive && story.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white text-[10px] sm:text-xs font-medium line-clamp-2">
                          {story.title}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </motion.section>
  );
};
