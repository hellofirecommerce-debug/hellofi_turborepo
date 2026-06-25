"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimationFrame } from "motion/react";

interface BlogCard {
  eyebrow: string;
  title: string;
  cta: string;
}

const blogCards: BlogCard[] = [
  {
    eyebrow: "FROM OUR BLOG",
    title: "Tech revival: how refurbishing saves resources",
    cta: "Divya in Deskbar →",
  },
  {
    eyebrow: "FROM OUR BLOG",
    title: "How iPhone creates a different user segment",
    cta: "Read article →",
  },
  {
    eyebrow: "LATEST INSIGHTS",
    title: "The impact of wearable tech on consumer behavior",
    cta: "Explore now →",
  },
  {
    eyebrow: "FROM OUR BLOG",
    title: "Top 10 features of the latest Android",
    cta: "Read article →",
  },
];

export const BlogCardColumn: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const initialized = useRef(false);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const doubled = [...blogCards, ...blogCards];

  // detect mobile (< md)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // reset when switching between mobile/desktop
  useEffect(() => {
    posRef.current = 0;
    initialized.current = false;
    if (containerRef.current) containerRef.current.style.transform = "";
  }, [isMobile]);

  useAnimationFrame((_, delta) => {
    if (paused || !containerRef.current) return;
    const el = containerRef.current;

    if (isMobile) {
      // horizontal — moves RIGHT (opposite of side columns)
      const half = el.scrollWidth / 2;
      if (!initialized.current) {
        posRef.current = -half;
        initialized.current = true;
      }
      const speed = 0.05;
      posRef.current += speed * delta;
      if (posRef.current >= 0) posRef.current = -half;
      el.style.transform = `translateX(${posRef.current}px)`;
    } else {
      // vertical — moves DOWN (opposite of side columns)
      const half = el.scrollHeight / 2;
      if (!initialized.current) {
        posRef.current = -half;
        initialized.current = true;
      }
      const speed = 0.03;
      posRef.current += speed * delta;
      if (posRef.current >= 0) posRef.current = -half;
      el.style.transform = `translateY(${posRef.current}px)`;
    }
  });

  return (
    <motion.div
      className="relative h-[170px] md:h-[480px] lg:h-[500px] xl:h-[530px] mb-3 md:mb-0 overflow-hidden"
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
        className="absolute inset-0 flex flex-row md:flex-col items-center md:items-stretch gap-4 md:gap-5"
        style={{ willChange: "transform" }}
      >
        {doubled.map((b, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[300px] md:w-auto flex gap-3 rounded-xl border border-card-border bg-card-surface p-4 md:p-3.5"
          >
            <div className="w-24 h-24 md:w-20 md:h-20 rounded-md bg-primary-surface flex-shrink-0" />
            <div>
              <p className="text-[11px] text-primary font-medium mb-1">
                {b.eyebrow}
              </p>
              <p className="text-sm font-medium leading-tight mb-1">
                {b.title}
              </p>
              <p className="text-xs text-gray-500 m-0">{b.cta}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
