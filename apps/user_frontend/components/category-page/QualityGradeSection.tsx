// components/category-page/QualityGradeSection.tsx
"use client";

import { useRef } from "react";
import {
  CheckCircle2,
  Star,
  ThumbsUp,
  Heart,
  ScanLine,
  AlertTriangle,
  Cable,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface GradeTier {
  badge: string;
  badgeIcon: React.ElementType;
  condition: string;
  accessories: string;
  warranty: string;
  colors: {
    cardBg: string;
    cardBorder: string;
    badgeBg: string;
    badgeText: string;
    iconBg: string;
    labelText: string;
    dashed?: boolean;
  };
}

const GRADE_TIERS: GradeTier[] = [
  {
    badge: "OPEN BOX",
    badgeIcon: CheckCircle2,
    condition:
      "Like-new condition with little to no signs of usage. Pristine screen and body.",
    accessories: "Original accessories included whenever available.",
    warranty: "Brand Warranty and/or Seller Warranty available.",
    colors: {
      cardBg: "bg-green-50",
      cardBorder: "border-green-200",
      badgeBg: "bg-green-700",
      badgeText: "text-white",
      iconBg: "bg-green-100 text-green-700",
      labelText: "text-green-700",
    },
  },
  {
    badge: "SUPERB",
    badgeIcon: Star,
    condition:
      "Minimal signs of usage. Excellent overall condition with negligible marks.",
    accessories: "Original or compatible accessories included.",
    warranty: "Seller Warranty available.",
    colors: {
      cardBg: "bg-blue-50",
      cardBorder: "border-blue-200",
      badgeBg: "bg-blue-700",
      badgeText: "text-white",
      iconBg: "bg-blue-100 text-blue-700",
      labelText: "text-blue-700",
    },
  },
  {
    badge: "GOOD",
    badgeIcon: ThumbsUp,
    condition:
      "Visible signs of normal usage but fully functional. Minor scratches possible.",
    accessories: "May include original or compatible accessories.",
    warranty: "Seller Warranty available.",
    colors: {
      cardBg: "bg-gray-50",
      cardBorder: "border-gray-200",
      badgeBg: "bg-gray-800",
      badgeText: "text-white",
      iconBg: "bg-gray-200 text-gray-700",
      labelText: "text-gray-700",
    },
  },
  {
    badge: "VALUE+",
    badgeIcon: Heart,
    condition:
      "Some signs of usage visible. Minor functional issues may be present. See product page.",
    accessories: "Original accessories may or may not be included.",
    warranty: "Seller warranty may or may not be available.",
    colors: {
      cardBg: "bg-orange-50",
      cardBorder: "border-orange-200",
      badgeBg: "bg-orange-600",
      badgeText: "text-white",
      iconBg: "bg-orange-100 text-orange-600",
      labelText: "text-orange-600",
    },
  },
  {
    badge: "FAIR",
    badgeIcon: ScanLine,
    condition:
      "Noticeable cosmetic wear and tear but fully usable. Ideal for value seekers.",
    accessories: "May or may not include accessories.",
    warranty: "Limited seller warranty where applicable.",
    colors: {
      cardBg: "bg-white",
      cardBorder: "border-blue-500",
      badgeBg: "bg-gray-800",
      badgeText: "text-white",
      iconBg: "bg-gray-100 text-gray-500",
      labelText: "text-blue-600",
      dashed: false,
    },
  },
  {
    badge: "Partially Fair & Usable",
    badgeIcon: AlertTriangle,
    condition:
      "Heavy signs of usage and/or functional limitations. Strictly for budget usage.",
    accessories: "May not include accessories.",
    warranty: "Warranty generally not available unless specified.",
    colors: {
      cardBg: "bg-amber-50",
      cardBorder: "border-amber-300",
      badgeBg: "bg-amber-700",
      badgeText: "text-white",
      iconBg: "bg-amber-100 text-amber-700",
      labelText: "text-amber-700",
    },
  },
];

export function QualityGradeSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <span className="inline-block text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full bg-primary-surface text-primary mb-3 sm:mb-4">
        ⓘ HelloFi Quality Standard
      </span>

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-tight mb-5 sm:mb-7">
        Every Device.
        <br />
        <span className="text-primary">Inspected, Graded,</span>
        <br />
        Certified.
      </h2>

      <div className="relative">
        {/* left arrow — hidden at/below 1024px */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white border border-card-border shadow-md hover:bg-primary-surface transition-colors"
        >
          <ChevronLeft size={20} className="text-black" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
        >
          {GRADE_TIERS.map((tier) => {
            const Icon = tier.badgeIcon;
            return (
              <div
                key={tier.badge}
                className={`shrink-0 w-[210px] sm:w-[230px] lg:w-[250px] rounded-2xl border ${
                  tier.colors.dashed ? "border-2 border-dashed" : "border"
                } ${tier.colors.cardBorder} ${tier.colors.cardBg} p-4 sm:p-5`}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <span
                    className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md ${tier.colors.badgeBg} ${tier.colors.badgeText}`}
                  >
                    {tier.badge}
                  </span>
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ${tier.colors.iconBg}`}
                  >
                    <Icon size={13} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:gap-4">
                  <div>
                    <p
                      className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide mb-1 ${tier.colors.labelText}`}
                    >
                      <ScanLine size={11} />
                      Condition
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-600 leading-snug">
                      {tier.condition}
                    </p>
                  </div>

                  <div>
                    <p
                      className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide mb-1 ${tier.colors.labelText}`}
                    >
                      <Cable size={11} />
                      Accessories
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-600 leading-snug">
                      {tier.accessories}
                    </p>
                  </div>

                  <div>
                    <p
                      className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide mb-1 ${tier.colors.labelText}`}
                    >
                      <ShieldCheck size={11} />
                      Warranty
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-600 leading-snug">
                      {tier.warranty}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* right arrow — hidden at/below 1024px */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white border border-card-border shadow-md hover:bg-primary-surface transition-colors"
        >
          <ChevronRight size={20} className="text-black" />
        </button>
      </div>
    </div>
  );
}
