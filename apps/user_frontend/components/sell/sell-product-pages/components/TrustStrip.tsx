// components/sell/sell-product-pages/components/TrustStrip.tsx
"use client";

import { motion, type Variants } from "motion/react";
import { ShieldCheck, Tag, Zap } from "lucide-react";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "100% Safe & Secure",
    subtitle: "Your data is fully protected",
    circle: "bg-[#E4EEFF]",
    iconClass: "text-[#1F5FD6]",
    solid: false,
  },
  {
    icon: Tag,
    title: "Best Market Prices",
    subtitle: "AI-powered valuation engine",
    circle: "bg-[#FFEBD4]",
    iconClass: "text-[#B7682A]",
    solid: true,
  },
  {
    icon: Zap,
    title: "Quick Payment",
    subtitle: "Instant bank transfer on pickup",
    circle: "bg-[#E0F2FE]",
    iconClass: "text-[#38BDF8]",
    solid: true,
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function TrustStrip() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className="mt-6 hidden rounded-2xl bg-white px-6 py-5 shadow-[0_10px_40px_-12px_rgba(30,64,175,0.18)] ring-1 ring-gray-100 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-gray-200/70"
    >
      {ITEMS.map(
        ({ icon: Icon, title, subtitle, circle, iconClass, solid }) => (
          <motion.div
            key={title}
            variants={item}
            className="group flex items-center gap-4 px-6 sm:first:pl-0 sm:last:pr-0"
          >
            <div
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${circle}`}
            >
              <Icon
                size={24}
                className={iconClass}
                fill={solid ? "currentColor" : "none"}
              />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold leading-tight text-gray-900">
                {title}
              </p>
              <p className="mt-0.5 text-sm leading-snug text-gray-500">
                {subtitle}
              </p>
            </div>
          </motion.div>
        ),
      )}
    </motion.div>
  );
}
