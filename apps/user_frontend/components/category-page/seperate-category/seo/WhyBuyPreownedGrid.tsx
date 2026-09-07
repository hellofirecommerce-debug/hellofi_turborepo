// components/category-page/seperate-category/WhyBuyPreownedGrid.tsx
import {
  ShieldCheck,
  Fingerprint,
  ClipboardCheck,
  Package,
  Truck,
  Award,
  CheckCircle2,
  Wallet,
  RefreshCw,
  Headset,
  PhoneCall,
} from "lucide-react";
import type { ElementType } from "react";

interface Feature {
  icon: ElementType;
  title: string;
  description: string;
}

interface SimpleFeature {
  icon: ElementType;
  title: string;
}

const MOBILE_FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Never Repaired/Never Opened",
    description:
      "No tampering, genuine parts only. Every device is opened for internal inspection only by certified experts.",
  },
  {
    icon: Fingerprint,
    title: "IMEI Verified",
    description:
      "Manual verification and account lock checks to ensure devices are clean, legal, and ready for use.",
  },
  {
    icon: ClipboardCheck,
    title: "Honest Condition Grading",
    description:
      "Real photos and transparent descriptions. Every device is manually inspected and categorized so you get exactly what you pay for.",
  },
  {
    icon: Package,
    title: "Original Accessories",
    description:
      "Many include original box, bill, and chargers. We prioritize complete kits for the premium experience.",
  },
  {
    icon: Truck,
    title: "Fast Pan-India Delivery",
    description:
      "Quick dispatch with real-time tracking across 20,000+ pin codes. Secure, insured shipping.",
  },
  {
    icon: Award,
    title: "Warranty Options",
    description:
      "Up to 3 months HelloFi service warranty provided on all eligible devices for peace of mind.",
  },
];

const LAPTOP_FEATURES: SimpleFeature[] = [
  { icon: Wallet, title: "Save up to 50% compared to buying new" },
  {
    icon: ShieldCheck,
    title: "Brand Warranty / 3 Months HelloFi Service Warranty",
  },
  { icon: RefreshCw, title: "7 Day Replacement on eligible products" },
  { icon: CheckCircle2, title: "Easy EMI & Cash on Delivery (COD)" },
  { icon: Truck, title: "Free Pan India Shipping" },
  { icon: Headset, title: "Dedicated After Sales Support" },
  { icon: PhoneCall, title: "Life Time On Call Assistance" },
];

interface CategoryConfig {
  heading: string;
  subheading?: string;
  variant: "detailed" | "simple";
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  "mobile-phone": {
    heading: "Why Buy Preowned Phones from HelloFi?",
    subheading:
      "We bridge the gap between price and quality through rigorous standards and complete transparency.",
    variant: "detailed",
  },
  laptop: {
    heading: "Why Buy from HelloFi?",
    variant: "simple",
  },
};

interface Props {
  categorySlug: string;
}

export function WhyBuyPreownedGrid({ categorySlug }: Props) {
  const config = CATEGORY_CONFIG[categorySlug];

  if (!config) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 w-full pb-8 sm:pb-10">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black text-center mb-2">
        {config.heading}
      </h2>
      {config.subheading && (
        <p className="text-xs sm:text-sm text-gray-500 text-center mb-6 sm:mb-8">
          {config.subheading}
        </p>
      )}

      {config.variant === "detailed" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {MOBILE_FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white border border-card-border rounded-xl p-4 sm:p-5 flex flex-col gap-2"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-surface flex items-center justify-center">
                <Icon size={16} className="text-primary" />
              </div>
              <p className="text-sm sm:text-base font-bold text-black">
                {title}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {LAPTOP_FEATURES.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="bg-white border border-card-border rounded-xl p-4 sm:p-5 flex items-center gap-3"
            >
              <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-surface flex items-center justify-center">
                <Icon size={16} className="text-primary" />
              </div>
              <p className="text-sm sm:text-base font-semibold text-black">
                {title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
