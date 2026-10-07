// components/sell-category-page/SellStats.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "motion/react";

interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: "80,000+", label: "Active Users" },
  { value: "4.9 ★", label: "Google Rating" },
  { value: "200+", label: "Areas Covered" },
  { value: "10,000+", label: "Models Accepted" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  // "80,000+" -> number "80,000", suffix "+"   |   "4.9 ★" -> "4.9", " ★"
  const match = value.match(/^([\d,.]+)(.*)$/);
  const finalNumber = match ? match[1] : null;
  const suffix = match ? match[2] : "";

  // Starts at the real value so server HTML / SEO always shows the true number.
  const [display, setDisplay] = useState(finalNumber ?? value);

  useEffect(() => {
    if (!inView || !finalNumber) return;
    const target = parseFloat(finalNumber.replace(/,/g, ""));
    const decimals = finalNumber.includes(".")
      ? finalNumber?.split(".")[1]?.length
      : 0;

    const controls = animate(0, target, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) =>
        setDisplay(
          v.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }),
        ),
    });
    return () => controls.stop();
  }, [inView, finalNumber]);

  return (
    <span ref={ref}>
      {display}
      {finalNumber ? suffix : ""}
    </span>
  );
}

export function SellStats() {
  return (
    <section className="w-full py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-3xl bg-white/80 py-8 shadow-[0_20px_60px_-20px_rgba(0,102,255,0.25)] ring-1 ring-blue-100 backdrop-blur"
        >
          <div className="grid grid-cols-2 gap-y-8 text-center sm:grid-cols-4 sm:divide-x sm:divide-blue-100">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-4">
                <p className="bg-gradient-to-br from-[#0066FF] to-[#38BDF8] bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
                  <CountUp value={stat.value} />
                </p>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-widest text-gray-500 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
