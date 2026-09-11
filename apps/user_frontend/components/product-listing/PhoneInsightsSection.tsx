// components/product-listing/PhoneInsightsSection.tsx
"use client";

import Link from "next/link";
import {
  PiggyBank,
  Smartphone,
  Star,
  Zap,
  Rocket,
  Gem,
  ArrowRight,
} from "lucide-react";

const PRICE_TAGS = [
  "Model Age",
  "Battery Health",
  "Grade Condition",
  "Market Demand",
];

const BUDGET_PILLS = [
  { label: "Under ₹10,000", icon: PiggyBank, href: "?price_max=10000" },
  { label: "Under ₹15,000", icon: Smartphone, href: "?price_max=15000" },
  { label: "Under ₹20,000", icon: Star, href: "?price_max=20000" },
  { label: "Under ₹30,000", icon: Zap, href: "?price_max=30000" },
  { label: "Under ₹50,000", icon: Rocket, href: "?price_max=50000" },
  {
    label: "Premium Flagship",
    icon: Gem,
    href: "?price_min=50000",
    highlighted: true,
  },
];

export function PhoneInsightsSection() {
  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Two info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-card-border rounded-xl p-4 sm:p-5">
          <h3 className="text-sm sm:text-base font-bold text-primary mb-2">
            What Determines the Price of a Preowned Phone?
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4">
            The price of a used smartphone depends on multiple factors including
            model age, storage capacity, battery condition, cosmetic grade,
            market demand, software support period, and accessory availability.
            Flagship models generally retain value longer than budget devices
            due to stronger demand and extended usability.
          </p>
          <div className="flex flex-wrap gap-2">
            {PRICE_TAGS.map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white border border-card-border rounded-xl p-4 sm:p-5">
          <h3 className="text-sm sm:text-base font-bold text-primary mb-2">
            Why More People Are Buying Preowned Mobiles
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4">
            The preowned smartphone market continues to grow as consumers seek
            premium devices at lower costs. Rising flagship smartphone prices,
            sustainability awareness, and improved quality verification
            standards have contributed to increasing demand for professionally
            inspected used smartphones.
          </p>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-base sm:text-lg font-bold text-primary">30%</p>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Annual Growth
              </p>
            </div>
            <div className="text-center">
              <p className="text-base sm:text-lg font-bold text-success">Eco</p>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Sustainable Choice
              </p>
            </div>
            <div className="text-center">
              <p className="text-base sm:text-lg font-bold text-primary">50%</p>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Avg. Savings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget pills */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm sm:text-base font-bold text-black">
            Best Selling Preowned Phones by Budget
          </h3>
          <Link
            href="#"
            className="hidden sm:flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          Premium performance for every price point.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {BUDGET_PILLS.map((pill) => {
            const Icon = pill.icon;
            return (
              <Link
                key={pill.label}
                href={pill.href}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 sm:p-4 text-center transition-colors ${
                  pill.highlighted
                    ? "bg-primary text-white"
                    : "bg-white border border-card-border text-gray-700 hover:border-primary"
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] sm:text-xs font-semibold">
                  {pill.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Latest models text */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-black mb-2">
          Latest Smartphone Models Available in Preowned Condition
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Latest Smartphone Models Available in Preowned Condition. Popular
          choices among premium smartphone buyers currently include recent
          generation Apple iPhones, Samsung Galaxy S-series devices, Google
          Pixel smartphones, and OnePlus flagship models. These devices continue
          to receive software updates while offering substantial savings
          compared to new retail prices.
        </p>
      </div>
    </div>
  );
}
