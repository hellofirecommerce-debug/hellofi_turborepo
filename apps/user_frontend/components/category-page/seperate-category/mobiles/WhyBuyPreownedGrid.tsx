import {
  ShieldCheck,
  Fingerprint,
  ClipboardCheck,
  Package,
  Truck,
  Award,
} from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
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

export function WhyBuyPreownedGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full pb-8 sm:pb-10">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black text-center mb-2">
        Why Buy Preowned Phones from HelloFi?
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 text-center mb-6 sm:mb-8">
        We bridge the gap between price and quality through rigorous standards
        and complete transparency.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="bg-white border border-card-border rounded-xl p-4 sm:p-5 flex flex-col gap-2"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-surface flex items-center justify-center">
              <Icon size={16} className="text-primary" />
            </div>
            <p className="text-sm sm:text-base font-bold text-black">{title}</p>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
