// components/product-listing/ListingHeader.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  BadgeCheck,
  Truck,
  Wallet,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  LayoutGrid,
} from "lucide-react";

interface CategoryTab {
  label: string;
  value: string | null; // null = "All"
  icon: React.ElementType;
}

const CATEGORY_TABS: CategoryTab[] = [
  { label: "All", value: null, icon: LayoutGrid },
  { label: "Mobiles", value: "mobile-phone", icon: Smartphone },
  { label: "Laptops", value: "laptop", icon: Laptop },
  { label: "Tablets", value: "tablet", icon: Tablet },
  { label: "Smartwatches", value: "smart-watch", icon: Watch },
  { label: "Audio", value: "audio", icon: Headphones },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

interface Props {
  title: string;
  subtitle: string;
  totalCount: number;
  activeCategory?: string;
  onCategoryChange?: (category: string | null) => void;
}

export function ListingHeader({
  title,
  subtitle,
  totalCount,
  activeCategory,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSort = searchParams.get("sort") ?? "newest";

  const selectSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const selectCategory = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5 mb-5 sm:mb-6">
      {/* Badge */}
      <span className="w-fit text-[10px] sm:text-xs font-bold tracking-widest uppercase text-primary bg-primary-surface px-3 py-1.5 rounded-full">
        Premium Certified Preowned
      </span>

      {/* Title + subtitle */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary leading-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      </div>

      {/* Trust badges strip */}
      <div className="bg-primary rounded-xl px-4 sm:px-6 py-3 sm:py-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8">
        <div className="flex items-center gap-2 text-white text-[11px] sm:text-xs font-medium">
          <ShieldCheck size={16} className="shrink-0" />
          40 Points Quality Check
        </div>
        <div className="flex items-center gap-2 text-white text-[11px] sm:text-xs font-medium">
          <BadgeCheck size={16} className="shrink-0" />
          Brand or 3 Months Service Warranty
        </div>
        <div className="flex items-center gap-2 text-white text-[11px] sm:text-xs font-medium">
          <Truck size={16} className="shrink-0" />
          Free Doorstep Delivery
        </div>
        <div className="flex items-center gap-2 text-white text-[11px] sm:text-xs font-medium">
          <Wallet size={16} className="shrink-0" />
          COD and Easy EMI Options
        </div>
      </div>

      {/* Category pill tabs — horizontally scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORY_TABS.map((tab) => {
          const isActive =
            activeCategory === tab.value ||
            (!activeCategory && tab.value === null);
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              onClick={() => selectCategory(tab.value)}
              className={`shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border transition-colors ${
                isActive
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Device count + sort */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs sm:text-sm text-gray-600">
          Showing <span className="font-bold text-black">{totalCount}</span>{" "}
          devices available
        </p>

        <div className="hidden sm:flex items-center gap-2">
          <label className="text-xs sm:text-sm text-gray-500 font-medium">
            Sort by:
          </label>
          <select
            value={activeSort}
            onChange={(e) => selectSort(e.target.value)}
            className="h-9 px-3 text-xs sm:text-sm border border-gray-300 rounded-lg bg-white text-gray-800 font-medium cursor-pointer focus:outline-none focus:border-primary"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
