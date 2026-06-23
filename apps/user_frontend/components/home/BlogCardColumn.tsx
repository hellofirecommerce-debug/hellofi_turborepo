"use client";
import React from "react";
import { motion, useAnimationFrame } from "motion/react";
import { useRef, useState } from "react";

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
  const yRef = useRef(0);
  const initialized = useRef(false);
  const [paused, setPaused] = useState(false);
  const doubled = [...blogCards, ...blogCards];

  useAnimationFrame((_, delta) => {
    if (paused || !containerRef.current) return;

    const half = containerRef.current.scrollHeight / 2;

    if (!initialized.current) {
      yRef.current = -half;
      initialized.current = true;
    }

    const speed = 0.03;
    yRef.current += speed * delta;

    if (yRef.current >= 0) yRef.current = -half;

    containerRef.current.style.transform = `translateY(${yRef.current}px)`;
  });

  return (
    <motion.div
      className="relative h-[360px] sm:h-[420px] md:h-[480px] lg:h-[500px] xl:h-[530px] mb-8 md:mb-0 overflow-hidden"
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
        className="absolute inset-0 flex flex-col gap-5"
        style={{ willChange: "transform" }}
      >
        {doubled.map((b, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex gap-3 rounded-xl border border-card-border bg-card-surface p-3.5"
          >
            <div className="w-20 h-20 rounded-md bg-primary-surface flex-shrink-0" />
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
