// components/category-page/shared/NotSureWhatToBuySection.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BuyerGuideCard {
  image: string;
  subtitle: string;
  href: string;
}

const BUYER_GUIDE_CARDS: BuyerGuideCard[] = [
  {
    image: "/images/buy-category/mobiles/Camera.png",
    subtitle: "Pro-grade photography",
    href: "/buy-used-mobile-phones?filter=camera",
  },
  {
    image: "/images/buy-category/mobiles/Battery.png",
    subtitle: "Long Lasting Battery",
    href: "/buy-used-mobile-phones?filter=battery",
  },
  {
    image: "/images/buy-category/mobiles/AI.png",
    subtitle: "Best Experience",
    href: "/buy-used-mobile-phones?filter=ai",
  },
  {
    image: "/images/buy-category/mobiles/Students.png",
    subtitle: "Budget Friendly",
    href: "/buy-used-mobile-phones?filter=students",
  },
];

export function NotSureWhatToBuySection() {
  return (
    <div className="max-w-3xl mx-auto px-4 w-full text-center">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-2">
        Not Sure What to Buy?
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-1.5">
        Discover the best devices for your budget and usage needs.
      </p>
      <div
        className="w-10 h-0.5 mx-auto mb-5 sm:mb-6"
        style={{ backgroundColor: "#002F94" }}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {BUYER_GUIDE_CARDS.map(({ image, subtitle, href }) => (
          <div
            key={subtitle}
            className="bg-white border border-card-border rounded-xl p-3 sm:p-4 flex flex-col items-center text-center gap-1.5"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={subtitle}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-400">
              {subtitle}
            </p>
            <Link
              href={href}
              className="flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold hover:underline mt-0.5"
              style={{ color: "#002F94" }}
            >
              Shop Now
              <ArrowRight size={11} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
