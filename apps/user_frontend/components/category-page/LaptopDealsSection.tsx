// components/category-page/LaptopDealsSection.tsx
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

interface LaptopDeal {
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  image: string;
  variant: "dark" | "light";
}

const LAPTOP_DEALS: LaptopDeal[] = [
  {
    eyebrow: "PRE-OWNED",
    title: "Windows Laptops",
    description: "Dell, HP, Lenovo, Asus certified and tested.",
    features: [
      "Starting from ₹24,999",
      "Brand Warranty / Seller Warranty Included",
      "Ready for Same-Day Shipping",
    ],
    ctaLabel: "Explore Windows Laptops",
    ctaHref: "/buy-used-laptops?os=windows",
    image: "/images/buy-category/Windows.WEBP",
    variant: "dark",
  },
  {
    eyebrow: "APPLE CERTIFIED",
    title: "MacBook Deals",
    description: "MacBook Air, Pro & more. Top condition, low price.",
    features: [
      "1000+ Options Available",
      "Latest Collection of Pre-Owned MacBooks",
      "Quality Checked and Ready to Ship",
    ],
    ctaLabel: "Explore MacBooks",
    ctaHref: "/buy-used-laptops?os=macos",
    image: "/images/buy-category/Macbook.PNG",
    variant: "light",
  },
];

export function LaptopDealsSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full py-8 sm:py-10 lg:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {LAPTOP_DEALS.map(
          ({
            eyebrow,
            title,
            description,
            features,
            ctaLabel,
            ctaHref,
            image,
            variant,
          }) => {
            const isDark = variant === "dark";
            return (
              <div
                key={title}
                className={`relative rounded-2xl border overflow-hidden p-4 sm:p-5 lg:p-6 h-full ${
                  isDark
                    ? "bg-black border-gray-800"
                    : "bg-primary-surface border-primary/20"
                }`}
              >
                <div className="grid grid-cols-[60%_40%] items-center gap-2 h-full">
                  {/* left — text content */}
                  <div>
                    <p
                      className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mb-2 ${
                        isDark ? "text-gray-400" : "text-primary"
                      }`}
                    >
                      {eyebrow}
                    </p>
                    <h3
                      className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1.5 sm:mb-2 ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`text-[11px] sm:text-xs leading-relaxed mb-3 sm:mb-4 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {description}
                    </p>

                    <div className="flex flex-col gap-1.5 mb-4 sm:mb-5">
                      {features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-1.5"
                        >
                          <Check
                            size={12}
                            className={`shrink-0 ${
                              isDark ? "text-gray-400" : "text-primary"
                            }`}
                          />
                          <span
                            className={`text-[10px] sm:text-[11px] ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={ctaHref}
                      className="inline-block bg-primary text-white text-[10px] sm:text-xs font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      {ctaLabel}
                    </Link>
                  </div>

                  {/* right — image */}
                  <div className="relative w-full aspect-square">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 40vw, 20vw"
                    />
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
