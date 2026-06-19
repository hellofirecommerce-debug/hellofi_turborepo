"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "motion/react";

const STATS = [
  {
    value: "20K+",
    label: "Devices Sold",
    from: "#f472b6",
    via: "#ec4899",
    count: 20000,
    suffix: "K+",
    divide: 1000,
  },
  {
    value: "G 4.9★",
    label: "Customer Rating",
    from: "#4ade80",
    via: "#22c55e",
    count: 4.9,
    prefix: "G ",
    suffix: "★",
    decimals: 1,
  },
  {
    value: "Same Day Free",
    label: "Doorstep Pickup",
    from: "#E9D4FF",
    via: "#a78bfa",
  },
  {
    value: "Warranty Assured",
    label: "Brand & HelloFi",
    from: "#fde047",
    via: "#eab308",
  },
];

function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  divide = 1,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  divide?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const display = latest / divide;
    return `${prefix}${display.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, {
        duration: 2,
        ease: [0.22, 1, 0.36, 1],
      });
      return controls.stop;
    }
  }, [inView, to, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function StatsBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <section
      ref={sectionRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="relative inline-flex overflow-hidden rounded-2xl p-[3px]"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={
              inView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 24, scale: 0.95 }
            }
            transition={{
              duration: 0.5,
              delay: i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
            <span
              className="absolute inset-[-1000%] animate-spin"
              style={{
                background: `conic-gradient(from 90deg at 50% 50%, ${stat.from} 0%, ${stat.via} 50%, ${stat.from} 100%)`,
              }}
            />
            <div
              className="relative z-10 w-full rounded-[14px] px-5 py-5 flex flex-col items-center justify-center text-center min-h-[110px] backdrop-blur-3xl"
              style={{
                background: "linear-gradient(135deg, #0F182B, #1B2638)",
              }}
            >
              <p className="text-white font-bold text-xl sm:text-2xl leading-tight">
                {stat.count !== undefined ? (
                  <CountUp
                    to={stat.count}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    divide={stat.divide}
                  />
                ) : (
                  stat.value
                )}
              </p>
              <p className="text-gray-400 text-sm mt-1.5">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
