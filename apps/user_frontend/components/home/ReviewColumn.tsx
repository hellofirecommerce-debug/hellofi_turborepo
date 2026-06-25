"use client";
import React, { useRef, useState, useEffect } from "react";
import { Star } from "lucide-react";
import { motion, useAnimationFrame } from "motion/react";

interface ReviewCard {
  rating: number;
  text: string;
  name: string;
  role: string;
}

const reviewCards: ReviewCard[] = [
  {
    rating: 5,
    text: "I'm impressed by the thoroughness of the inspection process.",
    name: "Sanya Kapoor",
    role: "Happy customer",
  },
  {
    rating: 5,
    text: "I feel confident in the quality of my purchase.",
    name: "Rajat Verma",
    role: "Satisfied user",
  },
  {
    rating: 3,
    text: "The detailed report gave me confidence in my purchase.",
    name: "Priya Nair",
    role: "Delighted client",
  },
  {
    rating: 4,
    text: "I appreciate the attention to detail in the certification process.",
    name: "Vikram Patel",
    role: "Pleased patron",
  },
];

export const ReviewColumn: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const initialized = useRef(false);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const doubled = [...reviewCards, ...reviewCards];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    posRef.current = 0;
    initialized.current = false;
    if (containerRef.current) containerRef.current.style.transform = "";
  }, [isMobile]);

  useAnimationFrame((_, delta) => {
    if (paused || !containerRef.current) return;
    const el = containerRef.current;

    if (isMobile) {
      const half = el.scrollWidth / 2;
      const speed = 0.05;
      posRef.current -= speed * delta;
      if (posRef.current <= -half) posRef.current = 0;
      el.style.transform = `translateX(${posRef.current}px)`;
    } else {
      const half = el.scrollHeight / 2;
      const speed = 0.035;
      posRef.current -= speed * delta;
      if (posRef.current <= -half) posRef.current = 0;
      el.style.transform = `translateY(${posRef.current}px)`;
    }
  });

  return (
    <motion.div
      className="relative h-[180px] md:h-[480px] lg:h-[500px] xl:h-[530px] mb-3 md:mb-0 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 flex flex-row md:flex-col items-center md:items-stretch gap-4 md:gap-3"
        style={{ willChange: "transform" }}
      >
        {doubled.map((r, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[280px] md:w-auto h-[150px] md:h-[170px] flex flex-col rounded-xl border border-card-border bg-card-surface p-4 md:p-3"
          >
            <div className="mb-1.5 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={13}
                  className={
                    idx < r.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <p
              className="text-sm md:text-[13px] mb-2.5 leading-relaxed flex-1 overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
              }}
            >
              "{r.text}"
            </p>
            <div className="flex items-center gap-2 mt-auto">
              <span className="w-[26px] h-[26px] rounded-full bg-primary-surface text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">
                {r.name.charAt(0)}
              </span>
              <div>
                <p className="text-xs font-medium m-0">{r.name}</p>
                <p className="text-[11px] text-gray-400 m-0">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="hidden md:block text-right text-sm font-medium mt-1 absolute -bottom-7 right-0">
        Read more reviews →
      </p>
    </motion.div>
  );
};
