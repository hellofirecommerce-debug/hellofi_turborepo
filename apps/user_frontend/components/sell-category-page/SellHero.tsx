// components/sell-category-page/SellHero.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

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
    image: "/images/sell-category/sell-laptop.PNG",
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
    image: "/images/sell-category/sell-tablet.PNG",
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
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 pb-10 sm:pb-14 lg:pb-16">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch justify-between">
          {/* Left — copy + search */}
          <div className="w-full min-w-0 lg:max-w-md xl:max-w-xl lg:shrink flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-4xl xl:text-6xl font-extrabold text-gray-900 leading-[1.05] tracking-tight">
              <span className="whitespace-nowrap">{content.title1}</span>
              <br />
              {content.title2}
              <br />
              <span className="text-[#0066FF]">{content.title3}</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl">
              {content.subtitle}
            </p>

            <p className="mt-6 text-base sm:text-lg font-bold text-[#0066FF]">
              Find Your{" "}
              {content.title1.replace("Sell Your ", "").replace(".", "")}. Get
              an Instant Price.
            </p>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              {content.searchPrompt}
            </p>

            <div className="mt-3 relative w-full max-w-xl">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={content.searchPlaceholder}
                className="w-full h-12 pl-10 pr-28 rounded-xl border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20"
              />
              <button
                onClick={handleSearch}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-6 rounded-xl bg-[#0066FF] text-white text-sm font-semibold hover:bg-[#0052cc] transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>

          {/* Right — photo */}
          <div className="hidden lg:block w-full max-w-[320px] xl:max-w-[420px] shrink-0">
            <div className="relative w-full h-[320px] xl:h-[420px] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={content.image}
                alt={content.imageAlt}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 320px, 480px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
