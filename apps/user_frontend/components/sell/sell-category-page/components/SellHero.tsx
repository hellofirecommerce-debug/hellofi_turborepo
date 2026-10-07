// components/sell-category-page/SellHero.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, MotionConfig } from "motion/react";
import { Search, ArrowRight, Zap, Truck, BadgeCheck } from "lucide-react";

interface CategoryContent {
  title1: string;
  title2: string;
  title3: string;
  subtitle: string;
  searchPrompt: string;
  searchPlaceholder: string;
  image: string;
  imageAlt: string;
}

const SELL_HERO_CONTENT: Record<string, CategoryContent> = {
  "mobile-phone": {
    title1: "Sell Your Phone.",
    title2: "Get The Price",
    title3: "We Promise.",
    subtitle:
      "Get an Instant Quotation in 60 Seconds, Same Day Free Doorstep Pickup, Get the Best Price, Paid on the Spot, Zero Last Minute Deductions.",
    searchPrompt: "Search your phone brand or select from the list below",
    searchPlaceholder: 'Try "iPhone 15 Pro" or "Samsung S24"...',
    image: "/images/sell-category/sell-mobile.png",
    imageAlt: "HelloFi staff handing cash to a customer selling their phone",
  },
  laptop: {
    title1: "Sell Your Laptop.",
    title2: "Get The Price",
    title3: "We Promise.",
    subtitle:
      "Get an Instant Quotation in 60 Seconds, Same Day Free Doorstep Pickup, Get the Best Price, Paid on the Spot, Zero Last Minute Deductions.",
    searchPrompt: "Search your laptop brand or select from the list below",
    searchPlaceholder: 'Try "MacBook Air M2" or "Dell XPS 13"...',
    image: "/images/sell-category/sell-laptop.png",
    imageAlt: "HelloFi staff handing cash to a customer selling their laptop",
  },
  tablet: {
    title1: "Sell Your Tablet.",
    title2: "Get The Price",
    title3: "We Promise.",
    subtitle:
      "Get an Instant Quotation in 60 Seconds, Same Day Free Doorstep Pickup, Get the Best Price, Paid on the Spot, Zero Last Minute Deductions.",
    searchPrompt: "Search your tablet brand or select from the list below",
    searchPlaceholder: 'Try "iPad Air" or "Galaxy Tab S9"...',
    image: "/images/sell-category/sell-tablet.png",
    imageAlt: "HelloFi staff handing cash to a customer selling their tablet",
  },
  "smart-watch": {
    title1: "Sell Your Smartwatch.",
    title2: "Get The Price",
    title3: "We Promise.",
    subtitle:
      "Get an Instant Quotation in 60 Seconds, Same Day Free Doorstep Pickup, Get the Best Price, Paid on the Spot, Zero Last Minute Deductions.",
    searchPrompt: "Search your smartwatch brand or select from the list below",
    searchPlaceholder: 'Try "Apple Watch Series 9" or "Galaxy Watch 6"...',
    image: "/images/sell-category/sell-smartwatch.png",
    imageAlt:
      "HelloFi staff handing cash to a customer selling their smartwatch",
  },
  accessories: {
    title1: "Sell Your Accessories.",
    title2: "Get The Price",
    title3: "We Promise.",
    subtitle:
      "Get an Instant Quotation in 60 Seconds, Same Day Free Doorstep Pickup, Get the Best Price, Paid on the Spot, Zero Last Minute Deductions.",
    searchPrompt: "Search your accessory brand or select from the list below",
    searchPlaceholder: 'Try "AirPods Pro" or "Apple Pencil"...',
    image: "/images/sell-category/sell-accessories.png",
    imageAlt:
      "HelloFi staff handing cash to a customer selling their accessories",
  },
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: EASE },
});

interface Props {
  categorySlug: string;
}

export function SellHero({ categorySlug }: Props) {
  const [query, setQuery] = useState("");
  const content = SELL_HERO_CONTENT[categorySlug];

  if (!content) return null;

  const handleSearch = () => {
    // TODO: route to model search / quote flow with `query`
  };

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate w-full overflow-hidden">
        {/* ───── Animated background ───── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <motion.div
            className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#0066FF]/15 blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#38BDF8]/15 blur-3xl"
            animate={{ x: [0, -60, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#9db7ff_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 sm:pt-10 pb-12 sm:pb-16 lg:pb-20">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 items-center justify-between">
            {/* ───── Left — copy + search ───── */}
            <div className="w-full min-w-0 lg:max-w-md xl:max-w-xl lg:shrink flex flex-col justify-center">
              <motion.span
                {...fadeUp(0)}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-[#0066FF] shadow-sm ring-1 ring-blue-100 backdrop-blur"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Trusted by 80,000+ sellers across India
              </motion.span>

              <motion.h1
                {...fadeUp(0.1)}
                className="mt-5 text-4xl sm:text-5xl lg:text-4xl xl:text-6xl font-extrabold text-gray-900 leading-[1.05] tracking-tight"
              >
                <span className="whitespace-nowrap">{content.title1}</span>
                <br />
                {content.title2}
                <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#0066FF] to-[#38BDF8] bg-clip-text text-transparent">
                    {content.title3}
                  </span>
                  <svg
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                    className="absolute -bottom-2 left-0 h-2.5 w-full"
                  >
                    <motion.path
                      d="M2 8 C 50 2, 120 2, 198 7"
                      stroke="#0066FF"
                      strokeOpacity="0.35"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        delay: 0.9,
                        duration: 0.9,
                        ease: "easeOut",
                      }}
                    />
                  </svg>
                </span>
              </motion.h1>

              <motion.p
                {...fadeUp(0.25)}
                className="mt-6 text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl"
              >
                {content.subtitle}
              </motion.p>

              <motion.p
                {...fadeUp(0.35)}
                className="mt-7 text-base sm:text-lg font-bold text-[#0066FF]"
              >
                Find Your{" "}
                {content.title1.replace("Sell Your ", "").replace(".", "")}. Get
                an Instant Price.
              </motion.p>
              <motion.p
                {...fadeUp(0.4)}
                className="mt-1 text-xs sm:text-sm text-gray-500"
              >
                {content.searchPrompt}
              </motion.p>

              {/* Search */}
              <motion.div {...fadeUp(0.5)} className="mt-4 w-full max-w-xl">
                <div className="group relative flex items-center rounded-2xl bg-white p-1.5 shadow-[0_12px_40px_-12px_rgba(0,102,255,0.35)] ring-1 ring-blue-100 transition-shadow duration-300 focus-within:shadow-[0_16px_50px_-10px_rgba(0,102,255,0.5)] focus-within:ring-2 focus-within:ring-[#0066FF]">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-5 text-gray-400 transition-colors group-focus-within:text-[#0066FF]"
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder={content.searchPlaceholder}
                    className="h-12 min-w-0 flex-1 bg-transparent pl-10 pr-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  <motion.button
                    type="button"
                    onClick={handleSearch}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#0066FF] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 sm:px-7"
                  >
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-150%", "400%"] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        repeatDelay: 1.2,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="relative">Search</span>
                    <ArrowRight size={16} className="relative" />
                  </motion.button>
                </div>
              </motion.div>

              <motion.ul
                {...fadeUp(0.6)}
                className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-gray-600"
              >
                {[
                  "Free doorstep pickup",
                  "Instant payment",
                  "Zero deductions",
                ].map((item) => (
                  <li key={item} className="inline-flex items-center gap-1.5">
                    <BadgeCheck size={16} className="text-emerald-500" />
                    {item}
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* ───── Right — floating photo card ───── */}
            <div className="relative hidden w-full max-w-[340px] shrink-0 lg:block xl:max-w-[440px]">
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-[#0066FF]/25 via-[#38BDF8]/20 to-transparent blur-2xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ rotate: 2, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="relative aspect-square overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_30px_80px_-20px_rgba(0,102,255,0.45)] ring-1 ring-white/70"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-3xl">
                      <Image
                        src={content.image}
                        alt={content.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1280px) 340px, 440px"
                        priority
                      />
                    </div>
                  </motion.div>

                  {/* Floating chips */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.4,
                    }}
                    className="absolute -left-8 top-12 z-10 flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-xl ring-1 ring-black/5"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                      <Zap size={18} className="text-amber-500" />
                    </span>
                    <div>
                      <p className="text-xs font-bold leading-tight text-gray-900">
                        Paid Instantly
                      </p>
                      <p className="text-[11px] leading-tight text-gray-500">
                        UPI / bank transfer
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.8,
                    }}
                    className="absolute -right-3 bottom-14 z-10 flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-xl ring-1 ring-black/5"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                      <Truck size={18} className="text-[#0066FF]" />
                    </span>
                    <div>
                      <p className="text-xs font-bold leading-tight text-gray-900">
                        Free Pickup
                      </p>
                      <p className="text-[11px] leading-tight text-gray-500">
                        Same day, at your door
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
