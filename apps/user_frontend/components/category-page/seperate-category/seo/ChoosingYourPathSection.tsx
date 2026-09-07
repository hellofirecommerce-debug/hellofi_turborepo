// components/category-page/mobile/ChoosingYourPathSection.tsx
import Image from "next/image";
import { Smartphone, Sparkles, TrendingUp } from "lucide-react";

interface PathFeature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FEATURES: PathFeature[] = [
  {
    icon: Smartphone,
    title: "Operating System",
    description:
      "iOS offers seamless simplicity and regular updates. Android provides ultimate customization and a vast open ecosystem.",
  },
  {
    icon: Sparkles,
    title: "Ecosystem",
    description:
      "Apple is unrivaled in device continuity. Android integrates deeply with Google services and diverse hardware brands.",
  },
  {
    icon: TrendingUp,
    title: "Value Retention",
    description:
      "iPhones typically hold resale value longer. Android flagships often offer more hardware features (like zoom or charging speed) for the price.",
  },
];

export function ChoosingYourPathSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
        {/* left — text content (first on mobile too) */}
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-4 sm:mb-5">
            Choosing Your Path
          </h2>

          <div className="flex flex-col gap-4 sm:gap-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-3">
                <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-surface flex items-center justify-center">
                  <Icon size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-black uppercase tracking-wide mb-1">
                    {title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right — Android vs iPhone image */}
        <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden">
          <Image
            src="/images/buy-category/mobiles/AndroidvsIos.png"
            alt="Android vs iPhone comparison"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
